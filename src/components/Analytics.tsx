import { Issue } from '../types';
import { BarChart3, PieChart, TrendingUp, MapPin } from 'lucide-react';

interface AnalyticsProps {
  issues: Issue[];
}

export default function Analytics({ issues }: AnalyticsProps) {
  const categoryCount = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const locationCount = issues.reduce((acc, issue) => {
    const location = issue.location.split(',')[0].trim();
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusCount = issues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyData = issues.reduce((acc, issue) => {
    const month = new Date(issue.created_at).toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { open: 0, resolved: 0 };
    }
    if (issue.status === 'resolved' || issue.status === 'closed') {
      acc[month].resolved++;
    } else {
      acc[month].open++;
    }
    return acc;
  }, {} as Record<string, { open: number; resolved: number }>);

  const maxValue = Math.max(...Object.values(categoryCount));
  const maxLocationValue = Math.max(...Object.values(locationCount));
  const topLocations = Object.entries(locationCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const categoryColors: Record<string, string> = {
    infrastructure: 'bg-blue-500',
    sanitation: 'bg-green-500',
    safety: 'bg-red-500',
    environment: 'bg-emerald-500',
    utilities: 'bg-yellow-500',
    transportation: 'bg-purple-500',
    other: 'bg-gray-500',
  };

  const statusColors: Record<string, string> = {
    open: 'bg-blue-500',
    in_progress: 'bg-yellow-500',
    resolved: 'bg-green-500',
    closed: 'bg-gray-500',
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-primary-900">Analytics Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Total Issues</p>
            <p className="text-4xl font-bold">{issues.length}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Resolved</p>
            <p className="text-4xl font-bold">{statusCount.resolved || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
            <p className="text-sm opacity-90 mb-2">In Progress</p>
            <p className="text-4xl font-bold">{statusCount.in_progress || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Open</p>
            <p className="text-4xl font-bold">{statusCount.open || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-primary-900">Issues by Category</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(categoryCount)
              .sort(([, a], [, b]) => b - a)
              .map(([category, count]) => {
                const percentage = (count / issues.length) * 100;
                const width = (count / maxValue) * 100;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize text-neutral-800">{category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-600">{count} issues</span>
                        <span className="text-sm font-semibold text-primary">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="relative w-full bg-neutral-200 rounded-full h-8 overflow-hidden">
                      <div
                        className={`${categoryColors[category]} h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3`}
                        style={{ width: `${width}%` }}
                      >
                        {width > 15 && (
                          <span className="text-white text-sm font-semibold">{count}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-primary-900">Top 5 Locations</h3>
          </div>
          <div className="space-y-4">
            {topLocations.map(([location, count], index) => {
              const percentage = (count / issues.length) * 100;
              const width = (count / maxLocationValue) * 100;
              return (
                <div key={location} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium text-neutral-800 line-clamp-1">{location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-600">{count}</span>
                      <span className="text-sm font-semibold text-primary">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="relative w-full bg-neutral-200 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-highlight-400 to-highlight-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                      style={{ width: `${width}%` }}
                    >
                      {width > 15 && (
                        <span className="text-white text-sm font-semibold">{count}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-primary-900">Resolution Rate by Status</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(statusCount)
            .sort(([, a], [, b]) => b - a)
            .map(([status, count]) => {
              const percentage = (count / issues.length) * 100;
              return (
                <div key={status} className="text-center">
                  <div className="relative inline-flex items-center justify-center mb-3">
                    <svg className="transform -rotate-90 w-24 h-24">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-neutral-200"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                        className={statusColors[status].replace('bg-', 'text-')}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-xl font-bold text-neutral-900">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <p className="font-medium text-neutral-900 capitalize mb-1">
                    {status.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-neutral-600">{count} issues</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
