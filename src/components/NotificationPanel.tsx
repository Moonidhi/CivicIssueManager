import { Bell, X, Check } from 'lucide-react';
import { Notification } from '../types';

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

const typeIcons = {
  status_change: '🔄',
  new_comment: '💬',
  resolved: '✅',
  assigned: '📌',
};

export default function NotificationPanel({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}: NotificationPanelProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    return 'just now';
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col animate-slideUp">
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-primary-900">Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        {unreadCount > 0 && (
          <div className="flex items-center justify-between bg-primary-50 rounded-lg p-3">
            <span className="text-sm text-primary-800 font-medium">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </span>
            <button
              onClick={onMarkAllAsRead}
              className="text-sm text-primary-600 hover:text-primary-800 font-semibold transition-colors"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">No notifications</h3>
            <p className="text-sm text-neutral-500">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-neutral-50 transition-colors ${
                  !notification.read ? 'bg-primary-50/50' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className="text-2xl">{typeIcons[notification.type]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-900 mb-1">{notification.message}</p>
                    <p className="text-xs text-neutral-500">{timeAgo(notification.created_at)}</p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => onMarkAsRead(notification.id)}
                      className="p-2 hover:bg-primary-100 rounded-full transition-colors flex-shrink-0"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4 text-primary" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
