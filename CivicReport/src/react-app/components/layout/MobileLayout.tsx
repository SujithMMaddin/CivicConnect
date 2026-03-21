import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Home, FileText, PlusCircle, User } from 'lucide-react';
import { cn } from '@/react-app/lib/utils';

interface MobileLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/issues', icon: FileText, label: 'Issues' },
  { path: '/report', icon: PlusCircle, label: 'Report' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function MobileLayout({ children, hideNav = false }: MobileLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      {/* Main content area */}
      <main className={cn(
        "flex-1 overflow-y-auto",
        !hideNav && "pb-20"
      )}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border shadow-lg z-50">
          <div className="flex items-center justify-around h-16 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              const isReport = item.path === '/report';
              
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200",
                    isActive && !isReport && "text-primary bg-primary/10",
                    !isActive && !isReport && "text-muted-foreground hover:text-foreground hover:bg-secondary",
                    isReport && "relative"
                  )}
                >
                  {isReport ? (
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="bg-primary text-primary-foreground p-2.5 rounded-full shadow-md -mt-4">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-medium text-primary">
                        {item.label}
                      </span>
                    </div>
                  ) : (
                    <>
                      <Icon className={cn(
                        "h-5 w-5 transition-transform duration-200",
                        isActive && "scale-110"
                      )} />
                      <span className={cn(
                        "text-[10px] font-medium",
                        isActive && "font-semibold"
                      )}>
                        {item.label}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
