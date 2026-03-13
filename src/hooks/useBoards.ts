import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Board } from '../types';

export const useBoards = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const { data, error: err } = await supabase
          .from('kos_boards')
          .select('*')
          .order('created_at', { ascending: true });

        if (err) throw err;
        setBoards(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch boards');
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  const createBoard = async (name: string): Promise<Board | null> => {
    try {
      const { data, error: err } = await supabase
        .from('kos_boards')
        .insert([{ name }])
        .select()
        .single();

      if (err) throw err;
      setBoards([...boards, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create board');
      return null;
    }
  };

  const deleteBoard = async (id: string): Promise<boolean> => {
    try {
      const { error: err } = await supabase
        .from('kos_boards')
        .delete()
        .eq('id', id);

      if (err) throw err;
      setBoards(boards.filter(b => b.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete board');
      return false;
    }
  };

  return { boards, loading, error, createBoard, deleteBoard };
};
