import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`
          bg-bg-tertiary border border-border-default rounded px-3 py-2
          text-text-primary placeholder-text-tertiary
          focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent
          transition-all duration-200
          ${fullWidth ? 'w-full' : ''}
          ${error ? 'border-accent-red' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-accent-red mt-1">{error}</p>
      )}
    </div>
  );
};
