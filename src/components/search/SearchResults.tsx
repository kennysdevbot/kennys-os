import React from 'react';
import { Badge } from '../base/Badge';

interface SearchResult {
  type: 'card' | 'note' | 'inbox';
  id: string;
  title: string;
  content?: string;
  source?: string;
  created_at: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  onSelect: () => void;
}

const typeColors: Record<string, string> = {
  card: 'bg-blue-500/10 text-blue-300',
  note: 'bg-purple-500/10 text-purple-300',
  inbox: 'bg-green-500/10 text-green-300',
};

export const SearchResults: React.FC<SearchResultsProps> = ({ results, onSelect }) => {
  const grouped = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const types: Array<'card' | 'note' | 'inbox'> = ['card', 'note', 'inbox'];

  return (
    <div className="divide-y divide-border-default">
      {types.map(type => {
        const typeResults = grouped[type];
        if (!typeResults || typeResults.length === 0) return null;

        return (
          <div key={type}>
            <div className="px-4 py-2 bg-bg-tertiary border-b border-border-default">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                {type}s
              </h3>
            </div>
            {typeResults.map(result => (
              <div
                key={result.id}
                onClick={onSelect}
                className="px-4 py-3 hover:bg-bg-tertiary cursor-pointer transition-colors border-b border-border-default last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <Badge
                    variant="secondary"
                    size="xs"
                    className={typeColors[result.type] || 'bg-gray-500/10 text-gray-300'}
                  >
                    {result.type}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary line-clamp-1">
                      {result.title}
                    </p>
                    {result.content && (
                      <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">
                        {result.content}
                      </p>
                    )}
                    {result.source && (
                      <p className="text-xs text-text-tertiary mt-0.5">
                        from {result.source}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
