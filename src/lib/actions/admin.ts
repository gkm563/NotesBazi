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
