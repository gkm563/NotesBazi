"use server";

import { createClient } from "@/lib/supabase/server";
import { extractMetadata } from "@/lib/gemini";
import { revalidatePath } from "next/cache";

export async function uploadNoteAction(formData: {
  title: string;
  subject: string;
  year: string;
  type: string;
  description: string;
  file_url: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Call Gemini for extra insights with fallback
  let aiData = { summary: "", keywords: [] };
  try {
    aiData = await extractMetadata(formData.title, formData.description, formData.subject);
  } catch (aiError) {
    console.error("AI extraction failed, using defaults:", aiError);
  }

  const { data, error } = await supabase
    .from("notes")
    .insert({
      title: formData.title,
      subject: formData.subject,
      year: formData.year,
      type: formData.type,
      description: formData.description,
      file_url: formData.file_url,
      uploaded_by: user.id,
      summary: aiData?.summary || "",
      keywords: aiData?.keywords || [],
      downloads: 0,
      is_verified: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error(`Failed to save note: ${error.message}`);
  }

  revalidatePath("/notes");
  revalidatePath("/dashboard");
  
  return data;
}

export async function deleteNoteAction(noteId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Fetch the note to get the file_url
  const { data: note, error: fetchError } = await supabase
    .from("notes")
    .select("file_url, uploaded_by")
    .eq("id", noteId)
    .single();

  if (fetchError || !note) throw new Error("Note not found");
  if (note.uploaded_by !== user.id) throw new Error("Unauthorized to delete this note");

  // Extract file path from URL (Assuming format: .../storage/v1/object/public/notes/USER_ID/FILENAME)
  const urlParts = note.file_url.split('/notes/');
  if (urlParts.length > 1) {
    const filePath = urlParts[1];
    // Delete from storage
    await supabase.storage.from('notes').remove([filePath]);
  }

  // Delete from database
  const { error: deleteError } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId)
    .eq("uploaded_by", user.id);

  if (deleteError) throw deleteError;

  revalidatePath("/notes");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function reportNoteAction(formData: {
  noteId: string;
  reason: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("reports")
    .insert({
      note_id: formData.noteId,
      user_id: user.id,
      reason: formData.reason,
      status: "pending"
    });

  if (error) {
    console.error("Report submission error:", error);
    throw new Error(`Failed to submit report: ${error.message}`);
  }

  return { success: true };
}

export async function updateNoteAction(noteId: string, formData: {
  title: string;
  subject: string;
  year: string;
  type: string;
  description: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("notes")
    .update({
      title: formData.title,
      subject: formData.subject,
      year: formData.year,
      type: formData.type,
      description: formData.description,
    })
    .eq("id", noteId)
    .eq("uploaded_by", user.id);

  if (error) {
    console.error("Supabase update error:", error);
    throw new Error(`Failed to update note: ${error.message}`);
  }

  revalidatePath("/notes");
  revalidatePath(`/notes/${noteId}`);
  revalidatePath("/dashboard");
  
  return { success: true };
}
