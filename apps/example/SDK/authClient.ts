// sdk/core/AuthClient.ts

import { AuthConfig, User } from './types';

class AuthClient {
  private config: AuthConfig;
  private currentUser: User | null = null;
  private accessToken : string | null = null;
  constructor(config: AuthConfig) {
    this.config = config;
  }

  async login(email: string, password: string): Promise<User> {
    const res = await fetch(`${this.config.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': this.config.apiKey },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    const data = await res.json();
    console.log(`authClient login l21 :`,data)
    this.currentUser = data.user;
    this.accessToken = data.accessToken
    return data.user;
  }
  async register(email: string, password: string): Promise<User> {
    const res = await fetch(`${this.config.baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': this.config.apiKey },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.data || 'An error occurred during registration.');
    this.accessToken = data.accessToken
    console.log(`authClient register l33 :`,data)
    this.currentUser = data.user;
    return data.user;
  }

  getSession =()=> this.accessToken

  async isAuthenticated(): Promise<boolean> {
    try {
      const res = await fetch(`${this.config.baseUrl}/me`, {
        headers: { 'X-API-Key': this.config.apiKey },
        credentials: 'include',
      });
      if (!res.ok) {
        this.currentUser = null;
        return false;
      }
      const user = await res.json();
      this.currentUser = user;
      return true;
    } catch {
      this.currentUser = null;
      return false;
    }
  }

  async logout(): Promise<void> {
    await fetch(`${this.config.baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: { 'x-api-key': this.config.apiKey },
      credentials: 'include',
    });
    this.currentUser = null;
    console.log("debug from authClient l69: LOGGED OUT")
  }

  getUser(): User | null {
    return this.currentUser;
  }

  // Add register, refreshToken, etc.
  async refreshToken(){
    try {
        const res = await fetch(`${this.config.baseUrl}/api/auth/refresh`, {
            method : "POST",
            headers: { 'x-api-key': this.config.apiKey },
            credentials: 'include',
          });
        const data = await res.json()
        console.log("debug from authClient l85",data)
        this.accessToken = data.accessToken
    } catch (error) {
        throw Error((error as Error).message)
    }
  }
  private async handleResponse(res: Response) {
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error('Invalid JSON');
    }
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  }
} 
export default AuthClient