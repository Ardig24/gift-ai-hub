'use server';

import { platformsAdminTable, subscriptionsAdminTable } from '@/lib/supabase/admin-tables';
import { revalidatePath } from 'next/cache';

/**
 * Server action to create a new platform
 */
export async function createPlatform(platform: any) {
  try {
    const result = await platformsAdminTable.create(platform);
    revalidatePath('/admin/platforms');
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error creating platform:', error);
    return { 
      success: false, 
      error: error.message || JSON.stringify(error) 
    };
  }
}

/**
 * Server action to update an existing platform
 */
export async function updatePlatform(id: string, updates: any) {
  try {
    const result = await platformsAdminTable.update(id, updates);
    revalidatePath(`/admin/platforms/${id}`);
    revalidatePath('/admin/platforms');
    return { success: true, data: result };
  } catch (error: any) {
    console.error(`Error updating platform with id ${id}:`, error);
    return { 
      success: false, 
      error: error.message || JSON.stringify(error) 
    };
  }
}

/**
 * Server action to delete a platform
 */
export async function deletePlatform(id: string) {
  try {
    await platformsAdminTable.delete(id);
    revalidatePath('/admin/platforms');
    return { success: true };
  } catch (error: any) {
    console.error(`Error deleting platform with id ${id}:`, error);
    return { 
      success: false, 
      error: error.message || JSON.stringify(error) 
    };
  }
}

/**
 * Server action to get a platform by ID
 */
export async function getPlatformById(id: string) {
  try {
    const result = await platformsAdminTable.getById(id);
    return { success: true, data: result };
  } catch (error: any) {
    console.error(`Error getting platform with id ${id}:`, error);
    return { 
      success: false, 
      error: error.message || JSON.stringify(error) 
    };
  }
}

/**
 * Server action to get all platforms
 */
export async function getAllPlatforms() {
  try {
    const result = await platformsAdminTable.getAll();
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error getting all platforms:', error);
    return { 
      success: false, 
      error: error.message || JSON.stringify(error) 
    };
  }
}
