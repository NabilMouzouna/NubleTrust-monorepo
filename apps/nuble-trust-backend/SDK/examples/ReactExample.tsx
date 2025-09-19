import React, { useState } from 'react';
import { AuthProvider, useAuth } from '../index';

// Example login form component
const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    apiKey: '',
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    const response = await login(credentials);
    if (response.success) {
      setMessage('Login successful!');
    } else {
      setMessage(`Login failed: ${response.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h3>Login</h3>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          required
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="API Key"
          value={credentials.apiKey}
          onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
          required
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
    </form>
  );
};

// Example dashboard component
const Dashboard: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h3>Dashboard</h3>
      <p>Welcome, {user?.email}!</p>
      <p>User ID: {user?.id}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

// Main app component
const App: React.FC = () => {
  return (
    <AuthProvider baseUrl="http://localhost:3000">
      <div style={{ padding: '20px' }}>
        <h1>NubleTrust SDK Example</h1>
        <Dashboard />
      </div>
    </AuthProvider>
  );
};

export default App;
