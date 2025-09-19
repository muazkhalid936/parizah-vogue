import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart, { ICartItem } from '@/models/Cart';
import Product from '@/models/Product';
import { getUserFromRequest } from '@/lib/auth';

interface Props {
  params: {
    itemId: string;
  };
}

// PUT /api/cart/[itemId] - Update cart item quantity
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    await connectDB();
    
    const tokenPayload = await getUserFromRequest(request);
    if (!tokenPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { quantity } = await request.json();
    
    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }
    
    const cart = await Cart.findOne({ user: tokenPayload.userId });
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }
    
    const itemIndex = cart.items.findIndex((item: ICartItem) => item._id?.toString() === params.itemId);
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }
    
    // Validate stock
    const product = await Product.findById(cart.items[itemIndex].product);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    if (quantity > product.stock) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }
    
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    
    return NextResponse.json({
      message: 'Cart item updated',
      cart
    });
    
  } catch (error) {
    console.error('Update cart item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[itemId] - Remove item from cart
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
    
    const cart = await Cart.findOne({ user: tokenPayload.userId });
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }
    
    const itemIndex = cart.items.findIndex((item: ICartItem) => item._id?.toString() === params.itemId);
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }
    
    // Remove item
    cart.items.splice(itemIndex, 1);
    await cart.save();
    await cart.populate('items.product');
    
    return NextResponse.json({
      message: 'Item removed from cart',
      cart
    });
    
  } catch (error) {
    console.error('Remove cart item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}