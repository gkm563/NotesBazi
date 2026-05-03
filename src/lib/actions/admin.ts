'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function toggleBlockUser(userId: string, currentStatus: boolean) {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('profiles')
    .update({ is_blocked: !currentStatus })
    .eq('id', userId)

  if (error) {
    console.error('Error toggling user block status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function deleteUserAccount(userId: string) {
  const supabase = createAdminClient()

  // 1. Delete from Auth (this usually cascades to profiles, but we'll do both to be safe)
  const { error: authError } = await supabase.auth.admin.deleteUser(userId)
  
  if (authError) {
    console.error('Error deleting user from Auth:', authError)
    // Even if auth delete fails (e.g. user already gone from auth), try deleting profile
  }

  // 2. Delete from Profiles
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)

  if (profileError) {
    console.error('Error deleting user from Profiles:', profileError)
    return { success: false, error: profileError.message }
  }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function resolveReport(reportId: string, status: 'resolved' | 'ignored') {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('reports')
    .update({ status })
    .eq('id', reportId)

  if (error) {
    console.error('Error resolving report:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/reports')
  return { success: true }
}

export async function deleteResourceByAdmin(noteId: string, reportId?: string) {
  const supabase = createAdminClient()

  // 1. Fetch note to get file_url
  const { data: note } = await supabase
    .from('notes')
    .select('file_url')
    .eq('id', noteId)
    .single()

  if (note?.file_url) {
    // Extract file path from URL
    const urlParts = note.file_url.split('/notes/')
    if (urlParts.length > 1) {
      await supabase.storage.from('notes').remove([urlParts[1]])
    }
  }

  // 2. Delete note (cascades to reports)
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId)

  if (error) {
    console.error('Error deleting note as admin:', error)
    return { success: false, error: error.message }
  }

  if (reportId) {
    // Also mark report as resolved if it wasn't already cascaded
    await supabase.from('reports').update({ status: 'resolved' }).eq('id', reportId)
  }

  revalidatePath('/admin/reports')
  revalidatePath('/admin/notes')
  revalidatePath('/notes')
  return { success: true }
}

export async function verifyResourceAction(noteId: string, currentStatus: boolean) {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('notes')
    .update({ is_verified: !currentStatus })
    .eq('id', noteId)

  if (error) {
    console.error('Error verifying note:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/notes')
  revalidatePath('/notes')
  return { success: true }
}

export async function updateResourceByAdmin(noteId: string, formData: {
  title: string;
  subject: string;
  year: string;
  semester: number;
  type: string;
  description: string;
}) {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('notes')
    .update({
      title: formData.title,
      subject: formData.subject,
      year: formData.year,
      semester: formData.semester,
      type: formData.type,
      description: formData.description,
    })
    .eq('id', noteId)

  if (error) {
    console.error('Error updating note as admin:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/notes')
  revalidatePath('/notes')
  revalidatePath(`/notes/${noteId}`)
  return { success: true }
}

export async function bulkDeleteResourcesByAdmin(noteIds: string[]) {
  const supabase = createAdminClient()
  
  // 1. Fetch all notes to get file URLs
  const { data: notes } = await supabase
    .from('notes')
    .select('file_url')
    .in('id', noteIds)

  const filePaths = notes?.map(n => {
    const parts = n.file_url.split('/notes/')
    return parts.length > 1 ? parts[1] : null
  }).filter(Boolean) as string[]

  if (filePaths.length > 0) {
    await supabase.storage.from('notes').remove(filePaths)
  }

  // 2. Delete from DB
  const { error } = await supabase
    .from('notes')
    .delete()
    .in('id', noteIds)

  if (error) {
    console.error('Bulk delete error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/notes')
  revalidatePath('/notes')
  return { success: true }
}

export async function bulkVerifyResourcesAction(noteIds: string[], status: boolean) {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('notes')
    .update({ is_verified: status })
    .in('id', noteIds)

  if (error) {
    console.error('Bulk verify error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/notes')
  revalidatePath('/notes')
  return { success: true }
}

export async function bulkUpdateDetailsByAdmin(noteIds: string[], details: {
  year?: string;
  semester?: number;
}) {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('notes')
    .update(details)
    .in('id', noteIds)

  if (error) {
    console.error('Bulk update details error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/notes')
  revalidatePath('/notes')
  return { success: true }
}
