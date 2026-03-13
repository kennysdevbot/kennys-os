import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { InboxItem } from '../types';

export const useInboxItems = () => {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error: err } = await supabase
          .from('kos_inbox_items')
          .select('*')
          .order('created_at', { ascending: false });

        if (err) throw err;
        setItems(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch inbox items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const promoteToCard = async (
    itemId: string,
    _boardId: string,
    columnId: string,
    title: string
  ): Promise<boolean> => {
    try {
      // Create card
      const { data: cardData, error: cardErr } = await supabase
        .from('kos_cards')
        .insert([{
          column_id: columnId,
          title,
          description: null,
          position: 0,
        }])
        .select()
        .single();

      if (cardErr) throw cardErr;

      // Update inbox item
      const { error: updateErr } = await supabase
        .from('kos_inbox_items')
        .update({
          promoted_to: 'card',
          promoted_id: cardData.id,
        })
        .eq('id', itemId);

      if (updateErr) throw updateErr;

      setItems(items.map(i =>
        i.id === itemId
          ? { ...i, promoted_to: 'card' as const, promoted_id: cardData.id }
          : i
      ));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to promote to card');
      return false;
    }
  };

  const promoteToNote = async (
    itemId: string,
    title: string
  ): Promise<boolean> => {
    try {
      // Create note
      const { data: noteData, error: noteErr } = await supabase
        .from('kos_notes')
        .insert([{
          title,
          content: '',
          category: null,
          tags: null,
        }])
        .select()
        .single();

      if (noteErr) throw noteErr;

      // Update inbox item
      const { error: updateErr } = await supabase
        .from('kos_inbox_items')
        .update({
          promoted_to: 'note',
          promoted_id: noteData.id,
        })
        .eq('id', itemId);

      if (updateErr) throw updateErr;

      setItems(items.map(i =>
        i.id === itemId
          ? { ...i, promoted_to: 'note' as const, promoted_id: noteData.id }
          : i
      ));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to promote to note');
      return false;
    }
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      const { error: err } = await supabase
        .from('kos_inbox_items')
        .delete()
        .eq('id', id);

      if (err) throw err;
      setItems(items.filter(i => i.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      return false;
    }
  };

  return {
    items,
    loading,
    error,
    promoteToCard,
    promoteToNote,
    deleteItem,
  };
};
