import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { User, AuthResponse } from '@/types/api';

// In-memory storage for demo purposes
// In a real app, you would use a database
const users: User[] = [];

// Helper function to generate token
const generateToken = (): string => {
  return `mock-token-${Date.now()}`;
};

export async function POST(request: Request) {
  try {
    const { username, password, phone_number, role = 'user' } = await request.json();
    
    // Basic validation
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    if (users.some(user => user.username === username)) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }
    
    // In a real app, you would hash the password before storing it
    const userId = uuidv4();
    const newUser: User = {
      id: userId,
      userId: userId,
      username,
      // In a real app, you would hash the password before storing it
      // password: await hashPassword(password),
      ...(phone_number && { phone_number: String(phone_number) }),
      role,
    };
    
    users.push(newUser);
    
    // Create a session token (in a real app, use a proper auth library)
    const token = generateToken();
    
    // In a real app, you would store this token in a secure HTTP-only cookie
    
    // Prepare the response data
    const responseData: AuthResponse = {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 3600, // 1 hour
      user: {
        id: newUser.id,
        userId: newUser.id,
        username: newUser.username,
        role: newUser.role,
        phone_number: newUser.phone_number
      }
    };
    
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
