import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'pharmacist' | 'staff';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('pharmacy_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('pharmacy_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    try {
      // Simulate API call - in production, this would validate against a backend
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      // Mock user creation
      const mockUser: User = {
        id: `user_${Date.now()}`,
        username,
        email: `${username}@pharmacy.local`,
        role: 'admin',
      };

      setUser(mockUser);
      
      if (rememberMe) {
        localStorage.setItem('pharmacy_user', JSON.stringify(mockUser));
      } else {
        sessionStorage.setItem('pharmacy_user', JSON.stringify(mockUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pharmacy_user');
    sessionStorage.removeItem('pharmacy_user');
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!username || !email || !password) {
        throw new Error('All fields are required');
      }

      const mockUser: User = {
        id: `user_${Date.now()}`,
        username,
        email,
        role: 'pharmacist',
      };

      setUser(mockUser);
      localStorage.setItem('pharmacy_user', JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
