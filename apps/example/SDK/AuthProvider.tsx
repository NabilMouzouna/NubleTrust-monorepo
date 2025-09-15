"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode, useMemo } from "react";
import AuthClient from "./authClient";
import { AuthConfig, AuthState } from "./types";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ config, children }: { config: AuthConfig; children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Memoize client so it's not re-created on each render
  const client = useMemo(() => new AuthClient(config), [config]);

  const updateState = useCallback((partial: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      try {
        updateState({ isLoading: true });
        const isAuthenticated = await client.isAuthenticated();
        updateState({
          user: client.getUser(),
          accessToken: isAuthenticated ? client.getAccessToken() : null,
          isAuthenticated,
          isLoading: false,
        });
      } catch (error) {
        updateState({ isLoading: false, error: "Init failed: " + (error as Error).message });
      }
    };
    init();
  }, [client, updateState]);

  const checkAuth = useCallback(async () => {
    const valid = await client.isAuthenticated();
    updateState({
      user: client.getUser(),
      accessToken: valid ? client.getAccessToken() : null,
      isAuthenticated: valid,
    });
    return valid;
  }, [client, updateState]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        updateState({ isLoading: true, error: null });
        await client.login(email, password);
        await checkAuth();
      } catch (error) {
        updateState({ error: (error as Error).message });
        throw error;
      } finally {
        updateState({ isLoading: false });
      }
    },
    [client, checkAuth, updateState]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      try {
        updateState({ isLoading: true, error: null });
        await client.register(email, password);
        await checkAuth();
      } catch (error) {
        updateState({ error: (error as Error).message });
        throw error;
      } finally {
        updateState({ isLoading: false });
      }
    },
    [client, checkAuth, updateState]
  );

  const logout = useCallback(
    async () => {
      try {
        updateState({ isLoading: true });
        await client.logout();
        updateState({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      } catch (error) {
        updateState({ error: (error as Error).message });
        throw error;
      } finally {
        updateState({ isLoading: false });
      }
    },
    [client, updateState]
  );

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error 
    <AuthContext.Provider value={{ ...state, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};