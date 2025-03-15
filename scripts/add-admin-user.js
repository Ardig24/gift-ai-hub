// Script to add an admin user to the database
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function addAdminUser(email) {
  try {
    // First, get the user by email
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error listing users:', usersError.message);
      return;
    }
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.log(`No user found with email: ${email}`);
      console.log('Please sign up first at http://localhost:3000/admin/login');
      return;
    }
    
    console.log(`Found user with ID: ${user.id}`);
    
    // Check if user already has admin role
    const { data: existingRole, error: roleCheckError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', 'admin');
    
    if (roleCheckError) {
      console.error('Error checking existing role:', roleCheckError.message);
      return;
    }
    
    if (existingRole && existingRole.length > 0) {
      console.log('This user already has the admin role.');
      return;
    }
    
    // Add admin role
    const { data: insertData, error: insertError } = await supabase
      .from('user_roles')
      .insert([
        { user_id: user.id, role: 'admin' }
      ]);
    
    if (insertError) {
      console.error('Error adding admin role:', insertError.message);
      return;
    }
    
    console.log('Admin role added successfully!');
    
    // Provide SQL to manually add if needed
    console.log('\nIf you need to manually add this role in the Supabase SQL editor, use:');
    console.log(`INSERT INTO public.user_roles (user_id, role) VALUES ('${user.id}', 'admin');`);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    rl.close();
  }
}

// Ask for email
rl.question('Enter the email address of the user to make admin: ', (email) => {
  addAdminUser(email);
});
