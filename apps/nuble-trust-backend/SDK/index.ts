// Core Types
export * from './types';

// Core Services
export { default as AuthService } from './utils/auth';
export { ApiClient } from './utils/api';
export { TokenUtils } from './utils/token';

// React Framework
export { AuthProvider, useAuth } from './src/frameworks/AuthProvider';

// Re-export commonly used types for convenience
export type {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  AuthContextType,
  AuthProviderProps,
  TokenPayload,
  ApiConfig,
} from './types';
