import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Issue } from '../types';
import IssueCard from './IssueCard';

interface IssueListProps {
  issues: Issue[];
  onIssueClick: (issue: Issue) => void;
}

export default function IssueList({ issues, onIssueClick }: IssueListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['all', 'infrastructure', 'sanitation', 'safety', 'environment', 'utilities', 'transportation', 'other'];
  const statuses = ['all', 'open', 'in_progress', 'resolved', 'closed'];
  const priorities = ['all', 'low', 'medium', 'high', 'urgent'];

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || issue.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || issue.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || issue.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const hasActiveFilters = selectedCategory !== 'all' || selectedStatus !== 'all' || selectedPriority !== 'all';

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search issues by title, description, or location..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              showFilters || hasActiveFilters
                ? 'bg-primary text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
            {hasActiveFilters && <span className="bg-accent text-white px-2 py-0.5 rounded-full text-xs">Active</span>}
          </button>
        </div>

        {showFilters && (
          <div className="mt-6 pt-6 border-t border-neutral-200 animate-slideUp">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Statuses' : status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 text-sm text-primary hover:text-primary-700 font-semibold transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-neutral-700 font-medium">
          {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {filteredIssues.length === 0 ? (
        <div className="text-center py-16 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-neutral-700 mb-2">No issues found</h3>
          <p className="text-neutral-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onClick={() => onIssueClick(issue)} />
          ))}
        </div>
      )}
    </div>
  );
}
