'use client';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 text-xs px-2.5 py-0.5',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        success: 'border-transparent bg-emerald-500 text-white',
        warning: 'border-transparent bg-amber-500 text-white',
        positive: 'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100',
        negative: 'border-transparent bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100',
        defi: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
        nft: 'border-transparent bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
        gamefi: 'border-transparent bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100',
        layer1: 'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
        layer2: 'border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
        dao: 'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        privacy: 'border-transparent bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100',
        infrastructure: 'border-transparent bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100',
      },
      size: {
        default: 'h-6 text-xs',
        sm: 'h-5 text-xs',
        lg: 'h-7 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface BadgeCustomProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  animate?: boolean;
}

function BadgeCustom({ className, variant, size, animate = false, ...props }: BadgeCustomProps) {
  const Comp = animate ? motion.div : 'div';

  return (
    <Comp
      className={cn(badgeVariants({ variant, size }), className)}
      {...(animate && {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: 'spring', stiffness: 500, damping: 30 },
      })}
      {...props}
    />
  );
}

export { BadgeCustom, badgeVariants };
