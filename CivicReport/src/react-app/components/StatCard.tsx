import { LucideIcon } from 'lucide-react';
import { cn } from '@/react-app/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
  trend?: {
    value: number;
    label: string;
  };
}

const variantStyles = {
  default: {
    icon: 'bg-secondary text-secondary-foreground',
    card: '',
  },
  primary: {
    icon: 'bg-primary/10 text-primary',
    card: '',
  },
  success: {
    icon: 'bg-success/10 text-success',
    card: '',
  },
  warning: {
    icon: 'bg-warning/10 text-warning',
    card: '',
  },
  destructive: {
    icon: 'bg-destructive/10 text-destructive',
    card: '',
  },
};

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  variant = 'default',
  trend 
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className={cn(
      "bg-card rounded-xl p-4 border border-border shadow-card hover:shadow-card-hover transition-shadow duration-200 animate-fade-in",
      styles.card
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
            {title}
          </p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {value}
          </p>
          {trend && (
            <p className={cn(
              "text-xs mt-1",
              trend.value >= 0 ? "text-success" : "text-destructive"
            )}>
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className={cn(
          "p-2.5 rounded-lg shrink-0",
          styles.icon
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
