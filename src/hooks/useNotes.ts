import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Note } from '../types';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data, error: err } = await supabase
          .from('kos_notes')
          .select('*')
          .order('updated_at', { ascending: false });

        if (err) throw err;
        setNotes(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const createNote = async (
    title: string,
    content: string,
    category?: string,
    tags?: string[]
  ): Promise<Note | null> => {
    try {
      const { data, error: err } = await supabase
        .from('kos_notes')
        .insert([{
          title,
          content,
          category: category || null,
          tags: tags || null,
        }])
        .select()
        .single();

      if (err) throw err;
      setNotes([data, ...notes]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
      return null;
    }
  };

  const updateNote = async (
    id: string,
    updates: Partial<Note>
  ): Promise<boolean> => {
    try {
      const { error: err } = await supabase
        .from('kos_notes')
        .update(updates)
        .eq('id', id);

      if (err) throw err;
      setNotes(notes.map(n => n.id === id ? { ...n, ...updates } : n));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
      return false;
    }
  };

  const deleteNote = async (id: string): Promise<boolean> => {
    try {
      const { error: err } = await supabase
        .from('kos_notes')
        .delete()
        .eq('id', id);

      if (err) throw err;
      setNotes(notes.filter(n => n.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
      return false;
    }
  };

  const searchNotes = (query: string) => {
    if (!query.trim()) return notes;
    
    const q = query.toLowerCase();
    return notes.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      (n.category?.toLowerCase().includes(q) ?? false) ||
      (n.tags?.some(t => t.toLowerCase().includes(q)) ?? false)
    );
  };

  return { notes, loading, error, createNote, updateNote, deleteNote, searchNotes };
};
