"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData: {
  name?: string;
  username?: string;
  department?: string;
  year?: string;
  semester?: number;
  avatar_url?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const updateData: Record<string, any> = {
    name: formData.name,
    username: formData.username,
    department: formData.department,
    year: formData.year,
    semester: formData.semester,
  };
  if (formData.avatar_url !== undefined) {
    updateData.avatar_url = formData.avatar_url;
  }

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    console.error("Profile update error:", error);
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath("/notes");
  return { success: true };
}
