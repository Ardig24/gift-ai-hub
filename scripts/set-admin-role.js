// Script to directly set a user as admin in the database
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

async function setAdminRole(userId) {
  try {
    // First check if the user already has an admin role
    const { data: existingRole, error: checkError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);
    
    console.log('Existing roles:', existingRole);
    
    if (checkError) {
      console.error('Error checking existing roles:', checkError.message);
      return;
    }
    
    // If user already has an admin role, don't add another one
    if (existingRole && existingRole.some(role => role.role === 'admin')) {
      console.log('User already has admin role. Updating to ensure it works...');
      
      // Update the existing admin role to refresh it
      const { error: updateError } = await supabase
        .from('user_roles')
        .update({ role: 'admin' })
        .eq('user_id', userId)
        .eq('role', 'admin');
      
      if (updateError) {
        console.error('Error updating admin role:', updateError.message);
      } else {
        console.log('Admin role refreshed successfully!');
      }
      
      return;
    }
    
    // Add admin role
    const { data, error } = await supabase
      .from('user_roles')
      .insert([
        { user_id: userId, role: 'admin' }
      ]);
    
    if (error) {
      console.error('Error adding admin role:', error.message);
      return;
    }
    
    console.log('Admin role added successfully!');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    rl.close();
  }
}

// Ask for user ID
rl.question('Enter your Supabase user ID: ', (userId) => {
  if (!userId) {
    console.log('User ID is required. Please try again.');
    rl.close();
    return;
  }
  
  setAdminRole(userId);
});
