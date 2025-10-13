import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Check for hardcoded admin credentials
    if (email.toLowerCase() === 'admin@parizahvogue.com' && password === 'admin123') {
      const adminToken = generateToken({
        userId: 'admin',
        email: 'admin@parizahvogue.com',
        role: 'admin'
      });
      
      const adminUser = {
        _id: 'admin',
        name: 'Admin',
        email: 'admin@parizahvogue.com',
        role: 'admin',
        avatar: ''
      };
      
      const response = NextResponse.json({
        message: 'Admin login successful',
        user: adminUser,
        token: adminToken
      });
      
      // Set HTTP-only cookie for admin
      response.cookies.set('token', adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
      
      return response;
    }
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });
    
    // Create response with user data (password excluded by toJSON method)
    const response = NextResponse.json({
      message: 'Login successful',
      user: user.toJSON(),
      token
    });
    
    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}