import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();
    
    const {
      orderItems,
      shippingAddress,
      paymentMethod = 'COD'
    } = await request.json();

    // Validate required fields
    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json({ error: 'Order items are required' }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || 
        !shippingAddress.city || !shippingAddress.phone) {
      return NextResponse.json({ error: 'Complete shipping address is required' }, { status: 400 });
    }

    // Validate and calculate order totals
    let itemsPrice = 0;
    const validatedOrderItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.product} not found` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const orderItem = {
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        quantity: item.quantity
      };

      validatedOrderItems.push(orderItem);
      itemsPrice += product.price * item.quantity;

      // Update product stock
      await Product.findByIdAndUpdate(
        product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Calculate other prices
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
    const taxPrice = Math.round((itemsPrice * 0.1) * 100) / 100; // 10% tax
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // Create order
    const order = await Order.create({
      user: payload.userId,
      orderItems: validatedOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      status: 'pending' // All orders start as pending for admin approval
    });

    return NextResponse.json({
      message: 'Order placed successfully',
      order,
      orderId: order._id
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get user's orders
export async function GET(request: NextRequest) {
  try {
    // Verify user authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();
    
    const orders = await Order.find({ user: payload.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ orders });

  } catch (error: any) {
    console.error('Get user orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}