import { useState } from 'react';
import { X, MapPin, Clock, User, MessageCircle, Send, AlertCircle } from 'lucide-react';
import { Issue, Comment } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface IssueDetailProps {
  issue: Issue;
  comments: Comment[];
  onClose: () => void;
  onAddComment: (issueId: string, content: string) => void;
  onUpdateStatus?: (issueId: string, status: Issue['status']) => void;
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

export default function IssueDetail({ issue, comments, onClose, onAddComment, onUpdateStatus }: IssueDetailProps) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(issue.id, commentText.trim());
      setCommentText('');
    }
  };

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn">
        <div className="relative p-6 border-b border-neutral-200">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-neutral-600" />
          </button>

          <div className="flex items-start gap-4 pr-12">
            <div className="flex-1">
              <div className="flex gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[issue.status]}`}>
                  {issue.status.replace('_', ' ')}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[issue.priority]}`}>
                  {issue.priority}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800 capitalize">
                  {issue.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-primary-900">{issue.title}</h2>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {issue.photo_urls.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {issue.photo_urls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Issue photo ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              ))}
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Description</h3>
            <p className="text-neutral-700 leading-relaxed">{issue.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-neutral-500 font-medium">Location</p>
                <p className="text-sm text-neutral-900">{issue.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-neutral-500 font-medium">Reported by</p>
                <p className="text-sm text-neutral-900">{issue.user_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-neutral-500 font-medium">Reported</p>
                <p className="text-sm text-neutral-900">{timeAgo(issue.created_at)}</p>
              </div>
            </div>

            {issue.resolved_at && (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-green-600 font-medium">Resolved</p>
                  <p className="text-sm text-green-900">{timeAgo(issue.resolved_at)}</p>
                </div>
              </div>
            )}
          </div>

          {user?.role === 'admin' && onUpdateStatus && (
            <div className="p-4 bg-accent-50 rounded-lg border border-accent-200">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Update Status (Admin)</label>
              <select
                value={issue.status}
                onChange={(e) => onUpdateStatus(issue.id, e.target.value as Issue['status'])}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Comments ({comments.length})
            </h3>

            <div className="space-y-4 mb-6">
              {comments.length === 0 ? (
                <p className="text-neutral-500 text-center py-8">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-4 rounded-lg ${
                      comment.is_official ? 'bg-accent-50 border border-accent-200' : 'bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-neutral-900">{comment.user_name}</span>
                      {comment.is_official && (
                        <span className="px-2 py-0.5 bg-accent text-white text-xs font-semibold rounded-full">
                          Official
                        </span>
                      )}
                      <span className="text-xs text-neutral-500 ml-auto">{timeAgo(comment.created_at)}</span>
                    </div>
                    <p className="text-neutral-700">{comment.content}</p>
                  </div>
                ))
              )}
            </div>

            {user && (
              <form onSubmit={handleSubmitComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-6 py-3 bg-primary hover:bg-primary-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
