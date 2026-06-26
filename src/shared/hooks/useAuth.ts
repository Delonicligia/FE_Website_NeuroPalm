import { useState, useEffect } from 'react';
import { isAuthenticated, login as serviceLogin, logout as serviceLogout } from '../../features/auth/services/authService';

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);

  const login = (username: string, password: string): boolean => {
    const success = serviceLogin(username, password);
    setIsAuth(success);
    return success;
  };

  const logout = () => {
    serviceLogout();
    setIsAuth(false);
  };

  return { isAuth, login, logout };
};
