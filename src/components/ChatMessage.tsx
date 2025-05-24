'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { Check, CheckCheck, Clock, AlertCircle, MessageSquare, User, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage as ChatMessageType, MessageStatus } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ReactNode } from 'react';

interface ChatMessageProps {
  message: ChatMessageType;
  isLastMessage?: boolean;
  isSending?: boolean;
  onRetry?: () => void;
  onStatusChange?: (messageId: string, status: MessageStatus, error?: string) => void;
}

export default function ChatMessage({ 
  message, 
  isLastMessage = false, 
  isSending = false,
  onRetry
}: ChatMessageProps) {
  const isUser = message.sender === 'user';

  const handleRetry = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onRetry) {
      onRetry();
    }
  };

  const renderStatusIcon = () => {
    if (!isUser) return null;
    
    if (isSending) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span><RefreshCw className="h-3 w-3 text-gray-400 animate-spin" /></span>
          </TooltipTrigger>
          <TooltipContent>Sending...</TooltipContent>
        </Tooltip>
      );
    }

    switch (message.status) {
      case MessageStatus.SENDING:
        return <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />;
      case MessageStatus.SENT:
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case MessageStatus.DELIVERED:
      case MessageStatus.READ:
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case MessageStatus.FAILED:
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertCircle className="h-3 w-3 text-destructive" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Failed to send</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 h-6 text-xs"
                onClick={handleRetry}
              >
                Retry
              </Button>
            </TooltipContent>
          </Tooltip>
        );
      default:
        return null;
    }
  };

  const messageTime = message.timestamp ? format(new Date(message.timestamp), 'h:mm a') : 'Just now';
  const timeAgo = message.timestamp ? formatDistanceToNow(new Date(message.timestamp), { addSuffix: true }) : 'just now';

  return (
    <div className={cn(
      "group flex",
      isUser ? "justify-end" : "justify-start",
      "mb-4"
    )}>
      <div className={cn(
        "flex max-w-xs md:max-w-md lg:max-w-2xl",
        isUser ? "flex-row-reverse" : ""
      )}>
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          {isUser ? (
            <User className="h-4 w-4 text-primary" />
          ) : (
            <MessageSquare className="h-4 w-4 text-primary" />
          )}
        </div>
        <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
          <div 
            className={cn(
              "p-3 rounded-lg transition-all duration-200",
              isUser 
                ? "bg-blue-500 text-white rounded-tr-none hover:bg-blue-600" 
                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          <TooltipProvider>
            <div className={cn(
              "flex items-center mt-1 space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity",
              isUser ? "flex-row-reverse space-x-reverse" : ""
            )}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={cn(
                    "text-xs cursor-default",
                    isUser ? "text-gray-400" : "text-gray-500 dark:text-gray-400"
                  )}>
                    {messageTime}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {timeAgo}
                </TooltipContent>
              </Tooltip>
              {isUser && (
                <span className="flex items-center">
                  {renderStatusIcon()}
                </span>
              )}
            </div>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
