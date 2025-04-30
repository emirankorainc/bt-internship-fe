import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

interface AuthContextType {
  token: string | null;
  setToken: (newToken: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:3000';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
