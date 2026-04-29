const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xhohlmufzsdlsmhvzyxz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhob2hsbXVmenNkbHNtaHZ6eXh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzM3NTYyMywiZXhwIjoyMDkyOTUxNjIzfQ.eKLAFDor3wkVsJbJD15ifYrmX2Csr9_qjuHUK0BLzd8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  console.log('Testing connection to Supabase...');
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  
  if (error) {
    console.error('Error connecting to DB:', error);
  } else {
    console.log('Successfully connected to DB! Row count:', data.length);
  }
}

testConnection();
