import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  Share2,
  Flag,
  ThumbsUp,
  Construction,
  Trash2,
  Droplets,
  Zap,
  Lightbulb,
  HelpCircle,
  Pipette,
  CheckCircle2,
  Circle,
  AlertCircle
} from 'lucide-react';
import MobileLayout from '@/react-app/components/layout/MobileLayout';
import { Button } from '@/react-app/components/ui/button';
import { Badge } from '@/react-app/components/ui/badge';
import { getIssueById, categoryLabels, statusLabels, priorityLabels } from '@/react-app/data/issues';
import { cn } from '@/react-app/lib/utils';

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
  low: 'bg-priority-low/10 text-priority-low border-priority-low/20',
  medium: 'bg-priority-medium/10 text-priority-medium border-priority-medium/20',
  high: 'bg-priority-high/10 text-priority-high border-priority-high/20',
};

const timelineIcons: Record<string, React.ElementType> = {
  'Issue Resolved': CheckCircle2,
  'Repair Scheduled': Clock,
  'Emergency Repair Started': AlertCircle,
  'Issue Verified': CheckCircle2,
  'Parts Ordered': Clock,
  'Report Submitted': Circle,
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export default function IssueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const issue = getIssueById(id || '');

  if (!issue) {
    return (
      <MobileLayout hideNav>
        <div className="flex flex-col items-center justify-center h-full p-4">
          <p className="text-muted-foreground">Issue not found</p>
          <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </MobileLayout>
    );
  }

  const CategoryIcon = categoryIconMap[issue.category];

  return (
    <MobileLayout hideNav>
      <div className="pb-24">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-foreground truncate">Issue Details</h1>
            </div>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <Share2 className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </header>

        <div className="px-4 py-4 space-y-5">
          {/* Issue Header */}
          <section className="animate-fade-in">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-secondary">
                <CategoryIcon className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">
                  {categoryLabels[issue.category]}
                </p>
                <h2 className="text-lg font-semibold text-foreground leading-tight">
                  {issue.title}
                </h2>
              </div>
            </div>

            {/* Status & Priority Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="outline" 
                className={cn("font-medium border", statusStyles[issue.status])}
              >
                {statusLabels[issue.status]}
              </Badge>
              <Badge 
                variant="outline" 
                className={cn("font-medium border", priorityStyles[issue.priority])}
              >
                {priorityLabels[issue.priority]} Priority
              </Badge>
            </div>
          </section>

          {/* Meta Info */}
          <section className="grid grid-cols-2 gap-3 animate-fade-in">
            <div className="bg-card rounded-xl border border-border p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-xs">Reported</span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {formatShortDate(issue.createdAt)}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="h-3.5 w-3.5" />
                <span className="text-xs">Reports</span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {issue.reportCount} {issue.reportCount === 1 ? 'person' : 'people'}
              </p>
            </div>
          </section>

          {/* Location */}
          <section className="animate-fade-in">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Location
            </h3>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {/* Map placeholder */}
              <div className="h-32 bg-secondary relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Map view</p>
                  </div>
                </div>
              </div>
              <div className="p-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <p className="text-sm text-foreground">{issue.location.address}</p>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="animate-fade-in">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Description
            </h3>
            <div className="bg-card rounded-xl border border-border p-3">
              <p className="text-sm text-foreground leading-relaxed">
                {issue.description}
              </p>
            </div>
          </section>

          {/* Images */}
          {issue.images.length > 0 && (
            <section className="animate-fade-in">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Photos ({issue.images.length})
              </h3>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
                {issue.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Issue photo ${index + 1}`}
                    className="w-32 h-24 rounded-xl object-cover shrink-0 border border-border"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Timeline */}
          <section className="animate-fade-in">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Status Updates
            </h3>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="space-y-4">
                {issue.updates.map((update, index) => {
                  const TimelineIcon = timelineIcons[update.title] || Circle;
                  const isFirst = index === 0;
                  const isLast = index === issue.updates.length - 1;
                  
                  return (
                    <div key={update.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "p-1.5 rounded-full",
                          isFirst ? "bg-primary/10" : "bg-secondary"
                        )}>
                          <TimelineIcon className={cn(
                            "h-3.5 w-3.5",
                            isFirst ? "text-primary" : "text-muted-foreground"
                          )} />
                        </div>
                        {!isLast && (
                          <div className="w-px flex-1 bg-border mt-2" />
                        )}
                      </div>
                      <div className={cn("pb-4", isLast && "pb-0")}>
                        <p className={cn(
                          "text-sm font-medium",
                          isFirst ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {update.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(update.date)}
                        </p>
                        <p className="text-sm text-foreground mt-1.5">
                          {update.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border p-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              Upvote ({issue.reportCount})
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
