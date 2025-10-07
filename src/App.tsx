import { useState, useEffect } from 'react';
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
import { db } from './firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

function AppContent() {
  const { user } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState<'login' | 'register'>('login');
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'analytics'>('home');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch issues from Firestore
  useEffect(() => {
    const fetchIssues = async () => {
      const issuesCollection = collection(db, 'issues');
      const snapshot = await getDocs(query(issuesCollection, orderBy('created_at', 'desc')));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Issue[];
      setIssues(data);
    };

    const fetchComments = async () => {
      const commentsCollection = collection(db, 'comments');
      const snapshot = await getDocs(query(commentsCollection, orderBy('created_at', 'asc')));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Comment[];
      setComments(data);
    };

    const fetchNotifications = async () => {
      const notificationsCollection = collection(db, 'notifications');
      const snapshot = await getDocs(query(notificationsCollection, orderBy('created_at', 'desc')));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Notification[];
      setNotifications(data);
    };

    fetchIssues();
    fetchComments();
    fetchNotifications();
  }, []);

  const handleSubmitIssue = async (issueData: Omit<Issue, 'id' | 'created_at' | 'updated_at'>) => {
    const newIssue = {
      ...issueData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, 'issues'), newIssue);
      setIssues([{ id: docRef.id, ...newIssue }, ...issues]);
      setShowIssueForm(false);
    } catch (error) {
      console.error("Error adding issue:", error);
    }
  };

  const handleAddComment = async (issueId: string, content: string) => {
    if (!user) return;

    const newComment = {
      issue_id: issueId,
      user_id: user.id,
      user_name: user.full_name,
      content,
      is_official: user.role === 'admin',
      created_at: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, 'comments'), newComment);
      setComments([...comments, { id: docRef.id, ...newComment }]);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleUpdateStatus = async (issueId: string, status: Issue['status']) => {
    const issueRef = doc(db, 'issues', issueId);

    try {
      await updateDoc(issueRef, {
        status,
        updated_at: new Date().toISOString(),
        resolved_at: status === 'resolved' ? new Date().toISOString() : null,
      });

      setIssues(
        issues.map(issue =>
          issue.id === issueId ? { ...issue, status, updated_at: new Date().toISOString() } : issue
        )
      );

      const changedIssue = issues.find(i => i.id === issueId);
      if (user && changedIssue && changedIssue.status !== status) {
        const newNotification = {
          user_id: changedIssue.user_id,
          issue_id: issueId,
          type: 'status_change' as const,
          message: `Issue "${changedIssue.title}" status changed from ${changedIssue.status} to ${status}`,
          read: false,
          created_at: new Date().toISOString(),
        };
        const docRef = await addDoc(collection(db, 'notifications'), newNotification);
        setNotifications([ { id: docRef.id, ...newNotification }, ...notifications ]);
      }

    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleIssueClick = (issue: Issue) => setSelectedIssue(issue);

  const handleMarkAsRead = async (id: string) => {
    try {
      const notifRef = doc(db, 'notifications', id);
      await updateDoc(notifRef, { read: true });
      setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.read && n.user_id === user?.id);
      await Promise.all(unread.map(n => updateDoc(doc(db, 'notifications', n.id), { read: true })));
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read && n.user_id === user?.id).length;
  const userNotifications = notifications.filter(n => n.user_id === user?.id);

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
            comments={comments.filter(c => c.issue_id === selectedIssue.id)}
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
