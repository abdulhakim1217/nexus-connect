import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface NeonButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

const NeonButton = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  ...props
}: NeonButtonProps) => {
  const variants = {
    primary: 'neon-button',
    secondary: 'neon-button-secondary',
    accent: 'bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-glow-accent',
    ghost: 'bg-transparent border border-border hover:bg-muted/50 hover:border-primary/50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        variants[variant],
        sizes[size],
        className
      )}
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default NeonButton;
