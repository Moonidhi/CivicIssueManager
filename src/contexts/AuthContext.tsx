import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@civic.com',
    full_name: 'Admin User',
    role: 'admin',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'citizen@civic.com',
    full_name: 'John Citizen',
    role: 'citizen',
    created_at: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('civic_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundUser = mockUsers.find(u => u.email === email);
    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    setUser(foundUser);
    localStorage.setItem('civic_user', JSON.stringify(foundUser));
  };

  const register = async (email: string, password: string, fullName: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (mockUsers.some(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: String(mockUsers.length + 1),
      email,
      full_name: fullName,
      role: 'citizen',
      created_at: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('civic_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('civic_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
