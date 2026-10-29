import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  getCurrentUser,
} from '../services/api';
import {
  clearAccessToken,
  getAccessToken,
} from '../services/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // initial session check

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const token = await getAccessToken();
        if (!token) return;

        const currentUser = await getCurrentUser();
        if (!cancelled) setUser(currentUser);
      } catch (error) {
        if (error.status === 401) {
          await clearAccessToken().catch(() => { });
        }
      } finally {
        if (__DEV__) {
          await new Promise(resolve => setTimeout(resolve, 30000));
        }

        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();
    return () => { cancelled = true; };
  }, []);

  async function login({ email, password }) {
    const authenticatedUser = await apiLogin({ email, password });
    setUser(authenticatedUser);
    return authenticatedUser;
  }

  async function register({ name, email, password }) {
    const authenticatedUser = await apiRegister({ name, email, password });
    setUser(authenticatedUser);
    return authenticatedUser;
  }

  async function logout() {
    await clearAccessToken();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
