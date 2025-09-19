'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthContextType, AuthProviderProps, LoginCredentials, RegisterCredentials, AuthResponse, User } from '../../types';
import AuthService from '../../utils/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  baseUrl = typeof window !== 'undefined' ? window.location.origin : '' 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [riskLevel, setRiskLevel] = useState<string | null>(null);
  
  const authService = new AuthService(baseUrl);

  const isAuthenticated = !!user && !!accessToken;

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to refresh token to get current user state
        const response = await authService.refreshToken();
        if (response.success && response.accessToken) {
          setAccessToken(response.accessToken);
          setCurrentSessionId(response.sessionId || null);
          setRiskScore(response.riskScore || null);
          setRiskLevel(response.riskLevel || null);
          // Note: We don't get user data from refresh, so we'll need to call /me endpoint
          // For now, we'll set a placeholder user
          setUser({ id: '', email: '', password: '' });
        }
      } catch (error) {
        console.log('No valid session found');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [authService, baseUrl]);

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!accessToken) return;

    const refreshInterval = setInterval(async () => {
      try {
        const response = await authService.refreshToken(currentSessionId || undefined);
        if (response.success && response.accessToken) {
          setAccessToken(response.accessToken);
          setCurrentSessionId(response.sessionId || null);
          setRiskScore(response.riskScore || null);
          setRiskLevel(response.riskLevel || null);
        } else {
          // Token refresh failed, logout user
          setUser(null);
          setAccessToken(null);
          setCurrentSessionId(null);
          setRiskScore(null);
          setRiskLevel(null);
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        setUser(null);
        setAccessToken(null);
        setCurrentSessionId(null);
        setRiskScore(null);
        setRiskLevel(null);
      }
    }, 9 * 60 * 1000); // Refresh every 9 minutes (token expires in 10 minutes)

    return () => clearInterval(refreshInterval);
  }, [accessToken, authService, currentSessionId]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.success && response.accessToken && response.user) {
        setUser(response.user);
        setAccessToken(response.accessToken);
        setCurrentSessionId(response.sessionId || null);
        setRiskScore(response.riskScore || null);
        setRiskLevel(response.riskLevel || null);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.register(credentials);
      if (response.success && response.accessToken && response.user) {
        setUser(response.user);
        setAccessToken(response.accessToken);
        setCurrentSessionId(response.sessionId || null);
        setRiskScore(response.riskScore || null);
        setRiskLevel(response.riskLevel || null);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  const logout = useCallback(async (): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.logout();
      setUser(null);
      setAccessToken(null);
      setCurrentSessionId(null);
      setRiskScore(null);
      setRiskLevel(null);
      return response;
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  const refreshToken = useCallback(async (previousSessionId?: string): Promise<AuthResponse> => {
    try {
      const response = await authService.refreshToken(previousSessionId);
      if (response.success && response.accessToken) {
        setAccessToken(response.accessToken);
        setCurrentSessionId(response.sessionId || null);
        setRiskScore(response.riskScore || null);
        setRiskLevel(response.riskLevel || null);
      } else {
        setUser(null);
        setAccessToken(null);
        setCurrentSessionId(null);
        setRiskScore(null);
        setRiskLevel(null);
      }
      return response;
    } catch (error) {
      setUser(null);
      setAccessToken(null);
      setCurrentSessionId(null);
      setRiskScore(null);
      setRiskLevel(null);
      return {
        success: false,
        status: 500,
        message: 'Token refresh failed',
        error: error as Error,
      };
    }
  }, [authService]);

  const getDeviceFingerprint = useCallback(async () => {
    return await authService.getDeviceFingerprint();
  }, [authService]);

  const getBrowserCapabilities = useCallback(() => {
    return authService.getBrowserCapabilities();
  }, [authService]);

  const value: AuthContextType = {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    currentSessionId,
    riskScore,
    riskLevel,
    login,
    register,
    logout,
    refreshToken,
    getDeviceFingerprint,
    getBrowserCapabilities,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
