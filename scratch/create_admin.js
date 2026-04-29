const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xhohlmufzsdlsmhvzyxz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhob2hsbXVmenNkbHNtaHZ6eXh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzM3NTYyMywiZXhwIjoyMDkyOTUxNjIzfQ.eKLAFDor3wkVsJbJD15ifYrmX2Csr9_qjuHUK0BLzd8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin() {
  const email = 'admin@notesbazi.com';
  const password = 'Admin@123';

  console.log(`Attempting to create/update user ${email}...`);

  // Try creating first
  const { data: createData, error: createError } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: { full_name: 'System Admin' }
  });

  if (createError) {
    console.log('Create failed, checking error...');
    if (createError.message.includes('already exists') || createError.status === 422) {
      console.log('User already exists. Updating password instead...');
      // We need the user ID to update. Let's try to get it from profiles if listUsers fails.
      const { data: profile } = await supabase.from('profiles').select('id').eq('email', email).single();
      if (profile) {
          const { error: updateError } = await supabase.auth.admin.updateUserById(profile.id, { password: password });
          if (updateError) console.error('Update failed:', updateError);
          else console.log('Password updated successfully!');
      } else {
          console.error('User exists in Auth but not in Profiles. Cannot get ID to update password.');
      }
    } else {
      console.error('Error creating user:', createError);
    }
  } else {
    console.log('User created successfully!');
  }

  // Ensure role is admin
  const { data: profile } = await supabase.from('profiles').select('id').eq('email', email).single();
  if (profile) {
      await supabase.from('profiles').update({ role: 'admin' }).eq('id', profile.id);
      console.log('Role set to admin.');
  }
}

createAdmin();
