import React, { useState, useEffect } from 'react';
import { useSearch } from '../../hooks';
import { SearchResults } from './SearchResults';

export const SearchBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { results, loading, search } = useSearch();

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      search(query);
    }
  }, [query, search]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-2 bg-bg-elevated border border-border-default rounded-lg text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-sm">Search...</span>
        <kbd className="ml-auto text-xs px-2 py-0.5 bg-bg-tertiary rounded border border-border-default">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Search Modal */}
      <div className="relative w-full max-w-2xl mx-4 z-10">
        <div className="bg-bg-secondary border border-border-default rounded-lg shadow-lg overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border-default">
            <svg className="w-5 h-5 text-text-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search cards, notes, inbox..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent text-text-primary placeholder-text-tertiary focus:outline-none"
            />
            <span className="text-xs text-text-tertiary">ESC</span>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center text-text-secondary">
                Searching...
              </div>
            ) : query.trim() === '' ? (
              <div className="px-4 py-8 text-center text-text-tertiary">
                Start typing to search
              </div>
            ) : results.length === 0 ? (
              <div className="px-4 py-8 text-center text-text-tertiary">
                No results found
              </div>
            ) : (
              <SearchResults results={results} onSelect={() => setIsOpen(false)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
