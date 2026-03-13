import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Column } from '../types';

export const useColumns = (boardId: string | null) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!boardId) {
      setColumns([]);
      setLoading(false);
      return;
    }

    const fetchColumns = async () => {
      try {
        const { data, error: err } = await supabase
          .from('kos_columns')
          .select('*')
          .eq('board_id', boardId)
          .order('position', { ascending: true });

        if (err) throw err;
        setColumns(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch columns');
      } finally {
        setLoading(false);
      }
    };

    fetchColumns();
  }, [boardId]);

  const createColumn = async (boardId: string, name: string): Promise<Column | null> => {
    try {
      const maxPosition = columns.length > 0 
        ? Math.max(...columns.map(c => c.position)) + 1
        : 0;

      const { data, error: err } = await supabase
        .from('kos_columns')
        .insert([{ board_id: boardId, name, position: maxPosition }])
        .select()
        .single();

      if (err) throw err;
      setColumns([...columns, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create column');
      return null;
    }
  };

  const updateColumnPosition = async (id: string, position: number): Promise<boolean> => {
    try {
      const { error: err } = await supabase
        .from('kos_columns')
        .update({ position })
        .eq('id', id);

      if (err) throw err;
      setColumns(columns.map(c => c.id === id ? { ...c, position } : c));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update column position');
      return false;
    }
  };

  const deleteColumn = async (id: string): Promise<boolean> => {
    try {
      const { error: err } = await supabase
        .from('kos_columns')
        .delete()
        .eq('id', id);

      if (err) throw err;
      setColumns(columns.filter(c => c.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete column');
      return false;
    }
  };

  return { columns, loading, error, createColumn, updateColumnPosition, deleteColumn };
};
