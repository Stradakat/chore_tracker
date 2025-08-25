import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { initialAdminUser } from '../data/initialData';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  clearAllData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    console.log('🔐 AuthProvider: Checking for existing session...');
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        console.log('🔐 AuthProvider: Found saved user:', user.username);
        
        // Validate user data structure
        if (user && user.id && user.username && user.role) {
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          console.log('🔐 AuthProvider: User authenticated successfully');
        } else {
          console.warn('🔐 AuthProvider: Invalid user data structure, clearing corrupted data');
          localStorage.removeItem('currentUser');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('🔐 AuthProvider: Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      console.log('🔐 AuthProvider: No saved user found');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 AuthProvider: Attempting login for:', username);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simple admin authentication (in production, this would be a real API call)
      if (username === 'admin' && password === 'admin123') {
        const user = {
          ...initialAdminUser,
          lastLogin: new Date(),
        };

        console.log('🔐 AuthProvider: Login successful, saving user to localStorage');
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });

        console.log('🔐 AuthProvider: User state updated, authentication complete');
        return true;
      }

      console.log('🔐 AuthProvider: Login failed - invalid credentials');
      return false;
    } catch (error) {
      console.error('🔐 AuthProvider: Login error:', error);
      return false;
    }
  };

  const logout = () => {
    try {
      console.log('🔐 AuthProvider: Logging out user:', authState.user?.username);
      
      // Clear user data
      localStorage.removeItem('currentUser');
      
      // Reset auth state
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      console.log('🔐 AuthProvider: User logged out successfully');
    } catch (error) {
      console.error('🔐 AuthProvider: Logout error:', error);
      // Force reset even if there's an error
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const updateUser = (updates: Partial<User>) => {
    try {
      if (authState.user) {
        const updatedUser = { ...authState.user, ...updates };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
        }));
        console.log('🔐 AuthProvider: User updated successfully');
      }
    } catch (error) {
      console.error('🔐 AuthProvider: Error updating user:', error);
    }
  };

  const clearAllData = () => {
    try {
      console.log('🔐 AuthProvider: Clearing all app data...');
      
      // Clear all app data from localStorage
      localStorage.removeItem('currentUser');
      localStorage.removeItem('chores');
      localStorage.removeItem('householdMembers');
      localStorage.removeItem('completions');
      
      // Reset auth state
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      console.log('🔐 AuthProvider: All app data cleared successfully');
    } catch (error) {
      console.error('🔐 AuthProvider: Error clearing data:', error);
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    updateUser,
    clearAllData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
