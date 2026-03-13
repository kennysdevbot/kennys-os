import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface SearchResult {
  type: 'card' | 'note' | 'inbox';
  id: string;
  title: string;
  content?: string;
  source?: string;
  created_at: string;
}

export const useSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string, filters?: {
    type?: 'card' | 'note' | 'inbox';
    priority?: string;
  }): Promise<void> => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const q = query.toLowerCase();
      const allResults: SearchResult[] = [];

      // Search cards
      if (!filters?.type || filters.type === 'card') {
        const { data: cards, error: cardErr } = await supabase
          .from('kos_cards')
          .select('*');

        if (!cardErr) {
          const filtered = (cards || []).filter(card =>
            card.title.toLowerCase().includes(q) ||
            (card.description?.toLowerCase().includes(q) ?? false) ||
            (card.tags?.some((t: string) => t.toLowerCase().includes(q)) ?? false)
          );

          if (filters?.priority) {
            filtered.push(...filtered.filter(c => c.priority === filters.priority));
          }

          allResults.push(...filtered.map(c => ({
            type: 'card' as const,
            id: c.id,
            title: c.title,
            content: c.description,
            created_at: c.created_at,
          })));
        }
      }

      // Search notes
      if (!filters?.type || filters.type === 'note') {
        const { data: notes, error: noteErr } = await supabase
          .from('kos_notes')
          .select('*');

        if (!noteErr) {
          const filtered = (notes || []).filter(note =>
            note.title.toLowerCase().includes(q) ||
            note.content.toLowerCase().includes(q) ||
            (note.category?.toLowerCase().includes(q) ?? false) ||
            (note.tags?.some((t: string) => t.toLowerCase().includes(q)) ?? false)
          );

          allResults.push(...filtered.map(n => ({
            type: 'note' as const,
            id: n.id,
            title: n.title,
            content: n.content,
            created_at: n.created_at,
          })));
        }
      }

      // Search inbox
      if (!filters?.type || filters.type === 'inbox') {
        const { data: inbox, error: inboxErr } = await supabase
          .from('kos_inbox_items')
          .select('*');

        if (!inboxErr) {
          const filtered = (inbox || []).filter(item =>
            item.content.toLowerCase().includes(q) ||
            (item.source_agent?.toLowerCase().includes(q) ?? false) ||
            (item.type?.toLowerCase().includes(q) ?? false)
          );

          allResults.push(...filtered.map(i => ({
            type: 'inbox' as const,
            id: i.id,
            title: i.content,
            source: i.source_agent,
            created_at: i.created_at,
          })));
        }
      }

      // Sort by recency
      allResults.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setResults(allResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
};
