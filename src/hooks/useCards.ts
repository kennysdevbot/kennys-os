import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Card } from '../types';

export const useCards = (columnId: string | null) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!columnId) {
      setCards([]);
      setLoading(false);
      return;
    }

    const fetchCards = async () => {
      try {
        const { data, error: err } = await supabase
          .from('kos_cards')
          .select('*')
          .eq('column_id', columnId)
          .order('position', { ascending: true });

        if (err) throw err;
        setCards(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cards');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [columnId]);

  const createCard = async (
    columnId: string,
    title: string,
    description?: string,
    priority?: string,
    dueDate?: string,
    tags?: string[]
  ): Promise<Card | null> => {
    try {
      const maxPosition = cards.length > 0 
        ? Math.max(...cards.map(c => c.position)) + 1
        : 0;

      const { data, error: err } = await supabase
        .from('kos_cards')
        .insert([{
          column_id: columnId,
          title,
          description: description || null,
          priority: priority || null,
          due_date: dueDate || null,
          tags: tags || null,
          position: maxPosition
        }])
        .select()
        .single();

      if (err) throw err;
      setCards([...cards, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create card');
      return null;
    }
  };

  const updateCard = async (
    id: string,
    updates: Partial<Card>
  ): Promise<boolean> => {
    try {
      const { error: err } = await supabase
        .from('kos_cards')
        .update(updates)
        .eq('id', id);

      if (err) throw err;
      setCards(cards.map(c => c.id === id ? { ...c, ...updates } : c));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update card');
      return false;
    }
  };

  const moveCard = async (
    cardId: string,
    targetColumnId: string,
    newPosition: number
  ): Promise<boolean> => {
    try {
      const { error: err } = await supabase
        .from('kos_cards')
        .update({
          column_id: targetColumnId,
          position: newPosition
        })
        .eq('id', cardId);

      if (err) throw err;
      
      // Update local state if moving within same column
      if (cards.find(c => c.id === cardId)?.column_id === targetColumnId) {
        setCards(cards.map(c =>
          c.id === cardId ? { ...c, position: newPosition } : c
        ));
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move card');
      return false;
    }
  };

  const deleteCard = async (id: string): Promise<boolean> => {
    try {
      const { error: err } = await supabase
        .from('kos_cards')
        .delete()
        .eq('id', id);

      if (err) throw err;
      setCards(cards.filter(c => c.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete card');
      return false;
    }
  };

  return { cards, loading, error, createCard, updateCard, moveCard, deleteCard };
};
