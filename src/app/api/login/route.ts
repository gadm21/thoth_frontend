import { NextResponse } from 'next/server';
import { AuthResponse } from '@/types/api';

// In-memory storage for demo purposes
// In a real app, you would use a database
const users: any[] = [];

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    // Basic validation
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // In a real app, you would:
    // 1. Find the user in the database
    // 2. Verify the password hash
    // 3. Generate a JWT token
    
    // For demo purposes, we'll just check if the user exists
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // In a real app, you would verify the password hash here
    // For demo, we'll just check if the password matches
    if (user.password && user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Generate a token (in a real app, use a proper JWT library)
    const token = `mock-token-${Date.now()}`;
    
    // Prepare the response data
    const responseData: AuthResponse = {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 3600, // 1 hour
      user: {
        id: user.id,
        userId: user.userId,
        username: user.username,
        role: user.role,
        phone_number: user.phone_number
      }
    };
    
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
