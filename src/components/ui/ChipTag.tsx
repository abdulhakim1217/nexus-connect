import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ChipTagProps {
  label: string;
  selected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  removable?: boolean;
  className?: string;
  color?: 'primary' | 'accent' | 'secondary' | 'default';
}

const ChipTag = ({
  label,
  selected = false,
  onSelect,
  onRemove,
  removable = false,
  className,
  color = 'default',
}: ChipTagProps) => {
  const colorStyles = {
    primary: 'bg-primary/20 border-primary/50 text-primary',
    accent: 'bg-accent/20 border-accent/50 text-accent',
    secondary: 'bg-secondary/20 border-secondary/50 text-secondary',
    default: '',
  };

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className={cn(
        'chip-tag cursor-pointer',
        selected && 'active',
        color !== 'default' && colorStyles[color],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: selected ? [0, -4, 0] : 0,
      }}
      transition={{ 
        duration: 0.2,
        y: { duration: 0.3, ease: 'easeOut' }
      }}
    >
      <span>{label}</span>
      {removable && onRemove && (
        <motion.span
          className="ml-1.5 p-0.5 rounded-full hover:bg-foreground/10"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
        >
          <X className="w-3 h-3" />
        </motion.span>
      )}
    </motion.button>
  );
};

export default ChipTag;
