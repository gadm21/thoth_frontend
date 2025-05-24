import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

type ChatMessage = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  status: 'sending' | 'delivered' | 'error';
  error?: string;
};

type ChatThread = {
  id: string;
  title: string;
  lastMessageAt: Date;
  preview: string;
  unreadCount: number;
};

// In-memory storage for development
const threads: Record<string, ChatThread> = {};
const messages: Record<string, ChatMessage[]> = {};

// Initialize with a default thread
const defaultThreadId = 'thread-1';
if (!threads[defaultThreadId]) {
  threads[defaultThreadId] = {
    id: defaultThreadId,
    title: 'Welcome to Thoth',
    lastMessageAt: new Date(),
    preview: 'Hello! How can I help you today?',
    unreadCount: 0,
  };
  
  messages[defaultThreadId] = [
    {
      id: 'msg-1',
      content: 'Hello! Welcome to Thoth. How can I help you today?',
      role: 'assistant',
      timestamp: new Date(),
      status: 'delivered',
    },
  ];
}

export async function GET() {
  try {
    // Return all threads
    const threadList = Object.values(threads);
    return NextResponse.json(threadList);
  } catch (error) {
    console.error('Error fetching chat threads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat threads' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { message, threadId = defaultThreadId } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Create a new message
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: message,
      role: 'user',
      timestamp: new Date(),
      status: 'delivered',
    };
    
    // Add to messages
    if (!messages[threadId]) {
      messages[threadId] = [];
    }
    messages[threadId].push(newMessage);
    
    // Update thread
    threads[threadId] = {
      ...(threads[threadId] || {
        id: threadId,
        title: `Chat ${threadId}`,
        lastMessageAt: new Date(),
        preview: message.length > 50 ? `${message.substring(0, 50)}...` : message,
        unreadCount: 0,
      }),
      lastMessageAt: new Date(),
      preview: message.length > 50 ? `${message.substring(0, 50)}...` : message,
    };
    
    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: `I received your message: "${message}". This is a simulated response.`,
        role: 'assistant',
        timestamp: new Date(),
        status: 'delivered',
      };
      
      messages[threadId].push(assistantMessage);
    }, 1000);
    
    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
