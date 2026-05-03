import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch everything in parallel for maximum speed
  const [profileRes, notesRes, savedRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("notes").select("*, semester").eq("uploaded_by", user.id).order("created_at", { ascending: false }),
    supabase.from("saved_notes").select(`
      id,
      notes (
        id,
        title,
        subject,
        year,
        semester,
        type,
        downloads,
        views
      )
    `).eq("user_id", user.id).order("created_at", { ascending: false })
  ]);

  const profile = profileRes.data;
  const notes = notesRes.data || [];
  const savedNotesData = savedRes.data || [];

  if (profile?.role === 'admin') {
    redirect("/admin");
  }

  const totalDownloads = notes.reduce((acc: number, note: any) => acc + (note.downloads || 0), 0);
  const totalViews = notes.reduce((acc: number, note: any) => acc + (note.views || 0), 0);
  const contributionLevel = totalDownloads > 100 ? "Gold Contributor" : totalDownloads > 50 ? "Silver Contributor" : "Rising Star";

  return (
    <main className="min-h-screen bg-background transition-colors py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <DashboardClient 
        initialProfile={profile}
        initialNotes={notes}
        initialSavedNotes={savedNotesData}
        stats={{
          totalDownloads,
          totalViews,
          contributionLevel
        }}
      />
    </main>
  );
}
