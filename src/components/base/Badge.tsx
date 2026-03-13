import React from 'react';
import type { Priority } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'priority';
  priority?: Priority;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  priority,
  size = 'sm',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center rounded-full font-medium whitespace-nowrap';
  
  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };
  
  const priorityColors = {
    low: 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30',
    medium: 'bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30',
    high: 'bg-accent-red/20 text-accent-red border border-accent-red/30',
    critical: 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30',
  };
  
  const variantStyles = {
    default: 'bg-bg-elevated text-text-secondary border border-border-default',
    primary: 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30',
    secondary: 'bg-bg-tertiary text-text-secondary border border-border-default',
    priority: priority ? priorityColors[priority] : 'bg-bg-elevated text-text-secondary',
  };
  
  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
