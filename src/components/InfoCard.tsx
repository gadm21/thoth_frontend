import { ReactNode } from 'react';
import { BookOpen, Users, FileText, MessageSquare } from 'lucide-react';

// Define valid card types
type CardType = 'projects' | 'friends' | 'files' | 'messages' | 'courses';

// Define the card configuration type
interface CardConfig {
  icon: React.ReactNode;
  defaultTitle: string;
  defaultCount: number;
  color: string;
}

// Define the card configurations
const CARD_CONFIGS: Record<CardType, CardConfig> = {
  projects: {
    icon: <BookOpen className="h-8 w-8 text-blue-500" />,
    defaultTitle: 'My Projects',
    defaultCount: 0,
    color: 'bg-blue-100 dark:bg-blue-900/30',
  },
  friends: {
    icon: <Users className="h-8 w-8 text-green-500" />,
    defaultTitle: 'Friends',
    defaultCount: 0,
    color: 'bg-green-100 dark:bg-green-900/30',
  },
  files: {
    icon: <FileText className="h-8 w-8 text-purple-500" />,
    defaultTitle: 'Study Groups',
    defaultCount: 0,
    color: 'bg-purple-100 dark:bg-purple-900/30',
  },
  messages: {
    icon: <MessageSquare className="h-8 w-8 text-amber-500" />,
    defaultTitle: 'Messages',
    defaultCount: 0,
    color: 'bg-amber-100 dark:bg-amber-900/30',
  },
  courses: {
    icon: <BookOpen className="h-8 w-8 text-indigo-500" />,
    defaultTitle: 'My Courses',
    defaultCount: 0,
    color: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
};

// Default configuration for unknown types
const DEFAULT_CONFIG: CardConfig = {
  icon: <FileText className="h-8 w-8 text-gray-500" />,
  defaultTitle: 'Item',
  defaultCount: 0,
  color: 'bg-gray-100 dark:bg-gray-800/30',
};

// Helper function to safely get card config
function getCardConfig(type: string | undefined): CardConfig {
  if (!type || !(type in CARD_CONFIGS)) {
    return DEFAULT_CONFIG;
  }
  return CARD_CONFIGS[type as CardType] || DEFAULT_CONFIG;
}

interface InfoCardProps {
  type?: string;
  count?: number;
  title?: string;
}

export default function InfoCard({ 
  type = 'projects', 
  count, 
  title 
}: InfoCardProps) {
  // Get the configuration for this card type
  const config = getCardConfig(type);
  
  // Use provided values or fall back to defaults
  const displayCount = count ?? config.defaultCount;
  const displayTitle = title ?? config.defaultTitle;
  
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
