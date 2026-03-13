import React, { useState } from 'react';
import type { InboxItem } from '../../types';
import { Badge } from '../base/Badge';
import { Button } from '../base/Button';

interface InboxItemCardProps {
  item: InboxItem;
  onPromoteToCard?: () => void;
  onPromoteToNote?: () => void;
  onDelete: (itemId: string) => void;
}

const typeColors: Record<string, string> = {
  task: 'bg-blue-500/10 text-blue-300',
  note: 'bg-purple-500/10 text-purple-300',
  link: 'bg-green-500/10 text-green-300',
  general: 'bg-gray-500/10 text-gray-300',
};

export const InboxItemCard: React.FC<InboxItemCardProps> = ({
  item,
  onPromoteToCard,
  onPromoteToNote,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isPromoted = item.promoted_to !== null;

  return (
    <div className={`border rounded-lg p-4 transition-all ${
      isPromoted
        ? 'bg-bg-tertiary border-border-default opacity-50'
        : 'bg-bg-secondary border-border-default hover:border-border-strong'
    }`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant="secondary"
                size="xs"
                className={typeColors[item.type || 'general'] || typeColors.general}
              >
                {item.type || 'general'}
              </Badge>
              <span className="text-xs text-text-tertiary">{item.source_agent}</span>
              <span className="text-xs text-text-tertiary">{formatDate(item.created_at)}</span>
            </div>
            {isPromoted && (
              <Badge
                variant="secondary"
                size="xs"
                className="bg-green-500/10 text-green-300"
              >
                ✓ Promoted to {item.promoted_to}
              </Badge>
            )}
          </div>
          <button
            onClick={() => onDelete(item.id)}
            className="text-text-tertiary hover:text-red-400 transition-colors flex-shrink-0"
            disabled={isPromoted}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer"
        >
          <p className={`text-sm text-text-primary ${isExpanded ? '' : 'line-clamp-2'}`}>
            {item.content}
          </p>
        </div>

        {/* Actions */}
        {!isPromoted && (
          <div className="flex gap-2 pt-2 border-t border-border-default">
            {(item.type === 'task' || !item.type) && onPromoteToCard && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onPromoteToCard}
              >
                → Card
              </Button>
            )}
            {(item.type === 'note' || !item.type) && onPromoteToNote && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onPromoteToNote}
              >
                → Note
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
