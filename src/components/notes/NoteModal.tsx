import React, { useState, useEffect } from 'react';
import type { Note } from '../../types';
import { Modal } from '../base/Modal';
import { Input } from '../base/Input';
import { Button } from '../base/Button';

interface NoteModalProps {
  isOpen: boolean;
  note: Note | null;
  onClose: () => void;
  onSave: (note: Partial<Note>) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({ isOpen, note, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category || '');
      setTags(note.tags?.join(', ') || '');
    } else {
      resetForm();
    }
  }, [note, isOpen]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('');
    setTags('');
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    onSave({
      id: note?.id,
      title: title.trim(),
      content: content.trim(),
      category: category.trim() || null,
      tags: tags.trim() ? tags.split(',').map(t => t.trim()) : null,
    } as Partial<Note>);

    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={note ? 'Edit Note' : 'New Note'}
      size="lg"
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!title.trim() || !content.trim()}
          >
            {note ? 'Update' : 'Create'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title..."
          required
          fullWidth
        />

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter note content..."
            className="w-full px-3 py-2 bg-bg-tertiary border border-border-default rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
            rows={10}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. work, personal, idea"
            fullWidth
          />

          <Input
            label="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. urgent, review"
            fullWidth
          />
        </div>
      </div>
    </Modal>
  );
};
