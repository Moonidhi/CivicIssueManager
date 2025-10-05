import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AnimatedBackground from './components/AnimatedBackground';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Navbar from './components/Navbar';
import IssueList from './components/IssueList';
import IssueForm from './components/IssueForm';
import IssueDetail from './components/IssueDetail';
import AdminDashboard from './components/AdminDashboard';
import Analytics from './components/Analytics';
import NotificationPanel from './components/NotificationPanel';
import { Issue, Comment, Notification } from './types';
import { mockIssues, mockComments, mockNotifications } from './data/mockData';

function AppContent() {
  const { user } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState<'login' | 'register'>('login');
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'analytics'>('home');
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSubmitIssue = (issueData: Omit<Issue, 'id' | 'created_at' | 'updated_at'>) => {
    const newIssue: Issue = {
      ...issueData,
      id: String(issues.length + 1),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setIssues([newIssue, ...issues]);
    setShowIssueForm(false);
  };

  const handleAddComment = (issueId: string, content: string) => {
    if (!user) return;

    const newComment: Comment = {
      id: String(comments.length + 1),
      issue_id: issueId,
      user_id: user.id,
      user_name: user.full_name,
      content,
      is_official: user.role === 'admin',
      created_at: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
  };

  const handleUpdateStatus = (issueId: string, status: Issue['status']) => {
    setIssues(
      issues.map((issue) => {
        if (issue.id === issueId) {
          const updatedIssue = {
            ...issue,
            status,
            updated_at: new Date().toISOString(),
            resolved_at: status === 'resolved' ? new Date().toISOString() : issue.resolved_at,
          };

          if (user && issue.status !== status) {
            const newNotification: Notification = {
              id: String(notifications.length + 1),
              user_id: issue.user_id,
              issue_id: issueId,
              type: 'status_change',
              message: `Issue "${issue.title}" status changed from ${issue.status} to ${status}`,
              read: false,
              created_at: new Date().toISOString(),
            };
            setNotifications([newNotification, ...notifications]);
          }

          return updatedIssue;
        }
        return issue;
      })
    );
  };

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read && n.user_id === user?.id).length;
  const userNotifications = notifications.filter((n) => n.user_id === user?.id);

  if (!user) {
    return (
      <>
        <AnimatedBackground />
        <div className="min-h-screen flex items-center justify-center p-4">
          {showAuthForm === 'login' ? (
            <LoginForm onToggleForm={() => setShowAuthForm('register')} />
          ) : (
            <RegisterForm onToggleForm={() => setShowAuthForm('login')} />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen relative">
        <Navbar
          currentView={currentView}
          onViewChange={setCurrentView}
          onNewIssue={() => setShowIssueForm(true)}
          unreadNotifications={unreadCount}
          onNotificationsClick={() => setShowNotifications(true)}
        />

        <main className="container mx-auto px-4 py-8">
          {currentView === 'home' && (
            <>
              {showIssueForm ? (
                <IssueForm
                  onSubmit={handleSubmitIssue}
                  onCancel={() => setShowIssueForm(false)}
                />
              ) : (
                <IssueList issues={issues} onIssueClick={handleIssueClick} />
              )}
            </>
          )}

          {currentView === 'admin' && user.role === 'admin' && (
            <AdminDashboard issues={issues} onIssueClick={handleIssueClick} />
          )}

          {currentView === 'analytics' && <Analytics issues={issues} />}
        </main>

        {selectedIssue && (
          <IssueDetail
            issue={selectedIssue}
            comments={comments.filter((c) => c.issue_id === selectedIssue.id)}
            onClose={() => setSelectedIssue(null)}
            onAddComment={handleAddComment}
            onUpdateStatus={user.role === 'admin' ? handleUpdateStatus : undefined}
          />
        )}

        {showNotifications && (
          <NotificationPanel
            notifications={userNotifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClose={() => setShowNotifications(false)}
          />
        )}
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
