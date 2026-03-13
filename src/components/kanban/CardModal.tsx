import React, { useState, useEffect } from 'react';
import type { Card as CardType } from '../../types';
import { Modal } from '../base/Modal';
import { Input } from '../base/Input';
import { Button } from '../base/Button';

interface CardModalProps {
  isOpen: boolean;
  card: CardType | null;
  onClose: () => void;
  onSave: (card: Partial<CardType>) => void;
}

export const CardModal: React.FC<CardModalProps> = ({ isOpen, card, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<string>('');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
      setPriority(card.priority || '');
      setDueDate(card.due_date || '');
      setTags(card.tags?.join(', ') || '');
    } else {
      resetForm();
    }
  }, [card, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('');
    setDueDate('');
    setTags('');
  };

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      id: card?.id,
      title,
      description: description.trim() || null,
      priority: priority || null,
      due_date: dueDate || null,
      tags: tags.trim() ? tags.split(',').map(t => t.trim()) : null,
    } as Partial<CardType>);

    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={card ? 'Edit Card' : 'New Card'}
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!title.trim()}
          >
            {card ? 'Update' : 'Create'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">

        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter card title..."
          required
        />

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter card description..."
            className="w-full px-3 py-2 bg-bg-tertiary border border-border-default rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border-default rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border-default rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <Input
          label="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. urgent, work, review"
        />
      </div>
    </Modal>
  );
};
