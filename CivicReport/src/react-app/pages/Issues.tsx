import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import MobileLayout from '@/react-app/components/layout/MobileLayout';
import IssueCard from '@/react-app/components/IssueCard';
import { Input } from '@/react-app/components/ui/input';
import { Badge } from '@/react-app/components/ui/badge';
import { 
  mockIssues, 
  IssueStatus, 
  IssueCategory,
  statusLabels,
  categoryLabels 
} from '@/react-app/data/issues';
import { cn } from '@/react-app/lib/utils';

type FilterType = 'all' | IssueStatus;

const statusFilters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
];

const categoryFilters: { value: IssueCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'road', label: 'Road' },
  { value: 'garbage', label: 'Garbage' },
  { value: 'water', label: 'Water' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'sewage', label: 'Sewage' },
  { value: 'streetlight', label: 'Lighting' },
  { value: 'other', label: 'Other' },
];

export default function IssuesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredIssues = mockIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const activeFiltersCount = (statusFilter !== 'all' ? 1 : 0) + (categoryFilter !== 'all' ? 1 : 0);

  return (
    <MobileLayout>
      <div className="px-4 py-6 space-y-4">
        {/* Header */}
        <header className="animate-fade-in">
          <h1 className="text-xl font-bold text-foreground">All Issues</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''} found
          </p>
        </header>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-2 animate-fade-in">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-secondary"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "p-2.5 rounded-lg border transition-colors relative",
              showFilters || activeFiltersCount > 0
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-foreground hover:bg-secondary"
            )}
          >
            <Filter className="h-4 w-4" />
            {activeFiltersCount > 0 && !showFilters && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-card rounded-xl border border-border p-4 space-y-4 animate-fade-in">
            {/* Status Filter */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Status
              </p>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setStatusFilter(filter.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                      statusFilter === filter.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                {categoryFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setCategoryFilter(filter.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                      categoryFilter === filter.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
                className="text-xs text-primary font-medium hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Active Filter Badges */}
        {!showFilters && activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 animate-fade-in">
            {statusFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1 pl-2 pr-1">
                {statusLabels[statusFilter]}
                <button
                  onClick={() => setStatusFilter('all')}
                  className="p-0.5 rounded-full hover:bg-foreground/10"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {categoryFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1 pl-2 pr-1">
                {categoryLabels[categoryFilter]}
                <button
                  onClick={() => setCategoryFilter('all')}
                  className="p-0.5 rounded-full hover:bg-foreground/10"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Issues List */}
        <div className="space-y-3">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue, index) => (
              <div 
                key={issue.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-slide-up"
              >
                <IssueCard issue={issue} />
              </div>
            ))
          ) : (
            <div className="text-center py-12 animate-fade-in">
              <div className="p-4 bg-secondary rounded-full w-fit mx-auto mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground">No issues found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
