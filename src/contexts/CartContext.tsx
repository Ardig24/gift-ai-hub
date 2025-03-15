"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Platform, Subscription } from '@/lib/supabase/types'

// Define the cart item type
export interface CartItem {
  platformId: string
  platformName: string
  platformColor: string
  subscription: Subscription
  recipientName: string
  recipientEmail: string
  senderName: string
  message: string
}

// Define the cart context type
interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (index: number) => void
  clearCart: () => void
  checkout: () => Promise<{ success: boolean; url?: string; error?: string }>
  totalPrice: number
  serviceFee: number
  grandTotal: number
}

// Create the context with default values
const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  checkout: async () => ({ success: false, error: 'Cart context not initialized' }),
  totalPrice: 0,
  serviceFee: 4.99,
  grandTotal: 0
})

// Hook to use the cart context
export const useCart = () => useContext(CartContext)

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  // Service fee amount
  const serviceFee = 4.99

  // Initialize cart from localStorage if available
  const [items, setItems] = useState<CartItem[]>([])
  
  // Calculate totals
  const totalPrice = items.reduce((sum, item) => sum + item.subscription.price, 0)
  const grandTotal = totalPrice + serviceFee
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    // First check if we have a cart backup (from returning from checkout)
    const cartBackup = localStorage.getItem('giftAiCartBackup')
    const savedCart = localStorage.getItem('giftAiCart')
    
    // Determine which cart to use - prefer backup if available
    let cartToRestore = null
    
    if (cartBackup) {
      try {
        cartToRestore = JSON.parse(cartBackup)
        console.log('Restoring cart from backup after checkout')
        // Clear the backup after restoring
        localStorage.removeItem('giftAiCartBackup')
        // Also save the restored cart as the current cart
        localStorage.setItem('giftAiCart', cartBackup)
      } catch (error) {
        console.error('Failed to parse cart backup:', error)
        localStorage.removeItem('giftAiCartBackup')
      }
    }
    
    // If no backup or backup parsing failed, use the regular saved cart
    if (!cartToRestore && savedCart) {
      try {
        cartToRestore = JSON.parse(savedCart)
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
        localStorage.removeItem('giftAiCart')
      }
    }
    
    // If we have a cart to restore (from either source)
    if (cartToRestore && cartToRestore.length > 0) {
      // Check if we need to restore recipient information
      const firstItem = cartToRestore[0]
      const hasRecipientInfo = firstItem.recipientName && 
                             firstItem.recipientEmail && 
                             firstItem.senderName
      
      if (hasRecipientInfo) {
        // If the first item has recipient info, we can use the cart as is
        setItems(cartToRestore)
      } else {
        // Try to get recipient info from localStorage
        const savedRecipientInfo = localStorage.getItem('giftAiRecipientInfo')
        
        if (savedRecipientInfo) {
          try {
            const recipientInfo = JSON.parse(savedRecipientInfo)
            
            // Apply recipient info to all items
            const updatedItems = cartToRestore.map((item: CartItem) => ({
              ...item,
              recipientName: recipientInfo.recipientName || '',
              recipientEmail: recipientInfo.recipientEmail || '',
              senderName: recipientInfo.senderName || '',
              message: recipientInfo.message || ''
            }))
            
            setItems(updatedItems)
          } catch (error) {
            console.error('Failed to parse recipient info:', error)
            setItems(cartToRestore)
          }
        } else {
          setItems(cartToRestore)
        }
      }
    }
  }, [])
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('giftAiCart', JSON.stringify(items))
    
    // Also save recipient information separately for persistence
    if (items.length > 0) {
      const firstItem = items[0]
      
      // Save recipient info if available
      if (firstItem.recipientName || firstItem.recipientEmail || firstItem.senderName) {
        const recipientInfo = {
          recipientName: firstItem.recipientName,
          recipientEmail: firstItem.recipientEmail,
          senderName: firstItem.senderName,
          message: firstItem.message
        }
        
        localStorage.setItem('giftAiRecipientInfo', JSON.stringify(recipientInfo))
      }
    }
  }, [items])
  
  // Add an item to the cart
  const addToCart = (item: CartItem) => {
    setItems(prevItems => [...prevItems, item])
  }
  
  // Remove an item from the cart
  const removeFromCart = (index: number) => {
    setItems(prevItems => prevItems.filter((_, i) => i !== index))
  }
  
  // Clear the entire cart
  const clearCart = () => {
    setItems([])
  }
  
  // Checkout function to process cart items
  const checkout = async (): Promise<{ success: boolean; url?: string; error?: string }> => {
    if (items.length === 0) {
      return { success: false, error: 'Cart is empty' }
    }
    
    // Validate recipient information
    const firstItem = items[0];
    if (!firstItem.recipientName || !firstItem.recipientEmail || !firstItem.senderName) {
      return { success: false, error: 'Missing recipient information. Please fill in all required fields.' }
    }
    
    // Store recipient information in localStorage before checkout
    // This ensures we can restore it when returning from checkout
    const recipientInfo = {
      recipientName: firstItem.recipientName,
      recipientEmail: firstItem.recipientEmail,
      senderName: firstItem.senderName,
      message: firstItem.message || ''
    };
    localStorage.setItem('giftAiRecipientInfo', JSON.stringify(recipientInfo));
    
    // Also create a backup of the entire cart in case user returns without completing checkout
    localStorage.setItem('giftAiCartBackup', JSON.stringify(items));
    
    try {
      // Format items for the API with properly formatted subscription IDs
      const cartItems = items.map(item => {
        // Ensure subscription ID is correctly formatted
        let formattedSubscriptionId = item.subscription.id;
        
        // Special handling for Midjourney subscriptions
        if (item.platformId === 'midjourney' && item.subscription.tier) {
          // Use the hardcoded format for Midjourney: midjourney-{tier} (lowercase)
          formattedSubscriptionId = `midjourney-${item.subscription.tier.toLowerCase()}`;
        }
        // For other platforms, if the ID contains spaces, replace them with hyphens
        else if (formattedSubscriptionId.includes(' ')) {
          formattedSubscriptionId = formattedSubscriptionId.replace(/\s+/g, '-');
        }
        
        return {
          platformId: item.platformId,
          subscriptionId: formattedSubscriptionId,
          recipientName: item.recipientName,
          recipientEmail: item.recipientEmail,
          senderName: item.senderName,
          message: item.message
        };
      });
      
      console.log('Sending cart items to checkout:', JSON.stringify(cartItems, null, 2));
      
      // Call the cart checkout API
      const response = await fetch('/api/checkout/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cartItems }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        return { 
          success: false, 
          error: data.error || 'Failed to create checkout session' 
        }
      }
      
      return { 
        success: true, 
        url: data.url 
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred' 
      }
    }
  }
  
  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      clearCart,
      checkout,
      totalPrice,
      serviceFee,
      grandTotal
    }}>
      {children}
    </CartContext.Provider>
  )
}
