import { Issue } from '../types';
import { TrendingUp, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';

interface AdminDashboardProps {
  issues: Issue[];
  onIssueClick: (issue: Issue) => void;
}

export default function AdminDashboard({ issues, onIssueClick }: AdminDashboardProps) {
  const stats = {
    total: issues.length,
    open: issues.filter((i) => i.status === 'open').length,
    inProgress: issues.filter((i) => i.status === 'in_progress').length,
    resolved: issues.filter((i) => i.status === 'resolved').length,
    closed: issues.filter((i) => i.status === 'closed').length,
  };

  const urgentIssues = issues.filter((i) => i.priority === 'urgent' && i.status !== 'resolved' && i.status !== 'closed');
  const recentIssues = [...issues].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  const categoryCount = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusColors = {
    open: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-primary-900 mb-6">Admin Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{stats.total}</span>
            </div>
            <p className="text-sm opacity-90">Total Issues</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{stats.open}</span>
            </div>
            <p className="text-sm opacity-90">Open</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{stats.inProgress}</span>
            </div>
            <p className="text-sm opacity-90">In Progress</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{stats.resolved}</span>
            </div>
            <p className="text-sm opacity-90">Resolved</p>
          </div>

          <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{stats.closed}</span>
            </div>
            <p className="text-sm opacity-90">Closed</p>
          </div>
        </div>
      </div>

      {urgentIssues.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            Urgent Issues Requiring Attention
          </h3>
          <div className="space-y-3">
            {urgentIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => onIssueClick(issue)}
                className="bg-white p-4 rounded-lg hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-neutral-900">{issue.title}</h4>
                    <p className="text-sm text-neutral-600 mt-1">{issue.location}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[issue.status]} whitespace-nowrap`}>
                    {issue.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-primary-900 mb-4">Issues by Category</h3>
          <div className="space-y-3">
            {Object.entries(categoryCount)
              .sort(([, a], [, b]) => b - a)
              .map(([category, count]) => {
                const percentage = (count / stats.total) * 100;
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium capitalize">{category}</span>
                      <span className="text-neutral-600">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-primary-900 mb-4">Recent Issues</h3>
          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => onIssueClick(issue)}
                className="p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-neutral-900 text-sm line-clamp-1">{issue.title}</h4>
                    <p className="text-xs text-neutral-600 mt-1">{issue.location}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[issue.status]} whitespace-nowrap`}>
                    {issue.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
