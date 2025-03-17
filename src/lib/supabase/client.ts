import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Only log the error in development, not during build
if ((!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'https://placeholder-url.supabase.co' || 
    supabaseAnonKey === 'placeholder-key') && 
    process.env.NODE_ENV === 'development') {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for platforms
export const platformsTable = {
  async getAll() {
    const { data, error } = await supabase
      .from('platforms')
      .select('*, subscriptions(*)');
    
    if (error) {
      console.error('Error fetching platforms:', error);
      return [];
    }
    
    return data || [];
  },
  
  async getById(id: string) {
    // If id is 'new', return an empty platform template
    if (id === 'new') {
      return {
        id: 'new',
        name: '',
        company: '',
        category: '',
        description: '',
        features: [],
        color: '#7c3aed',
        subscriptions: []
      };
    }

    const { data, error } = await supabase
      .from('platforms')
      .select('*, subscriptions(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching platform with id ${id}:`, error);
      return null;
    }
    
    return data;
  },
  
  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('platforms')
      .select('*, subscriptions(*)')
      .eq('category', category);
    
    if (error) {
      console.error(`Error fetching platforms in category ${category}:`, error);
      return [];
    }
    
    return data || [];
  },
  
  async create(platform: any) {
    const { data, error } = await supabase
      .from('platforms')
      .insert(platform)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating platform:', error);
      return null;
    }
    
    return data;
  },
  
  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('platforms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating platform with id ${id}:`, error);
      return null;
    }
    
    return data;
  },
  
  async delete(id: string) {
    const { error } = await supabase
      .from('platforms')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting platform with id ${id}:`, error);
      return false;
    }
    
    return true;
  }
};

// Helper functions for subscriptions
export const subscriptionsTable = {
  async getByPlatformId(platformId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('platform_id', platformId);
    
    if (error) {
      console.error(`Error fetching subscriptions for platform ${platformId}:`, error);
      return [];
    }
    
    return data || [];
  },
  
  async create(subscription: any) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscription)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating subscription:', error);
      return null;
    }
    
    return data;
  },
  
  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating subscription with id ${id}:`, error);
      return null;
    }
    
    return data;
  },
  
  async delete(id: string) {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting subscription with id ${id}:`, error);
      return false;
    }
    
    return true;
  }
};

// Helper functions for orders
export const ordersTable = {
  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select('*');
    
    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
    
    return data || [];
  },
  
  async getById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching order with id ${id}:`, error);
      return null;
    }
    
    return data;
  },
  
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error(`Error fetching orders for user ${userId}:`, error);
      return [];
    }
    
    return data || [];
  },
  
  async create(order: any) {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating order:', error);
      return null;
    }
    
    return data;
  },
  
  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating order with id ${id}:`, error);
      return null;
    }
    
    return data;
  },
  
  async delete(id: string) {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting order with id ${id}:`, error);
      return false;
    }
    
    return true;
  },
  
  async updateBySessionId(sessionId: string, updates: any) {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('session_id', sessionId)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating order with session_id ${sessionId}:`, error);
      return null;
    }
    
    return data;
  }
};

// Auth helper functions
export const auth = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Error signing in:', error);
      return { user: null, error };
    }
    
    return { user: data.user, error: null };
  },
  
  async signOut() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      return false;
    }
    
    return true;
  },
  
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    
    return data?.user || null;
  },
  
  async isAdmin() {
    const user = await this.getCurrentUser();
    
    if (!user) return false;
    
    // Check if user has admin role in user_roles table
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    if (error || !data) return false;
    
    return data.role === 'admin';
  }
};
