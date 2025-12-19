import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'primary' | 'accent' | 'secondary' | 'none';
}

const GlassCard = ({ 
  children, 
  className, 
  hover = true, 
  glow = 'primary',
  ...props 
}: GlassCardProps) => {
  const glowColors = {
    primary: 'hover:shadow-glow-primary hover:border-primary/50',
    accent: 'hover:shadow-glow-accent hover:border-accent/50',
    secondary: 'hover:shadow-glow-secondary hover:border-secondary/50',
    none: '',
  };

  return (
    <motion.div
      className={cn(
        'glass-card p-6 transition-all duration-300',
        hover && 'hover:translate-y-[-4px]',
        glow !== 'none' && glowColors[glow],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={hover ? { scale: 1.02 } : undefined}
      {...props}
    >
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      
      {children}
    </motion.div>
  );
};

export default GlassCard;
