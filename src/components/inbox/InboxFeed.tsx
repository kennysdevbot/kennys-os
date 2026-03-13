import React, { useState } from 'react';
import { useInboxItems, useBoards, useColumns } from '../../hooks';
import { InboxItemCard } from './InboxItemCard';
import { PromoteModal } from './PromoteModal';
import { Button } from '../base/Button';

export const InboxFeed: React.FC = () => {
  const { items, deleteItem, promoteToCard, promoteToNote } = useInboxItems();
  const { boards } = useBoards();
  const [selectedBoardId, setSelectedBoardId] = useState(boards[0]?.id || '');
  const { columns } = useColumns(selectedBoardId || null);
  const [selectedColumnId, setSelectedColumnId] = useState(columns[0]?.id || '');

  const [promoteModal, setPromoteModal] = useState<{
    isOpen: boolean;
    type: 'card' | 'note';
    itemId: string;
  }>({
    isOpen: false,
    type: 'card',
    itemId: '',
  });

  const [filterType, setFilterType] = useState<string>('');

  const displayItems = filterType
    ? items.filter(i => i.type === filterType)
    : items;

  const handlePromoteToCard = (itemId: string) => {
    setPromoteModal({
      isOpen: true,
      type: 'card',
      itemId,
    });
  };

  const handlePromoteToNote = (itemId: string) => {
    setPromoteModal({
      isOpen: true,
      type: 'note',
      itemId,
    });
  };

  const handleConfirmPromote = async (title: string) => {
    const { itemId, type } = promoteModal;

    if (type === 'card' && selectedBoardId && selectedColumnId) {
      await promoteToCard(itemId, selectedBoardId, selectedColumnId, title);
    } else if (type === 'note') {
      await promoteToNote(itemId, title);
    }

    setPromoteModal({ isOpen: false, type: 'card', itemId: '' });
  };

  const typeFilterOptions = Array.from(
    new Set(items.map(i => i.type).filter(Boolean) as string[])
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-4">Inbox</h1>

        {/* Filters */}
        <div className="flex gap-1 flex-wrap mb-4">
          <Button
            variant={filterType === '' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilterType('')}
          >
            All ({items.length})
          </Button>
          {typeFilterOptions.map(type => {
            const count = items.filter(i => i.type === type).length;
            return (
              <Button
                key={type}
                variant={filterType === type ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilterType(type)}
              >
                {type} ({count})
              </Button>
            );
          })}
        </div>

        {/* Board/Column selector for promoting to cards */}
        {boards.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            <label className="text-xs text-text-secondary flex items-center">
              Promote to board:
            </label>
            <select
              value={selectedBoardId}
              onChange={(e) => {
                setSelectedBoardId(e.target.value);
                setSelectedColumnId(columns[0]?.id || '');
              }}
              className="px-2 py-1 bg-bg-tertiary border border-border-default rounded text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {boards.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            {columns.length > 0 && (
              <select
                value={selectedColumnId}
                onChange={(e) => setSelectedColumnId(e.target.value)}
                className="px-2 py-1 bg-bg-tertiary border border-border-default rounded text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {columns.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Inbox Feed */}
      {displayItems.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-text-secondary">
            {filterType ? 'No items with this type' : 'Inbox is empty'}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-w-2xl">
          {displayItems.map(item => (
            <InboxItemCard
              key={item.id}
              item={item}
              onPromoteToCard={() => handlePromoteToCard(item.id)}
              onPromoteToNote={() => handlePromoteToNote(item.id)}
              onDelete={deleteItem}
            />
          ))}
        </div>
      )}

      {/* Promote Modal */}
      <PromoteModal
        isOpen={promoteModal.isOpen}
        type={promoteModal.type}
        boardId={selectedBoardId}
        columnId={selectedColumnId}
        onClose={() => setPromoteModal({ ...promoteModal, isOpen: false })}
        onConfirm={handleConfirmPromote}
      />
    </div>
  );
};
