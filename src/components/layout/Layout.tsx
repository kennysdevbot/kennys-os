import React from 'react';
import { Sidebar } from './Sidebar';
import { SearchBar } from '../search/SearchBar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-bg-primary">
        <div className="sticky top-0 z-40 border-b border-border-default bg-bg-primary px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <SearchBar />
          </div>
        </div>
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
