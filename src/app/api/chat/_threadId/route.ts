import { NextResponse } from 'next/server';

// This uses the same in-memory storage from the chat/route.ts file
// In a real app, you'd want to move this to a shared file or a database
const messages: Record<string, any> = {
  'thread-1': [
    {
      id: 'msg-1',
      content: 'Hello! Welcome to Thoth. How can I help you today?',
      role: 'assistant',
      timestamp: new Date(),
      status: 'delivered',
    },
  ],
};

export async function GET(
  req: Request,
  context: { params: { threadId: string } }
) {
  const { threadId } = context.params;
  try {
    
    if (!messages[threadId]) {
      return NextResponse.json(
        { error: 'Thread not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(messages[threadId]);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
