export interface AuthConfig {
    baseUrl: string;
    apiKey: string;
}

export interface UserClaims {
    id: string;
    email: string;
    exp: number; // Expiration timestamp
    iat: number; // Issued at timestamp
    // Add any other claims your JWT might have
}

export interface AuthState {
    user: UserClaims | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}