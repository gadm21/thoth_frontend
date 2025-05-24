'use client';

import { BookOpen, Users, FileText, MessageSquare } from 'lucide-react';
import { ReactNode } from 'react';

// Define the card types as a const array for type safety
const CARD_TYPES = ['projects', 'friends', 'files', 'messages', 'courses'] as const;
type CardType = typeof CARD_TYPES[number];

// Define the shape of our configuration
interface CardConfig {
  icon: ReactNode;
  title: string;
  color: string;
  count: number;
}

// Define configurations for each card type
const CARD_CONFIGS: Record<CardType, CardConfig> = {
  projects: {
    icon: <BookOpen className="h-8 w-8 text-blue-500" />,
    title: 'My Projects',
    color: 'bg-blue-100 dark:bg-blue-900/30',
    count: 0
  },
  friends: {
    icon: <Users className="h-8 w-8 text-green-500" />,
    title: 'Friends',
    color: 'bg-green-100 dark:bg-green-900/30',
    count: 0
  },
  files: {
    icon: <FileText className="h-8 w-8 text-purple-500" />,
    title: 'Study Groups',
    color: 'bg-purple-100 dark:bg-purple-900/30',
    count: 0
  },
  messages: {
    icon: <MessageSquare className="h-8 w-8 text-amber-500" />,
    title: 'Messages',
    color: 'bg-amber-100 dark:bg-amber-900/30',
    count: 0
  },
  courses: {
    icon: <BookOpen className="h-8 w-8 text-indigo-500" />,
    title: 'My Courses',
    color: 'bg-indigo-100 dark:bg-indigo-900/30',
    count: 0
  }
};

// Default configuration for unknown types
const DEFAULT_CONFIG: CardConfig = {
  icon: <FileText className="h-8 w-8 text-gray-500" />,
  title: 'Item',
  color: 'bg-gray-100 dark:bg-gray-800/30',
  count: 0
};

interface SimpleInfoCardProps {
  type: CardType | string;
  count?: number;
  title?: string;
}

export default function SimpleInfoCard({ 
  type, 
  count, 
  title 
}: SimpleInfoCardProps) {
  // Get the configuration for this card type
  const config = type in CARD_CONFIGS 
    ? CARD_CONFIGS[type as CardType] 
    : DEFAULT_CONFIG;

  // Use provided props or fall back to config defaults
  const displayCount = count ?? config.count;
  const displayTitle = title ?? config.title;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-transform hover:scale-105">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${config.color}`}>
          {config.icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {displayTitle}
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {displayCount}
          </p>
        </div>
      </div>
    </div>
  );
}

// Set default props
SimpleInfoCard.defaultProps = {
  type: 'projects',
  count: 0,
  title: undefined
};
