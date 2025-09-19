import { ApiConfig } from '../types';

export class ApiClient {
  private baseUrl: string;
  private apiKey: string;
  private accessToken: string | null = null;

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const url = `${this.baseUrl}/api/${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
  }

  async get(endpoint: string, options: RequestInit = {}): Promise<Response> {
    return this.makeRequest(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  async post(endpoint: string, data?: any, options: RequestInit = {}): Promise<Response> {
    return this.makeRequest(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(endpoint: string, data?: any, options: RequestInit = {}): Promise<Response> {
    return this.makeRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(endpoint: string, options: RequestInit = {}): Promise<Response> {
    return this.makeRequest(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}
