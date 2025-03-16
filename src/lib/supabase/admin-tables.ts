import { createAdminClient } from './admin-client';

// Mark this file as server-only
export const dynamic = 'force-dynamic';

// Helper functions for platforms using admin client to bypass RLS
// These functions should only be used in server-side contexts (API routes, Server Actions)
export const platformsAdminTable = {
  async getAll() {
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
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

    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
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
  
  async create(platform: any) {
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
      .from('platforms')
      .insert(platform)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating platform:', error);
      throw error;
    }
    
    return data;
  },
  
  async update(id: string, updates: any) {
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
      .from('platforms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating platform with id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  async delete(id: string) {
    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin
      .from('platforms')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting platform with id ${id}:`, error);
      throw error;
    }
    
    return true;
  }
};

// Helper functions for subscriptions using admin client to bypass RLS
// These functions should only be used in server-side contexts (API routes, Server Actions)
export const subscriptionsAdminTable = {
  async getByPlatformId(platformId: string) {
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
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
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .insert(subscription)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
    
    return data;
  },
  
  async update(id: string, updates: any) {
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating subscription with id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  async delete(id: string) {
    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting subscription with id ${id}:`, error);
      throw error;
    }
    
    return true;
  }
};
