// Script to check if a user has admin role in the database
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCurrentUser() {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting current user:', userError.message);
      return;
    }
    
    if (!user) {
      console.log('No user is currently logged in. Please log in first.');
      return;
    }
    
    console.log('Current user ID:', user.id);
    console.log('Email:', user.email);
    
    // Check user_roles table
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id);
    
    if (roleError) {
      console.error('Error checking user role:', roleError.message);
      return;
    }
    
    if (!roleData || roleData.length === 0) {
      console.log('No role found for this user in the user_roles table.');
      console.log('To add admin role, run this SQL in Supabase:');
      console.log(`INSERT INTO public.user_roles (user_id, role) VALUES ('${user.id}', 'admin');`);
    } else {
      console.log('User roles found:', roleData);
      const isAdmin = roleData.some(role => role.role === 'admin');
      console.log('Is admin?', isAdmin ? 'Yes' : 'No');
    }
    
    // List all users with admin role for comparison
    const { data: allAdmins, error: adminsError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('role', 'admin');
    
    if (adminsError) {
      console.error('Error fetching admin users:', adminsError.message);
      return;
    }
    
    console.log('\nAll users with admin role:');
    console.log(allAdmins);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkCurrentUser();
