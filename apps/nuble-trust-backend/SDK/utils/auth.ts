import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

class AuthService {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {},
    apiKey?: string
  ): Promise<AuthResponse> {
    const url = `${this.baseUrl}/api/auth/${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: 'Network error',
        error: error as Error,
      };
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.makeRequest('login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    }, credentials.apiKey);
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return this.makeRequest('register', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    }, credentials.apiKey);
  }

  async logout(): Promise<AuthResponse> {
    return this.makeRequest('logout', {
      method: 'POST',
    });
  }

  async refreshToken(): Promise<AuthResponse> {
    return this.makeRequest('refresh', {
      method: 'POST',
    });
  }
}

export default AuthService;
