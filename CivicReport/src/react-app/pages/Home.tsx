import { useNavigate } from 'react-router';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Plus,
  Bell,
  ArrowRight
} from 'lucide-react';
import MobileLayout from '@/react-app/components/layout/MobileLayout';
import StatCard from '@/react-app/components/StatCard';
import IssueCard from '@/react-app/components/IssueCard';
import { Button } from '@/react-app/components/ui/button';
import { getIssueStats, getRecentIssues } from '@/react-app/data/issues';

export default function HomePage() {
  const navigate = useNavigate();
  const stats = getIssueStats();
  const recentIssues = getRecentIssues(3);

  return (
    <MobileLayout>
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between animate-fade-in">
          <div>
            <p className="text-sm text-muted-foreground">Welcome to</p>
            <h1 className="text-xl font-bold text-foreground">CivicReport</h1>
          </div>
          <button className="relative p-2 rounded-full bg-card border border-border shadow-card hover:bg-secondary transition-colors">
            <Bell className="h-5 w-5 text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </button>
        </header>

        {/* Quick action banner */}
        <div 
          className="bg-primary rounded-2xl p-4 shadow-md animate-slide-up cursor-pointer hover:bg-primary/90 transition-colors"
          onClick={() => navigate('/report')}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-white font-semibold text-base">Report an Issue</h2>
              <p className="text-white/80 text-sm mt-0.5">
                Help improve your community
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-white/80" />
          </div>
        </div>

        {/* Stats Grid */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Overview
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              title="Total Issues"
              value={stats.total}
              icon={FileText}
              variant="primary"
            />
            <StatCard
              title="High Priority"
              value={stats.highPriority}
              icon={AlertTriangle}
              variant="destructive"
            />
            <StatCard
              title="In Progress"
              value={stats.inProgress}
              icon={FileText}
              variant="warning"
            />
            <StatCard
              title="Resolved"
              value={stats.resolved}
              icon={CheckCircle2}
              variant="success"
            />
          </div>
        </section>

        {/* Recent Issues */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Recent Issues
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/issues')}
              className="text-primary hover:text-primary/90 h-auto py-1 px-2"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentIssues.map((issue, index) => (
              <div 
                key={issue.id} 
                style={{ animationDelay: `${index * 100}ms` }}
                className="animate-slide-up"
              >
                <IssueCard issue={issue} compact />
              </div>
            ))}
          </div>
        </section>

        {/* Help section */}
        <section className="bg-card rounded-xl border border-border p-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <AlertTriangle className="h-4 w-4 text-info" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground text-sm">Need help?</h3>
              <p className="text-xs text-muted-foreground mt-1">
                For emergencies, please call 911. This app is for non-emergency civic issues only.
              </p>
            </div>
          </div>
        </section>
      </div>
    </MobileLayout>
  );
}
