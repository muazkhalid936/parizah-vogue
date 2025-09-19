import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { getUserFromRequest } from '@/lib/auth';

interface Props {
  params: {
    id: string;
  };
}

// GET /api/orders/[id] - Get order by ID
export async function GET(request: NextRequest, { params }: Props) {
  try {
    await connectDB();
    
    const tokenPayload = await getUserFromRequest(request);
    if (!tokenPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const query: any = { _id: params.id };
    
    // Users can only access their own orders unless they're admin
    if (tokenPayload.role !== 'admin') {
      query.user = tokenPayload.userId;
    }
    
    const order = await Order.findOne(query).populate('user', 'name email');
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ order });
    
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update order (admin only)
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    await connectDB();
    
    const tokenPayload = await getUserFromRequest(request);
    if (!tokenPayload || tokenPayload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    const { orderStatus, paymentStatus, trackingNumber, estimatedDelivery, notes } = await request.json();
    
    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Update fields
    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
    if (notes !== undefined) order.notes = notes;
    
    await order.save();
    await order.populate('user', 'name email');
    
    return NextResponse.json({
      message: 'Order updated successfully',
      order
    });
    
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Cancel order
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    await connectDB();
    
    const tokenPayload = await getUserFromRequest(request);
    if (!tokenPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const query: any = { _id: params.id };
    
    // Users can only cancel their own orders unless they're admin
    if (tokenPayload.role !== 'admin') {
      query.user = tokenPayload.userId;
    }
    
    const order = await Order.findOne(query);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Only allow cancellation if order is not shipped or delivered
    if (['shipped', 'delivered'].includes(order.orderStatus)) {
      return NextResponse.json(
        { error: 'Cannot cancel order that has been shipped or delivered' },
        { status: 400 }
      );
    }
    
    // Update order status to cancelled
    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();
    
    // TODO: Restore product stock if needed
    
    return NextResponse.json({
      message: 'Order cancelled successfully',
      order
    });
    
  } catch (error) {
    console.error('Cancel order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}