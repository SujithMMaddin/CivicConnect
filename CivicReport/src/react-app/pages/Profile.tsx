import { 
  User, 
  Settings, 
  Bell, 
  HelpCircle, 
  FileText, 
  ChevronRight,
  LogOut,
  Shield,
  Moon,
  Sun
} from 'lucide-react';
import { useState } from 'react';
import MobileLayout from '@/react-app/components/layout/MobileLayout';
import { Switch } from '@/react-app/components/ui/switch';
import { cn } from '@/react-app/lib/utils';

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
  variant?: 'default' | 'destructive';
}

function MenuItem({ icon: Icon, label, description, onClick, trailing, variant = 'default' }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors text-left"
    >
      <div className={cn(
        "p-2 rounded-lg",
        variant === 'destructive' ? "bg-destructive/10" : "bg-secondary"
      )}>
        <Icon className={cn(
          "h-4 w-4",
          variant === 'destructive' ? "text-destructive" : "text-secondary-foreground"
        )} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-medium text-sm",
          variant === 'destructive' ? "text-destructive" : "text-foreground"
        )}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground truncate">{description}</p>
        )}
      </div>
      {trailing || <ChevronRight className="h-4 w-4 text-muted-foreground" />}
    </button>
  );
}

export default function ProfilePage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const userStats = {
    reported: 8,
    resolved: 5,
    upvoted: 12,
  };

  return (
    <MobileLayout>
      <div className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">Guest User</h1>
            <p className="text-sm text-muted-foreground">Community Member</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in">
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <p className="text-xl font-bold text-foreground">{userStats.reported}</p>
            <p className="text-xs text-muted-foreground">Reported</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <p className="text-xl font-bold text-success">{userStats.resolved}</p>
            <p className="text-xs text-muted-foreground">Resolved</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <p className="text-xl font-bold text-primary">{userStats.upvoted}</p>
            <p className="text-xs text-muted-foreground">Upvoted</p>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="space-y-4">
          {/* Account Section */}
          <section className="bg-card rounded-xl border border-border overflow-hidden animate-slide-up">
            <div className="px-4 py-2 border-b border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Account
              </p>
            </div>
            <div className="p-1">
              <MenuItem
                icon={User}
                label="Personal Information"
                description="Name, email, phone"
              />
              <MenuItem
                icon={Shield}
                label="Privacy & Security"
                description="Password, data settings"
              />
              <MenuItem
                icon={FileText}
                label="My Reports"
                description="View your submitted issues"
              />
            </div>
          </section>

          {/* Preferences Section */}
          <section className="bg-card rounded-xl border border-border overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="px-4 py-2 border-b border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Preferences
              </p>
            </div>
            <div className="p-1">
              <MenuItem
                icon={Bell}
                label="Notifications"
                description="Push notifications for updates"
                trailing={
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                }
              />
              <MenuItem
                icon={darkMode ? Moon : Sun}
                label="Dark Mode"
                description="Toggle dark theme"
                trailing={
                  <Switch
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                }
              />
              <MenuItem
                icon={Settings}
                label="App Settings"
                description="Language, region"
              />
            </div>
          </section>

          {/* Support Section */}
          <section className="bg-card rounded-xl border border-border overflow-hidden animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="px-4 py-2 border-b border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Support
              </p>
            </div>
            <div className="p-1">
              <MenuItem
                icon={HelpCircle}
                label="Help Center"
                description="FAQs and guides"
              />
              <MenuItem
                icon={FileText}
                label="Terms of Service"
              />
              <MenuItem
                icon={Shield}
                label="Privacy Policy"
              />
            </div>
          </section>

          {/* Sign Out */}
          <section className="bg-card rounded-xl border border-border overflow-hidden animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="p-1">
              <MenuItem
                icon={LogOut}
                label="Sign Out"
                variant="destructive"
              />
            </div>
          </section>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground animate-fade-in">
          CivicReport v1.0.0
        </p>
      </div>
    </MobileLayout>
  );
}
