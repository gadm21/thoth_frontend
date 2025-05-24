'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Plus, 
  FileText,
  MessageSquare,
  FolderPlus,
  Search,
  Trash2,
  Star,
  Folder,
  File,
  Link2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

// Simple input component
const Input = ({ 
  type, 
  placeholder, 
  value, 
  onChange, 
  className = '' 
}: { 
  type: string; 
  placeholder: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  className?: string;
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
  />
);

type SidebarItem = {
  id: string;
  title: string;
  type: 'chat' | 'project' | 'file' | 'url' | 'folder';
  updatedAt: string;
  isStarred?: boolean;
};

type AddButton = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
};

type ActiveView = 'home' | 'chat' | 'projects' | 'knowledge';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [items, setItems] = useState<SidebarItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Determine active view based on pathname
  useEffect(() => {
    if (pathname.startsWith('/chat')) setActiveView('chat');
    else if (pathname.startsWith('/projects')) setActiveView('projects');
    else if (pathname.startsWith('/knowledge')) setActiveView('knowledge');
    else setActiveView('home');
  }, [pathname]);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const loadItems = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockItems: Record<ActiveView, SidebarItem[]> = {
        home: [],
        chat: [
          { id: '1', title: 'Getting Started', type: 'chat', updatedAt: '2 min ago' },
          { id: '2', title: 'Project Discussion', type: 'chat', updatedAt: '1 hour ago' },
          { id: '3', title: 'Team Meeting Notes', type: 'chat', updatedAt: 'Yesterday' },
        ],
        projects: [
          { id: 'p1', title: 'Website Redesign', type: 'project', updatedAt: '2 days ago' },
          { id: 'p2', title: 'Mobile App', type: 'project', updatedAt: '1 week ago' },
          { id: 'p3', title: 'Marketing Campaign', type: 'project', updatedAt: '2 weeks ago' },
        ],
        knowledge: [
          { id: 'k1', title: 'Project Requirements', type: 'file', updatedAt: '1 day ago' },
          { id: 'k2', title: 'API Documentation', type: 'url', updatedAt: '3 days ago' },
          { id: 'k3', title: 'Design Assets', type: 'folder', updatedAt: '1 week ago' },
        ]
      };
      
      setItems(mockItems[activeView]);
    };
    
    loadItems();
  }, [activeView]);

  const getAddButtons = (): AddButton[] => {
    switch (activeView) {
      case 'chat':
        return [{
          label: 'New Chat',
          icon: Plus,
          action: () => router.push('/chat/new')
        }];
      case 'projects':
        return [{
          label: 'New Project',
          icon: FolderPlus,
          action: () => router.push('/projects/new')
        }];
      case 'knowledge':
        return [
          {
            label: 'Upload File',
            icon: FileText,
            action: () => document.getElementById('file-upload')?.click()
          },
          {
            label: 'Add URL',
            icon: Link2,
            action: () => {
              const url = prompt('Enter URL:');
              if (url) {
                // Handle URL addition
                console.log('Adding URL:', url);
              }
            }
          },
          {
            label: 'New Folder',
            icon: FolderPlus,
            action: () => {
              const name = prompt('Enter folder name:');
              if (name) {
                // Handle folder creation
                console.log('Creating folder:', name);
              }
            }
          }
        ];
      default:
        return [];
    }
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const renderItemIcon = (item: SidebarItem) => {
    switch (item.type) {
      case 'chat':
        return <MessageSquare className="h-4 w-4 mr-2" />;
      case 'project':
        return <Folder className="h-4 w-4 mr-2 text-blue-400" />;
      case 'file':
        return <File className="h-4 w-4 mr-2 text-gray-400" />;
      case 'url':
        return <Link2 className="h-4 w-4 mr-2 text-green-400" />;
      case 'folder':
        return expandedFolders.has(item.id) 
          ? <ChevronDown className="h-4 w-4 mr-2 text-yellow-400" /> 
          : <ChevronRight className="h-4 w-4 mr-2 text-yellow-400" />;
      default:
        return <File className="h-4 w-4 mr-2" />;
    }
  };

  const renderItem = (item: SidebarItem) => (
    <div 
      key={item.id}
      className="group flex items-center justify-between p-2 rounded hover:bg-gray-700 cursor-pointer text-sm"
      onClick={() => {
        if (item.type === 'folder') {
          toggleFolder(item.id);
        } else {
          // Handle item click (e.g., open chat, project, etc.)
          console.log('Opening:', item.title);
        }
      }}
    >
      <div className="flex items-center flex-1 min-w-0">
        {renderItemIcon(item)}
        <span className="truncate">{item.title}</span>
      </div>
      <div className="flex items-center space-x-1">
        <button 
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-yellow-400"
          onClick={(e) => {
            e.stopPropagation();
            // Toggle star
            setItems(prev => prev.map(i => 
              i.id === item.id ? { ...i, isStarred: !i.isStarred } : i
            ));
          }}
        >
          <Star 
            className={`h-3.5 w-3.5 ${item.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} 
          />
        </button>
        <button 
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Delete ${item.title}?`)) {
              setItems(prev => prev.filter(i => i.id !== item.id));
            }
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );

  const addButtons = getAddButtons();
  const hasItems = filteredItems.length > 0;

  return (
    <div className="w-64 h-full bg-gray-900 text-gray-200 flex flex-col border-r border-gray-800">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-800">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Add Buttons */}
      {addButtons.length > 0 && (
        <div className="p-2 border-b border-gray-800 flex flex-wrap gap-2">
          {addButtons.map((btn, index) => {
            const Icon = btn.icon;
            return (
              <button
                key={index}
                className="text-xs flex items-center gap-1.5 px-2 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-md"
                onClick={btn.action}
              >
                <Icon className="h-3.5 w-3.5" />
                {btn.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Items List */}
      <div className="flex-1 overflow-y-auto">
        {hasItems ? (
          <div className="p-2 space-y-1">
            {filteredItems.map(renderItem)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 text-center">
            <p>No items found</p>
            {searchQuery ? (
              <p className="text-sm mt-1">Try a different search term</p>
            ) : (
              <p className="text-sm mt-1">
                {activeView === 'chat' && 'Start a new chat to get started'}
                {activeView === 'projects' && 'Create a new project to get started'}
                {activeView === 'knowledge' && 'Add files or URLs to build your knowledge base'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input for uploads */}
      <input 
        type="file" 
        id="file-upload" 
        className="hidden" 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            // Handle file upload
            console.log('Uploading file:', file.name);
          }
        }}
      />
    </div>
  );
}
