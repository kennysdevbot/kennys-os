import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { supabase } from '../../lib/supabase';
import type { Card as CardType, Column as ColumnType, Board } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { CardModal } from './CardModal';
import { Button } from '../base/Button';
import { Input } from '../base/Input';

export const KanbanBoard: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [cardsByColumn, setCardsByColumn] = useState<Record<string, CardType[]>>({});
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [editingCardColumnId, setEditingCardColumnId] = useState<string | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  // Fetch boards
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const { data } = await supabase
          .from('kos_boards')
          .select('*')
          .order('created_at', { ascending: true });

        setBoards(data || []);
        if ((data || []).length > 0) {
          setSelectedBoardId(data![0].id);
        }
      } catch (err) {
        console.error('Failed to fetch boards:', err);
      }
    };

    fetchBoards();
  }, []);

  // Fetch columns when board changes
  useEffect(() => {
    const fetchColumns = async () => {
      if (!selectedBoardId) {
        setColumns([]);
        return;
      }

      try {
        const { data } = await supabase
          .from('kos_columns')
          .select('*')
          .eq('board_id', selectedBoardId)
          .order('position', { ascending: true });

        setColumns(data || []);
      } catch (err) {
        console.error('Failed to fetch columns:', err);
      }
    };

    fetchColumns();
  }, [selectedBoardId]);

  // Fetch cards for all columns
  useEffect(() => {
    const fetchCards = async () => {
      if (columns.length === 0) {
        setCardsByColumn({});
        setLoading(false);
        return;
      }

      try {
        const newCardsByColumn: Record<string, CardType[]> = {};

        for (const column of columns) {
          const { data } = await supabase
            .from('kos_cards')
            .select('*')
            .eq('column_id', column.id)
            .order('position', { ascending: true });

          newCardsByColumn[column.id] = data || [];
        }

        setCardsByColumn(newCardsByColumn);
      } catch (err) {
        console.error('Failed to fetch cards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [columns]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Find the card and column info
    let sourceColumnId: string | null = null;
    let cardId: string | null = null;

    for (const [colId, cards] of Object.entries(cardsByColumn)) {
      const card = cards.find(c => c.id === active.id);
      if (card) {
        sourceColumnId = colId;
        cardId = card.id;
        break;
      }
    }

    if (!cardId || !sourceColumnId) return;

    // Determine target column
    let targetColumnId = sourceColumnId;
    for (const column of columns) {
      if (column.id === over.id) {
        targetColumnId = column.id;
        break;
      }
    }

    // Move card in database
    try {
      await supabase
        .from('kos_cards')
        .update({ column_id: targetColumnId })
        .eq('id', cardId);

      // Update local state
      const sourceCards = [...(cardsByColumn[sourceColumnId] || [])];
      const targetCards = [...(cardsByColumn[targetColumnId] || [])];
      const movedCard = sourceCards.find(c => c.id === cardId)!;

      sourceCards.splice(
        sourceCards.findIndex(c => c.id === cardId),
        1
      );
      targetCards.push({ ...movedCard, column_id: targetColumnId });

      setCardsByColumn({
        ...cardsByColumn,
        [sourceColumnId]: sourceCards,
        [targetColumnId]: targetCards,
      });
    } catch (err) {
      console.error('Failed to move card:', err);
    }
  };

  const handleCreateBoard = async () => {
    const name = prompt('Enter board name:');
    if (!name?.trim()) return;

    try {
      const { data } = await supabase
        .from('kos_boards')
        .insert([{ name }])
        .select()
        .single();

      if (data) {
        setBoards([...boards, data]);
        setSelectedBoardId(data.id);
      }
    } catch (err) {
      console.error('Failed to create board:', err);
    }
  };

  const handleCreateColumn = async () => {
    if (!newColumnName.trim() || !selectedBoardId) return;

    try {
      const maxPosition = columns.length > 0
        ? Math.max(...columns.map(c => c.position)) + 1
        : 0;

      const { data } = await supabase
        .from('kos_columns')
        .insert([{
          board_id: selectedBoardId,
          name: newColumnName,
          position: maxPosition,
        }])
        .select()
        .single();

      if (data) {
        setColumns([...columns, data]);
        setCardsByColumn({
          ...cardsByColumn,
          [data.id]: [],
        });
      }
      setNewColumnName('');
    } catch (err) {
      console.error('Failed to create column:', err);
    }
  };

  const handleAddCard = (columnId: string) => {
    setEditingCard(null);
    setEditingCardColumnId(columnId);
    setIsCardModalOpen(true);
  };

  const handleEditCard = (card: CardType) => {
    setEditingCard(card);
    const colId = columns.find(c =>
      (cardsByColumn[c.id] || []).find(cd => cd.id === card.id)
    )?.id;
    if (colId) {
      setEditingCardColumnId(colId);
    }
    setIsCardModalOpen(true);
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await supabase.from('kos_cards').delete().eq('id', cardId);

      // Update local state
      const newCardsByColumn = { ...cardsByColumn };
      for (const colId in newCardsByColumn) {
        newCardsByColumn[colId] = newCardsByColumn[colId].filter(c => c.id !== cardId);
      }
      setCardsByColumn(newCardsByColumn);
    } catch (err) {
      console.error('Failed to delete card:', err);
    }
  };

  const handleSaveCard = async (cardData: Partial<CardType>) => {
    if (!editingCardColumnId) return;

    try {
      if (editingCard) {
        // Update existing card
        await supabase
          .from('kos_cards')
          .update(cardData)
          .eq('id', editingCard.id);

        // Update local state
        const updatedCards = cardsByColumn[editingCardColumnId].map(c =>
          c.id === editingCard.id ? { ...c, ...cardData } : c
        );
        setCardsByColumn({
          ...cardsByColumn,
          [editingCardColumnId]: updatedCards,
        });
      } else {
        // Create new card
        const maxPosition = (cardsByColumn[editingCardColumnId] || []).length;
        const { data } = await supabase
          .from('kos_cards')
          .insert([{
            column_id: editingCardColumnId,
            ...cardData,
            position: maxPosition,
          }])
          .select()
          .single();

        if (data) {
          setCardsByColumn({
            ...cardsByColumn,
            [editingCardColumnId]: [
              ...(cardsByColumn[editingCardColumnId] || []),
              data,
            ],
          });
        }
      }

      setIsCardModalOpen(false);
      setEditingCard(null);
      setEditingCardColumnId(null);
    } catch (err) {
      console.error('Failed to save card:', err);
    }
  };

  if (loading && columns.length === 0) {
    return <div className="text-text-secondary">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-4">Kanban Board</h1>

        {/* Board Selector */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {boards.map(board => (
            <Button
              key={board.id}
              variant={selectedBoardId === board.id ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedBoardId(board.id)}
            >
              {board.name}
            </Button>
          ))}
          <Button variant="ghost" size="sm" onClick={handleCreateBoard}>
            + New Board
          </Button>
        </div>

        {/* New Column Input */}
        {selectedBoardId && (
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Enter column name..."
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              className="max-w-xs"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCreateColumn();
                }
              }}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateColumn}
              disabled={!newColumnName.trim()}
            >
              Add Column
            </Button>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      {selectedBoardId && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
            {columns.length === 0 ? (
              <div className="flex items-center justify-center w-full h-64">
                <p className="text-text-secondary">
                  No columns yet. Create one to get started.
                </p>
              </div>
            ) : (
              columns.map(column => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  cards={cardsByColumn[column.id] || []}
                  onAddCard={handleAddCard}
                  onEditCard={handleEditCard}
                  onDeleteCard={handleDeleteCard}
                />
              ))
            )}
          </div>
        </DndContext>
      )}

      {/* Card Modal */}
      <CardModal
        isOpen={isCardModalOpen}
        card={editingCard}
        onClose={() => {
          setIsCardModalOpen(false);
          setEditingCard(null);
          setEditingCardColumnId(null);
        }}
        onSave={handleSaveCard}
      />
    </div>
  );
};
