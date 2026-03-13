// Database types
export interface Board {
  id: string;
  name: string;
  created_at: string;
}

export interface Column {
  id: string;
  board_id: string;
  name: string;
  position: number;
  created_at: string;
}

export interface Card {
  id: string;
  column_id: string;
  title: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical' | null;
  due_date: string | null;
  tags: string[] | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface InboxItem {
  id: string;
  source_agent: string;
  content: string;
  type: 'task' | 'note' | 'link' | 'general' | null;
  promoted_to: 'card' | 'note' | null;
  promoted_id: string | null;
  created_at: string;
}

// UI types
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type InboxItemType = 'task' | 'note' | 'link' | 'general';
