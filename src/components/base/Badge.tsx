import React from 'react';
import type { Priority } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'priority';
  priority?: Priority;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  priority,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
  
  const priorityColors = {
    low: 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30',
    medium: 'bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30',
    high: 'bg-accent-red/20 text-accent-red border border-accent-red/30',
    critical: 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30',
  };
  
  const defaultStyles = 'bg-bg-elevated text-text-secondary border border-border-default';
  
  const variantStyles = variant === 'priority' && priority
    ? priorityColors[priority]
    : defaultStyles;
  
  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </span>
  );
};
