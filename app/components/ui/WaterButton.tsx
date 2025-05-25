import React from 'react';
import { classNames } from '~/utils/classNames';
import waterStyles from './WaterButton.module.scss';

type ButtonVariant = 'default' | 'green' | 'purple' | 'red' | 'blue';

interface WaterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function WaterButton({
  variant = 'default',
  className,
  children,
  fullWidth = false,
  size = 'md',
  ...props
}: WaterButtonProps) {
  const sizeClasses = {
    sm: 'text-xs py-1 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-3 px-6',
  };

  return (
    <button
      className={classNames(
        'relative overflow-hidden',
        'text-white font-medium',
        'rounded-md',
        'transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        fullWidth ? 'w-full' : 'w-auto',
        sizeClasses[size],
        waterStyles.waterButton,
        waterStyles[variant],
        className,
      )}
      {...props}
    >
      <div className={waterStyles.waterSurface}></div>
      <div className={waterStyles.waterDroplets}></div>
      <div className={waterStyles.buttonContent}>{children}</div>
    </button>
  );
}
