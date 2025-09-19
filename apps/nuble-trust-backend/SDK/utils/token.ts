import { TokenPayload } from '../types';

export class TokenUtils {
  /**
   * Decode JWT token without verification (client-side only)
   * Note: This should only be used for reading token data, not for security validation
   */
  static decodeToken(token: string): TokenPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  static getTimeUntilExpiry(token: string): number {
    const decoded = this.decodeToken(token);
    if (!decoded) return 0;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = (decoded.exp - currentTime) * 1000;
    return Math.max(0, timeUntilExpiry);
  }

  /**
   * Check if token should be refreshed (expires within 2 minutes)
   */
  static shouldRefreshToken(token: string): boolean {
    const timeUntilExpiry = this.getTimeUntilExpiry(token);
    return timeUntilExpiry < 2 * 60 * 1000; // 2 minutes
  }
}
