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

  // Call Gemini for extra insights
  const aiData = await extractMetadata(formData.title, formData.description, formData.subject);

  const { data, error } = await supabase
    .from("notes")
    .insert({
      ...formData,
      uploaded_by: user.id,
      summary: aiData.summary,
      keywords: aiData.keywords,
    })
    .select()
    .single();

  if (error) throw error;

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

  // Extract file path from URL (Assuming format: .../storage/v1/object/public/notes_storage/USER_ID/FILENAME)
  const urlParts = note.file_url.split('/notes_storage/');
  if (urlParts.length > 1) {
    const filePath = urlParts[1];
    // Delete from storage
    await supabase.storage.from('notes_storage').remove([filePath]);
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
