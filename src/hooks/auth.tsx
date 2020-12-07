import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';
import { boolean } from 'yup';

interface AuthData {
  token: string;
  user: object;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: object;
  isLoading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData>({} as AuthData);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStoredData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);
      if (token[1] && user[1]) {
        setAuthData({ token: token[1], user: JSON.parse(user[1]) });
      }
      setIsLoading(false);
    }
    loadStoredData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', { email, password });

    const { token, userWithoutPassword: user } = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);

    setAuthData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);

    setAuthData({} as AuthData);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: authData.user, signIn, signOut, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
