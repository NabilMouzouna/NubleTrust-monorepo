export interface User {
  id: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  status: number;
  message: string;
  accessToken?: string;
  user?: User;
  error?: Error;
}

export interface LoginCredentials {
  email: string;
  password: string;
  apiKey: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  apiKey: string;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => Promise<AuthResponse>;
  refreshToken: () => Promise<AuthResponse>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
  baseUrl?: string;
}

export interface TokenPayload {
  userId: string;
  appId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
}
