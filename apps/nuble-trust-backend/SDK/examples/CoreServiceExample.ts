import { AuthService, ApiClient, TokenUtils } from '../index';

// Example of using the core services without React
async function coreServiceExample() {
  const baseUrl = 'http://localhost:3000';
  const apiKey = 'your-api-key-here';

  // Initialize services
  const authService = new AuthService(baseUrl);
  const apiClient = new ApiClient({ baseUrl, apiKey });

  try {
    // Register a new user
    console.log('Registering user...');
    const registerResponse = await authService.register({
      email: 'test@example.com',
      password: 'password123',
      apiKey,
    });

    if (registerResponse.success) {
      console.log('Registration successful!');
      console.log('Access Token:', registerResponse.accessToken);
      console.log('User:', registerResponse.user);

      // Set the access token for API calls
      if (registerResponse.accessToken) {
        apiClient.setAccessToken(registerResponse.accessToken);

        // Check token info
        const tokenInfo = TokenUtils.decodeToken(registerResponse.accessToken);
        console.log('Token payload:', tokenInfo);
        console.log('Token expires in:', TokenUtils.getTimeUntilExpiry(registerResponse.accessToken), 'ms');
        console.log('Should refresh token:', TokenUtils.shouldRefreshToken(registerResponse.accessToken));
      }
    } else {
      console.error('Registration failed:', registerResponse.message);
    }

    // Login with existing user
    console.log('\nLogging in...');
    const loginResponse = await authService.login({
      email: 'test@example.com',
      password: 'password123',
      apiKey,
    });

    if (loginResponse.success) {
      console.log('Login successful!');
      console.log('Access Token:', loginResponse.accessToken);

      // Update API client with new token
      if (loginResponse.accessToken) {
        apiClient.setAccessToken(loginResponse.accessToken);
      }
    } else {
      console.error('Login failed:', loginResponse.message);
    }

    // Make an authenticated API call
    console.log('\nMaking authenticated API call...');
    try {
      const response = await apiClient.get('some-protected-endpoint');
      console.log('API Response status:', response.status);
    } catch (error) {
      console.log('API call failed (expected if endpoint doesn\'t exist):', error);
    }

    // Refresh token
    console.log('\nRefreshing token...');
    const refreshResponse = await authService.refreshToken();
    if (refreshResponse.success) {
      console.log('Token refreshed successfully!');
      console.log('New Access Token:', refreshResponse.accessToken);

      // Update API client with new token
      if (refreshResponse.accessToken) {
        apiClient.setAccessToken(refreshResponse.accessToken);
      }
    } else {
      console.error('Token refresh failed:', refreshResponse.message);
    }

    // Logout
    console.log('\nLogging out...');
    const logoutResponse = await authService.logout();
    if (logoutResponse.success) {
      console.log('Logout successful!');
    } else {
      console.error('Logout failed:', logoutResponse.message);
    }

  } catch (error) {
    console.error('Example failed:', error);
  }
}

// Run the example
if (typeof window === 'undefined') {
  // Node.js environment
  coreServiceExample();
}

export { coreServiceExample };
