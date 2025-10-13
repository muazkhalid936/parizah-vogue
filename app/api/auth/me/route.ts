import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get user from token
    const tokenPayload = await getUserFromRequest(request);
    if (!tokenPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Handle admin user
    if (tokenPayload.userId === 'admin' && tokenPayload.role === 'admin') {
      const adminUser = {
        _id: 'admin',
        name: 'Admin',
        email: 'admin@parizahvogue.com',
        role: 'admin',
        avatar: ''
      };
      
      return NextResponse.json({
        user: adminUser
      });
    }
    
    // Find user in database
    const user = await User.findById(tokenPayload.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      user: user.toJSON()
    });
    
  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}