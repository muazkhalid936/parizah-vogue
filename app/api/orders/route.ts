import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const tokenPayload = await getUserFromRequest(request);
    if (!tokenPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    
    const query: any = { user: tokenPayload.userId };
    if (status) {
      query.orderStatus = status;
    }
    
    // Admin can see all orders
    if (tokenPayload.role === 'admin') {
      delete query.user;
      
      // If admin wants to filter by user
      const userId = searchParams.get('userId');
      if (userId) {
        query.user = userId;
      }
    }
    
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Order.countDocuments(query);
    
    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const tokenPayload = await getUserFromRequest(request);
    if (!tokenPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { shippingAddress, paymentMethod, notes } = await request.json();
    
    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { error: 'Shipping address and payment method are required' },
        { status: 400 }
      );
    }
    
    // Get user's cart
    const cart = await Cart.findOne({ user: tokenPayload.userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }
    
    // Validate all products and stock
    const orderItems = [];
    let subtotal = 0;
    
    for (const cartItem of cart.items) {
      const product = cartItem.product as any;
      
      if (!product.active) {
        return NextResponse.json(
          { error: `Product ${product.name} is not available` },
          { status: 400 }
        );
      }
      
      if (product.stock < cartItem.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }
      
      const orderItem = {
        product: product._id,
        name: product.name,
        price: cartItem.price,
        quantity: cartItem.quantity,
        size: cartItem.size,
        color: cartItem.color,
        image: product.images[0]
      };
      
      orderItems.push(orderItem);
      subtotal += cartItem.price * cartItem.quantity;
    }
    
    // Calculate totals (you can customize tax and shipping calculation)
    const tax = subtotal * 0.1; // 10% tax
    const shippingCost = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shippingCost;
    
    // Create order
    const order = new Order({
      user: tokenPayload.userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shippingCost,
      total,
      notes,
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid'
    });
    
    await order.save();
    
    // Update product stock
    for (const cartItem of cart.items) {
      await Product.findByIdAndUpdate(
        cartItem.product,
        { $inc: { stock: -cartItem.quantity } }
      );
    }
    
    // Clear cart
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    await cart.save();
    
    await order.populate('user', 'name email');
    
    return NextResponse.json({
      message: 'Order created successfully',
      order
    }, { status: 201 });
    
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}