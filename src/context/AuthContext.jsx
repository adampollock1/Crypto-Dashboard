import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'cryptovue_user';
const USERS_DB_KEY = 'cryptovue_users_db';

// Generate a simple UUID
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Simple password hashing (for demo purposes - not secure for production)
const hashPassword = (password) => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

const createDefaultUser = (email, name, password) => ({
  id: generateId(),
  email,
  name,
  password: hashPassword(password),
  avatar: null,
  bio: '',
  createdAt: new Date().toISOString(),
  preferences: {
    currency: 'USD',
    theme: 'dark',
    notifications: {
      priceAlerts: true,
      news: false,
      email: true,
    },
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: new Date().toISOString(),
  },
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        // Remove password from stored user for security
        const { password, ...safeUser } = parsed;
        setUser(safeUser);
      }
    } catch (err) {
      console.error('Failed to load user from localStorage:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get all users from "database"
  const getUsersDb = useCallback(() => {
    try {
      const stored = localStorage.getItem(USERS_DB_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  // Save users to "database"
  const saveUsersDb = useCallback((users) => {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  }, []);

  // Register a new user
  const register = useCallback(
    async (email, name, password) => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const users = getUsersDb();

      // Check if email already exists
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('An account with this email already exists');
      }

      // Create new user
      const newUser = createDefaultUser(email, name, password);
      users.push(newUser);
      saveUsersDb(users);

      // Log in the user (without password in state)
      const { password: _, ...safeUser } = newUser;
      setUser(safeUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));

      return safeUser;
    },
    [getUsersDb, saveUsersDb]
  );

  // Login
  const login = useCallback(
    async (email, password) => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const users = getUsersDb();
      const foundUser = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === hashPassword(password)
      );

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // Log in the user (without password in state)
      const { password: _, ...safeUser } = foundUser;
      setUser(safeUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(foundUser));

      return safeUser;
    },
    [getUsersDb]
  );

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  // Update profile
  const updateProfile = useCallback(
    async (updates) => {
      if (!user) throw new Error('Not authenticated');

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const users = getUsersDb();
      const userIndex = users.findIndex((u) => u.id === user.id);

      if (userIndex === -1) throw new Error('User not found');

      // Update user in database
      const updatedUser = {
        ...users[userIndex],
        ...updates,
        preferences: {
          ...users[userIndex].preferences,
          ...(updates.preferences || {}),
          notifications: {
            ...users[userIndex].preferences?.notifications,
            ...(updates.preferences?.notifications || {}),
          },
        },
      };

      users[userIndex] = updatedUser;
      saveUsersDb(users);

      // Update state (without password)
      const { password: _, ...safeUser } = updatedUser;
      setUser(safeUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));

      return safeUser;
    },
    [user, getUsersDb, saveUsersDb]
  );

  // Update password
  const updatePassword = useCallback(
    async (currentPassword, newPassword) => {
      if (!user) throw new Error('Not authenticated');

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const users = getUsersDb();
      const userIndex = users.findIndex((u) => u.id === user.id);

      if (userIndex === -1) throw new Error('User not found');

      // Verify current password
      if (users[userIndex].password !== hashPassword(currentPassword)) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      users[userIndex].password = hashPassword(newPassword);
      users[userIndex].security.lastPasswordChange = new Date().toISOString();

      saveUsersDb(users);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users[userIndex]));

      // Update state
      const { password: _, ...safeUser } = users[userIndex];
      setUser(safeUser);

      return safeUser;
    },
    [user, getUsersDb, saveUsersDb]
  );

  // Toggle two-factor authentication
  const toggleTwoFactor = useCallback(
    async (enabled) => {
      if (!user) throw new Error('Not authenticated');

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const users = getUsersDb();
      const userIndex = users.findIndex((u) => u.id === user.id);

      if (userIndex === -1) throw new Error('User not found');

      users[userIndex].security.twoFactorEnabled = enabled;

      saveUsersDb(users);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users[userIndex]));

      // Update state
      const { password: _, ...safeUser } = users[userIndex];
      setUser(safeUser);

      return safeUser;
    },
    [user, getUsersDb, saveUsersDb]
  );

  // Delete account
  const deleteAccount = useCallback(
    async (password) => {
      if (!user) throw new Error('Not authenticated');

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const users = getUsersDb();
      const userIndex = users.findIndex((u) => u.id === user.id);

      if (userIndex === -1) throw new Error('User not found');

      // Verify password
      if (users[userIndex].password !== hashPassword(password)) {
        throw new Error('Password is incorrect');
      }

      // Remove user from database
      users.splice(userIndex, 1);
      saveUsersDb(users);

      // Clear user-specific data
      localStorage.removeItem(`cryptovue_portfolio_${user.id}`);
      localStorage.removeItem(`cryptovue_watchlist_${user.id}`);

      // Logout
      logout();
    },
    [user, getUsersDb, saveUsersDb, logout]
  );

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    toggleTwoFactor,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
