const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xhohlmufzsdlsmhvzyxz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhob2hsbXVmenNkbHNtaHZ6eXh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzM3NTYyMywiZXhwIjoyMDkyOTUxNjIzfQ.eKLAFDor3wkVsJbJD15ifYrmX2Csr9_qjuHUK0BLzd8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyAdmin() {
  const email = 'admin@notesbazi.com';
  console.log(`Verifying admin status for ${email}...`);

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
  } else {
    console.log('Profile found:', data);
  }
}

verifyAdmin();
