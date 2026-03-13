import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Column, Card as CardType } from '../../types';
import { KanbanCard } from './KanbanCard';
import { Button } from '../base/Button';

interface KanbanColumnProps {
  column: Column;
  cards: CardType[];
  onAddCard: (columnId: string) => void;
  onEditCard: (card: CardType) => void;
  onDeleteCard: (cardId: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
}) => {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col w-80 flex-shrink-0 bg-bg-secondary rounded-lg border border-border-default overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border-default">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">{column.name}</h3>
          <span className="text-xs text-text-tertiary bg-bg-tertiary px-2 py-1 rounded">
            {cards.length}
          </span>
        </div>
      </div>

      {/* Cards Container */}
      <SortableContext
        items={cards.map(c => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[calc(100vh-300px)]"
        >
          {cards.length === 0 ? (
            <div className="h-20 flex items-center justify-center">
              <p className="text-sm text-text-tertiary">No cards yet</p>
            </div>
          ) : (
            cards.map(card => (
              <KanbanCard
                key={card.id}
                card={card}
                onEdit={onEditCard}
                onDelete={onDeleteCard}
              />
            ))
          )}
        </div>
      </SortableContext>

      {/* Add Card Button */}
      <div className="px-3 py-3 border-t border-border-default">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddCard(column.id)}
          className="w-full"
        >
          + Add Card
        </Button>
      </div>
    </div>
  );
};
