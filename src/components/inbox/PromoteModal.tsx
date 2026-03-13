import React, { useState } from 'react';
import { Modal } from '../base/Modal';
import { Button } from '../base/Button';
import { Input } from '../base/Input';

interface PromoteModalProps {
  isOpen: boolean;
  type: 'card' | 'note';
  boardId?: string;
  columnId?: string;
  onClose: () => void;
  onConfirm: (title: string) => void;
}

export const PromoteModal: React.FC<PromoteModalProps> = ({
  isOpen,
  type,
  onClose,
  onConfirm,
}) => {
  const [title, setTitle] = useState('');

  const handleConfirm = () => {
    if (!title.trim()) return;
    onConfirm(title);
    setTitle('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Promote to ${type === 'card' ? 'Card' : 'Note'}`}
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!title.trim()}
          >
            Promote
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-text-secondary">
          {type === 'card'
            ? 'Create a new card from this inbox item'
            : 'Create a new note from this inbox item'}
        </p>
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title for the new item..."
          required
          fullWidth
          autoFocus
        />
      </div>
    </Modal>
  );
};
