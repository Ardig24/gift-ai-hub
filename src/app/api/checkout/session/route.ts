import { NextRequest, NextResponse } from 'next/server';
import { retrieveCheckoutSession } from '@/lib/stripe/server';
import { ordersTable } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  // Get the session ID from the query parameters
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID is required' },
      { status: 400 }
    );
  }

  try {
    // Retrieve the session from Stripe
    const session = await retrieveCheckoutSession(sessionId);
    
    // Parse the metadata from the session
    let orderItems: any[] = [];
    let recipientInfo: { name?: string; email?: string; sender?: string; message?: string; } = {};
    
    try {
      // Parse the compact order items from metadata
      if (session.metadata?.orderItems) {
        orderItems = JSON.parse(session.metadata.orderItems);
      }
      
      // Parse the recipient info from metadata
      if (session.metadata?.recipientInfo) {
        recipientInfo = JSON.parse(session.metadata.recipientInfo);
      }
    } catch (error) {
      console.error('Error parsing session metadata:', error);
    }
    
    // Get the order details from the database
    const orders = await ordersTable.getAll();
    const order = orders.find((o: any) => o.session_id === sessionId);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Format the response with the parsed data
    return NextResponse.json({
      id: order.id,
      orderItems: orderItems.map((item: any) => ({
        platformId: item.p,
        subscriptionId: item.s,
        recipientName: item.r,
        recipientEmail: item.e,
        senderName: item.f
      })),
      recipientInfo: {
        name: recipientInfo.name || '',
        email: recipientInfo.email || '',
        sender: recipientInfo.sender || '',
        message: recipientInfo.message || ''
      },
      amount: order.amount,
      status: order.status,
      createdAt: order.created_at,
    });
  } catch (error: any) {
    console.error('Error retrieving session:', error);
    return NextResponse.json(
      { error: error.message || 'Error retrieving session' },
      { status: 500 }
    );
  }
}
