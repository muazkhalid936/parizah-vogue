import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Database already seeded' },
        { status: 400 }
      );
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@parizahvogue.com',
      password: 'admin123', // Will be hashed automatically
      role: 'admin'
    });
    await adminUser.save();

    // Create a sample customer user
    const customerUser = new User({
      name: 'Jane Doe',
      email: 'customer@example.com',
      password: 'customer123',
      role: 'customer',
      phone: '+1234567890'
    });
    await customerUser.save();

    // Create sample products
    const sampleProducts = [
      {
        name: 'Elegant Black Evening Gown',
        description: 'A stunning black evening gown perfect for formal events and special occasions.',
        price: 299.99,
        salePrice: 249.99,
        images: ['/elegant-black-evening-gown-back-view.jpg', '/placeholder.jpg'],
        category: 'Evening',
        subcategory: 'Gowns',
        brand: 'Parizah Vogue',
        sku: 'PV-EG-001',
        stock: 15,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Black'],
        featured: true,
        active: true,
        tags: ['elegant', 'formal', 'evening', 'gown'],
        weight: 0.8,
        dimensions: {
          length: 150,
          width: 50,
          height: 5
        }
      },
      {
        name: 'Summer Floral Midi Dress',
        description: 'Light and breezy floral midi dress perfect for summer occasions.',
        price: 89.99,
        images: ['/placeholder.jpg', '/placeholder-2jycq.png'],
        category: 'Summer',
        subcategory: 'Midi Dresses',
        brand: 'Parizah Vogue',
        sku: 'PV-SM-002',
        stock: 25,
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Floral Print', 'Pink', 'Blue'],
        featured: true,
        active: true,
        tags: ['summer', 'floral', 'casual', 'midi'],
        weight: 0.4
      },
      {
        name: 'Professional Blazer Set',
        description: 'Sophisticated blazer set ideal for business meetings and professional settings.',
        price: 199.99,
        images: ['/placeholder-4n5ky.png', '/placeholder-6y00r.png'],
        category: 'Formal',
        subcategory: 'Blazers',
        brand: 'Parizah Vogue',
        sku: 'PV-BL-003',
        stock: 12,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Navy', 'Black', 'Gray'],
        featured: false,
        active: true,
        tags: ['professional', 'blazer', 'formal', 'business'],
        weight: 0.6
      },
      {
        name: 'Casual Denim Jacket',
        description: 'Classic denim jacket for everyday casual wear.',
        price: 79.99,
        salePrice: 59.99,
        images: ['/placeholder-aeles.png', '/placeholder-dxdm4.png'],
        category: 'Casual',
        subcategory: 'Jackets',
        brand: 'Parizah Vogue',
        sku: 'PV-DJ-004',
        stock: 30,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Light Blue', 'Dark Blue', 'Black'],
        featured: false,
        active: true,
        tags: ['casual', 'denim', 'jacket', 'everyday'],
        weight: 0.7
      },
      {
        name: 'Cocktail Party Dress',
        description: 'Glamorous cocktail dress perfect for parties and celebrations.',
        price: 159.99,
        images: ['/placeholder-feewt.png', '/placeholder-ljgo4.png'],
        category: 'Evening',
        subcategory: 'Cocktail Dresses',
        brand: 'Parizah Vogue',
        sku: 'PV-CD-005',
        stock: 18,
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Red', 'Black', 'Navy'],
        featured: true,
        active: true,
        tags: ['cocktail', 'party', 'glamorous', 'evening'],
        weight: 0.5
      }
    ];

    const products = await Product.insertMany(sampleProducts);

    return NextResponse.json({
      message: 'Database seeded successfully!',
      data: {
        adminUser: {
          email: 'admin@parizahvogue.com',
          password: 'admin123',
          role: 'admin'
        },
        customerUser: {
          email: 'customer@example.com',
          password: 'customer123',
          role: 'customer'
        },
        productsCreated: products.length
      }
    });

  } catch (error: any) {
    console.error('Seed database error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Some data already exists in database' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}