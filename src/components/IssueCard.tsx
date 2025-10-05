import { Clock, MapPin, User, AlertCircle } from 'lucide-react';
import { Issue } from '../types';

interface IssueCardProps {
  issue: Issue;
  onClick: () => void;
}

const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

const priorityColors = {
  low: 'bg-neutral-100 text-neutral-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

const categoryIcons = {
  infrastructure: '🏗️',
  sanitation: '🧹',
  safety: '🚨',
  environment: '🌳',
  utilities: '⚡',
  transportation: '🚌',
  other: '📋',
};

export default function IssueCard({ issue, onClick }: IssueCardProps) {
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
    <div
      onClick={onClick}
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden group animate-slideUp"
    >
      {issue.photo_urls.length > 0 && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={issue.photo_urls[0]}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-4 right-4 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[issue.status]}`}>
              {issue.status.replace('_', ' ')}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[issue.priority]}`}>
              {issue.priority}
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        {issue.photo_urls.length === 0 && (
          <div className="flex gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[issue.status]}`}>
              {issue.status.replace('_', ' ')}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[issue.priority]}`}>
              {issue.priority}
            </span>
          </div>
        )}

        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl">{categoryIcons[issue.category]}</span>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-primary-900 group-hover:text-primary-600 transition-colors line-clamp-2">
              {issue.title}
            </h3>
            <p className="text-sm text-neutral-600 mt-1 capitalize">
              {issue.category}
            </p>
          </div>
        </div>

        <p className="text-neutral-700 text-sm mb-4 line-clamp-2">
          {issue.description}
        </p>

        <div className="space-y-2 text-sm text-neutral-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="line-clamp-1">{issue.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <span>{issue.user_name}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>{timeAgo(issue.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
