import React, { useState } from 'react';
import type { Note } from '../../types';
import { useNotes } from '../../hooks';
import { NoteCard } from './NoteCard';
import { NoteModal } from './NoteModal';
import { Button } from '../base/Button';
import { Input } from '../base/Input';

export const NotesGrid: React.FC = () => {
  const { notes, createNote, updateNote, deleteNote, searchNotes } = useNotes();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const displayNotes = searchQuery.trim()
    ? searchNotes(searchQuery)
    : filterCategory
      ? notes.filter(n => n.category === filterCategory)
      : notes;

  const categories = Array.from(
    new Set(notes.map(n => n.category).filter(Boolean) as string[])
  ).sort();

  const handleAddNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Delete this note?')) return;
    await deleteNote(noteId);
  };

  const handleSaveNote = async (noteData: Partial<Note>) => {
    if (editingNote) {
      await updateNote(editingNote.id, noteData);
    } else {
      await createNote(
        noteData.title || '',
        noteData.content || '',
        noteData.category || undefined,
        noteData.tags || undefined
      );
    }
    setIsModalOpen(false);
    setEditingNote(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-text-primary">Notes</h1>
          <Button variant="primary" onClick={handleAddNote}>
            + New Note
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />

          <div className="flex gap-1 flex-wrap">
            <Button
              variant={filterCategory === '' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterCategory('')}
            >
              All
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={filterCategory === cat ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      {displayNotes.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-text-secondary">
            {searchQuery || filterCategory ? 'No notes found' : 'No notes yet. Create one to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayNotes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>
      )}

      {/* Note Modal */}
      <NoteModal
        isOpen={isModalOpen}
        note={editingNote}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
      />
    </div>
  );
};
