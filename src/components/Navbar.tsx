import { Bell, LogOut, Plus, BarChart3, Home, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  currentView: 'home' | 'admin' | 'analytics';
  onViewChange: (view: 'home' | 'admin' | 'analytics') => void;
  onNewIssue: () => void;
  unreadNotifications: number;
  onNotificationsClick: () => void;
}

export default function Navbar({
  currentView,
  onViewChange,
  onNewIssue,
  unreadNotifications,
  onNotificationsClick,
}: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-900">Civic Issue Manager</h1>
                <p className="text-xs text-neutral-600">Building Better Communities</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => onViewChange('home')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  currentView === 'home'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Home className="w-4 h-4" />
                Issues
              </button>

              {user?.role === 'admin' && (
                <button
                  onClick={() => onViewChange('admin')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    currentView === 'admin'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </button>
              )}

              <button
                onClick={() => onViewChange('analytics')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  currentView === 'analytics'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === 'citizen' && (
              <button
                onClick={onNewIssue}
                className="bg-highlight hover:bg-highlight-600 text-white font-semibold px-4 py-2 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden md:inline">Report Issue</span>
              </button>
            )}

            <button
              onClick={onNotificationsClick}
              className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6 text-neutral-700" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadNotifications}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-neutral-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-neutral-900">{user?.full_name}</p>
                <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-2 mt-4">
          <button
            onClick={() => onViewChange('home')}
            className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm ${
              currentView === 'home'
                ? 'bg-primary text-white shadow-md'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Home className="w-4 h-4" />
            Issues
          </button>

          {user?.role === 'admin' && (
            <button
              onClick={() => onViewChange('admin')}
              className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm ${
                currentView === 'admin'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin
            </button>
          )}

          <button
            onClick={() => onViewChange('analytics')}
            className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm ${
              currentView === 'analytics'
                ? 'bg-primary text-white shadow-md'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
        </div>
      </div>
    </nav>
  );
}
