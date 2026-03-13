import React from 'react';
import { Card } from '../components/base';

export const Dashboard: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-2">
          Overview of your personal OS
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Summary Cards */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-tertiary text-sm">Active Tasks</p>
              <p className="text-3xl font-bold text-text-primary mt-1">0</p>
            </div>
            <div className="w-12 h-12 bg-accent-blue/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-tertiary text-sm">Total Notes</p>
              <p className="text-3xl font-bold text-text-primary mt-1">0</p>
            </div>
            <div className="w-12 h-12 bg-accent-purple/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-tertiary text-sm">Inbox Items</p>
              <p className="text-3xl font-bold text-text-primary mt-1">0</p>
            </div>
            <div className="w-12 h-12 bg-accent-yellow/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-accent-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card hover className="cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-blue/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-text-primary">New Task</p>
                <p className="text-sm text-text-tertiary">Create a new Kanban card</p>
              </div>
            </div>
          </Card>
          
          <Card hover className="cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-purple/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-text-primary">New Note</p>
                <p className="text-sm text-text-tertiary">Start writing</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
