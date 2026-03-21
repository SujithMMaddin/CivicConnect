import { useNavigate } from 'react-router';
import { 
  MapPin, 
  Clock, 
  Users, 
  ChevronRight,
  Construction,
  Trash2,
  Droplets,
  Zap,
  Lightbulb,
  HelpCircle,
  Pipette
} from 'lucide-react';
import { Issue, categoryLabels, statusLabels } from '@/react-app/data/issues';
import { cn } from '@/react-app/lib/utils';
import { Badge } from '@/react-app/components/ui/badge';

interface IssueCardProps {
  issue: Issue;
  compact?: boolean;
}

const categoryIconMap = {
  road: Construction,
  garbage: Trash2,
  water: Droplets,
  electricity: Zap,
  sewage: Pipette,
  streetlight: Lightbulb,
  other: HelpCircle,
};

const statusStyles = {
  pending: 'bg-status-pending/10 text-status-pending border-status-pending/20',
  'in-progress': 'bg-status-progress/10 text-status-progress border-status-progress/20',
  resolved: 'bg-status-resolved/10 text-status-resolved border-status-resolved/20',
};

const priorityStyles = {
  low: 'bg-priority-low',
  medium: 'bg-priority-medium',
  high: 'bg-priority-high',
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function IssueCard({ issue, compact = false }: IssueCardProps) {
  const navigate = useNavigate();
  const CategoryIcon = categoryIconMap[issue.category];

  return (
    <button
      onClick={() => navigate(`/issues/${issue.id}`)}
      className={cn(
        "w-full text-left bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden group animate-fade-in",
        compact ? "p-3" : "p-4"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Priority indicator */}
        <div className={cn(
          "w-1 self-stretch rounded-full shrink-0",
          priorityStyles[issue.priority]
        )} />
        
        {/* Category icon */}
        <div className="p-2 rounded-lg bg-secondary shrink-0">
          <CategoryIcon className="h-4 w-4 text-secondary-foreground" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn(
              "font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors",
              compact ? "text-sm" : "text-base"
            )}>
              {issue.title}
            </h3>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </div>
          
          {/* Status badge */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <Badge 
              variant="outline" 
              className={cn("text-[10px] font-medium border", statusStyles[issue.status])}
            >
              {statusLabels[issue.status]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {categoryLabels[issue.category]}
            </span>
          </div>
          
          {/* Meta info */}
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[120px]">{issue.location.address}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(issue.createdAt)}
            </span>
            {issue.reportCount > 1 && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {issue.reportCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
