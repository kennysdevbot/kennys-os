import React from 'react';
import type { Note } from '../../types';
import { Badge } from '../base/Badge';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  const truncateContent = (content: string, maxLines: number = 3) => {
    const lines = content.split('\n').slice(0, maxLines).join('\n');
    return lines.length > 150 ? lines.substring(0, 150) + '...' : lines;
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  };

  return (
    <div
      onClick={() => onEdit(note)}
      className="group bg-bg-tertiary border border-border-default rounded-lg p-4 cursor-pointer hover:border-border-strong hover:bg-bg-secondary transition-all hover:shadow-lg"
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-text-primary line-clamp-2 flex-1">
            {note.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="text-text-tertiary hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-text-secondary line-clamp-3 whitespace-pre-wrap break-words">
          {truncateContent(note.content)}
        </p>

        <div className="flex flex-wrap gap-1 items-end justify-between pt-2">
          <div className="flex flex-wrap gap-1">
            {note.category && (
              <Badge variant="secondary" size="xs" className="bg-blue-500/10 text-blue-300">
                {note.category}
              </Badge>
            )}
            {note.tags?.slice(0, 2).map(tag => (
              <Badge key={tag} variant="secondary" size="xs" className="bg-purple-500/10 text-purple-300">
                {tag}
              </Badge>
            ))}
            {note.tags && note.tags.length > 2 && (
              <Badge variant="secondary" size="xs" className="bg-gray-500/10 text-gray-300">
                +{note.tags.length - 2}
              </Badge>
            )}
          </div>
          <span className="text-xs text-text-tertiary flex-shrink-0">
            {formatDate(note.updated_at)}
          </span>
        </div>
      </div>
    </div>
  );
};
