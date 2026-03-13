import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card as CardType } from '../../types';
import { Badge } from '../base/Badge';

interface KanbanCardProps {
  card: CardType;
  onEdit: (card: CardType) => void;
  onDelete: (cardId: string) => void;
}

const priorityColors: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-300',
  high: 'bg-orange-500/20 text-orange-300',
  medium: 'bg-yellow-500/20 text-yellow-300',
  low: 'bg-blue-500/20 text-blue-300',
};

export const KanbanCard: React.FC<KanbanCardProps> = ({ card, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDueDate = (date: string | null) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onEdit(card)}
      className="bg-bg-tertiary border border-border-default rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-border-strong transition-colors"
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-text-primary flex-1 break-words">{card.title}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            className="text-text-tertiary hover:text-red-400 transition-colors flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {card.description && (
          <p className="text-xs text-text-secondary line-clamp-2">{card.description}</p>
        )}

        <div className="flex flex-wrap gap-1">
          {card.priority && (
            <Badge variant="primary" size="sm" className={priorityColors[card.priority] || 'bg-gray-500/20 text-gray-300'}>
              {card.priority}
            </Badge>
          )}
          {card.due_date && (
            <Badge variant="secondary" size="sm" className="bg-blue-500/10 text-blue-300">
              {formatDueDate(card.due_date)}
            </Badge>
          )}
        </div>

        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.tags.map(tag => (
              <Badge key={tag} variant="secondary" size="sm" className="bg-purple-500/10 text-purple-300">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
