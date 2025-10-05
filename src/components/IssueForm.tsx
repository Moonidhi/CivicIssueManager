import { useState } from 'react';
import { Send, Upload, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Issue } from '../types';

interface IssueFormProps {
  onSubmit: (issue: Omit<Issue, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const categories = [
  'infrastructure',
  'sanitation',
  'safety',
  'environment',
  'utilities',
  'transportation',
  'other',
];

const priorities = ['low', 'medium', 'high', 'urgent'];

export default function IssueForm({ onSubmit, onCancel }: IssueFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Issue['category']>('infrastructure');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<Issue['priority']>('medium');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [photoInput, setPhotoInput] = useState('');

  const handleAddPhoto = () => {
    if (photoInput.trim() && photoUrls.length < 5) {
      setPhotoUrls([...photoUrls, photoInput.trim()]);
      setPhotoInput('');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotoUrls(photoUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    onSubmit({
      user_id: user.id,
      user_name: user.full_name,
      title,
      description,
      category,
      location,
      status: 'open',
      priority,
      photo_urls: photoUrls,
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 animate-scaleIn">
      <h2 className="text-2xl font-bold text-primary-800 mb-6">Report New Issue</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Issue Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            placeholder="Brief description of the issue"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
            placeholder="Provide detailed information about the issue"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Issue['category'])}
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Issue['priority'])}
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            >
              {priorities.map((pri) => (
                <option key={pri} value={pri}>
                  {pri.charAt(0).toUpperCase() + pri.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            placeholder="Street address or landmark"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Photos (optional)
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={photoInput}
              onChange={(e) => setPhotoInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              placeholder="Photo URL from Pexels or other source"
            />
            <button
              type="button"
              onClick={handleAddPhoto}
              className="px-6 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg transition-all"
            >
              <Upload className="w-5 h-5" />
            </button>
          </div>

          {photoUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {photoUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border-2 border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-primary hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Submit Issue
          </button>
        </div>
      </form>
    </div>
  );
}
