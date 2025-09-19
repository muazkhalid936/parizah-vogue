import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart, { ICartItem } from '@/models/Cart';
import Product from '@/models/Product';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/cart - Get user's cart
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
    
    let cart = await Cart.findOne({ user: tokenPayload.userId }).populate('items.product');
    
    // Create empty cart if none exists
    if (!cart) {
      cart = new Cart({
        user: tokenPayload.userId,
        items: [],
        totalItems: 0,
        totalPrice: 0
      });
      await cart.save();
    }
    
    return NextResponse.json({ cart });
    
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
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
    
    const { productId, quantity = 1, size, color } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    if (!product.active) {
      return NextResponse.json(
        { error: 'Product is not available' },
        { status: 400 }
      );
    }
    
    // Check stock
    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }
    
    // Find or create cart
    let cart = await Cart.findOne({ user: tokenPayload.userId });
    if (!cart) {
      cart = new Cart({
        user: tokenPayload.userId,
        items: []
      });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex((item: ICartItem) => 
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color
    );
    
    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
      
      // Check total quantity against stock
      if (cart.items[existingItemIndex].quantity > product.stock) {
        return NextResponse.json(
          { error: 'Cannot add more items than available stock' },
          { status: 400 }
        );
      }
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.salePrice || product.price,
        size,
        color
      });
    }
    
    await cart.save();
    await cart.populate('items.product');
    
    return NextResponse.json({
      message: 'Item added to cart',
      cart
    });
    
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear cart
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const tokenPayload = await getUserFromRequest(request);
    if (!tokenPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await Cart.findOneAndUpdate(
      { user: tokenPayload.userId },
      { 
        items: [],
        totalItems: 0,
        totalPrice: 0
      }
    );
    
    return NextResponse.json({
      message: 'Cart cleared successfully'
    });
    
  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}