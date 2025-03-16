'use server';

import { subscriptionsAdminTable } from '@/lib/supabase/admin-tables';
import { revalidatePath } from 'next/cache';

/**
 * Server action to create a new subscription
 */
export async function createSubscription(subscription: any) {
  try {
    const result = await subscriptionsAdminTable.create(subscription);
    revalidatePath('/admin/subscriptions');
    revalidatePath(`/admin/platforms/${subscription.platform_id}`);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return { 
      success: false, 
      error: error.message || JSON.stringify(error) 
    };
  }
}

/**
 * Server action to update an existing subscription
 */
export async function updateSubscription(id: string, updates: any) {
  try {
    const result = await subscriptionsAdminTable.update(id, updates);
    revalidatePath(`/admin/subscriptions/${id}`);
    revalidatePath('/admin/subscriptions');
    revalidatePath(`/admin/platforms/${updates.platform_id}`);
    return { success: true, data: result };
  } catch (error: any) {
    console.error(`Error updating subscription with id ${id}:`, error);
    return { 
      success: false, 
      error: error.message || JSON.stringify(error) 
    };
  }
}

/**
 * Server action to delete a subscription
 */
export async function deleteSubscription(id: string, platformId: string) {
  try {
    await subscriptionsAdminTable.delete(id);
    revalidatePath('/admin/subscriptions');
    revalidatePath(`/admin/platforms/${platformId}`);
    return { success: true };
  } catch (error: any) {
    console.error(`Error deleting subscription with id ${id}:`, error);
    return { 
      success: false, 
      error: error.message || JSON.stringify(error) 
    };
  }
}

/**
 * Server action to get a subscription by ID
 */
export async function getSubscriptionById(id: string) {
  try {
    // Since we don't have a direct getById method for subscriptions,
    // we'll get all subscriptions and find the one with the matching ID
    const allSubscriptions = await subscriptionsAdminTable.getByPlatformId('*');
    const subscription = allSubscriptions.find((sub: any) => sub.id === id);
    
    if (!subscription) {
      return { 
        success: false, 
        error: 'Subscription not found' 
      };
    }
    
    return { success: true, data: subscription };
  } catch (error: any) {
    console.error(`Error getting subscription with id ${id}:`, error);
    return { 
      success: false, 
      error: error.message || JSON.stringify(error) 
    };
  }
}

/**
 * Server action to get all subscriptions for a platform
 */
export async function getSubscriptionsByPlatformId(platformId: string) {
  try {
    const result = await subscriptionsAdminTable.getByPlatformId(platformId);
    return { success: true, data: result };
  } catch (error: any) {
    console.error(`Error getting subscriptions for platform ${platformId}:`, error);
    return { 
      success: false, 
      error: error.message || JSON.stringify(error) 
    };
  }
}
