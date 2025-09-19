import React, { useState, useEffect } from 'react';
import { useAuth } from '../src/frameworks/AuthProvider';

const ZeroTrustExample: React.FC = () => {
  const { 
    user, 
    isAuthenticated, 
    riskScore, 
    riskLevel, 
    currentSessionId,
    getDeviceFingerprint,
    getBrowserCapabilities,
    login,
    logout 
  } = useAuth();

  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [browserCapabilities, setBrowserCapabilities] = useState<any>(null);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    apiKey: ''
  });

  useEffect(() => {
    // Get device fingerprint and browser capabilities on component mount
    const loadDeviceInfo = async () => {
      try {
        const fingerprint = await getDeviceFingerprint();
        const capabilities = getBrowserCapabilities();
        setDeviceInfo(fingerprint);
        setBrowserCapabilities(capabilities);
      } catch (error) {
        console.error('Failed to load device info:', error);
      }
    };

    loadDeviceInfo();
  }, [getDeviceFingerprint, getBrowserCapabilities]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await login(loginForm);
    
    if (response.success) {
      console.log('Login successful!');
      console.log('Risk Score:', response.riskScore);
      console.log('Risk Level:', response.riskLevel);
      console.log('Session ID:', response.sessionId);
    } else {
      console.error('Login failed:', response.message);
      if (response.riskFactors) {
        console.log('Risk Factors:', response.riskFactors);
      }
    }
  };

  const getRiskColor = (level: string | null) => {
    switch (level) {
      case 'LOW': return 'text-green-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'HIGH': return 'text-orange-600';
      case 'CRITICAL': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBadgeColor = (level: string | null) => {
    switch (level) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Zero Trust Authentication</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">API Key</label>
            <input
              type="text"
              value={loginForm.apiKey}
              onChange={(e) => setLoginForm({...loginForm, apiKey: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login with Zero Trust
          </button>
        </form>

        {/* Device Information Display */}
        {deviceInfo && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Device Information</h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Device Fingerprint:</span> {deviceInfo.deviceFingerprint.substring(0, 16)}...</div>
              <div><span className="font-medium">IP Address:</span> {deviceInfo.ipAddress}</div>
              <div><span className="font-medium">Location:</span> {deviceInfo.location}</div>
              <div><span className="font-medium">User Agent:</span> {deviceInfo.userAgent.substring(0, 50)}...</div>
              <div><span className="font-medium">Screen Resolution:</span> {deviceInfo.screenResolution}</div>
              <div><span className="font-medium">Timezone:</span> {deviceInfo.timezone}</div>
              <div><span className="font-medium">Language:</span> {deviceInfo.language}</div>
              <div><span className="font-medium">Platform:</span> {deviceInfo.platform}</div>
            </div>
          </div>
        )}

        {/* Browser Capabilities */}
        {browserCapabilities && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Browser Capabilities</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(browserCapabilities).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium">{key}:</span>
                  <span className={value ? 'text-green-600' : 'text-red-600'}>
                    {value ? '✓' : '✗'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Zero Trust Dashboard</h2>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Information */}
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-3">User Information</h3>
          <div className="space-y-2">
            <div><span className="font-medium">Email:</span> {user?.email}</div>
            <div><span className="font-medium">User ID:</span> {user?.id}</div>
            <div><span className="font-medium">Session ID:</span> {currentSessionId}</div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Risk Assessment</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Risk Score:</span>
              <span className={`text-xl font-bold ${getRiskColor(riskLevel)}`}>
                {riskScore || 0}/100
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Risk Level:</span>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${getRiskBadgeColor(riskLevel)}`}>
                {riskLevel || 'UNKNOWN'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  (riskScore || 0) < 30 ? 'bg-green-500' :
                  (riskScore || 0) < 60 ? 'bg-yellow-500' :
                  (riskScore || 0) < 80 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${riskScore || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Device Information */}
      {deviceInfo && (
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Current Session Device</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium">Device Fingerprint:</span> {deviceInfo.deviceFingerprint.substring(0, 32)}...</div>
            <div><span className="font-medium">IP Address:</span> {deviceInfo.ipAddress}</div>
            <div><span className="font-medium">Location:</span> {deviceInfo.location}</div>
            <div><span className="font-medium">Screen Resolution:</span> {deviceInfo.screenResolution}</div>
            <div><span className="font-medium">Timezone:</span> {deviceInfo.timezone}</div>
            <div><span className="font-medium">Language:</span> {deviceInfo.language}</div>
          </div>
        </div>
      )}

      {/* Zero Trust Features */}
      <div className="mt-6 p-4 bg-green-50 rounded-md">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Zero Trust Features Active</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✓</span>
            <span>Device Fingerprinting</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✓</span>
            <span>Location Tracking</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✓</span>
            <span>Risk Scoring</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✓</span>
            <span>Session Monitoring</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✓</span>
            <span>Behavioral Analysis</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✓</span>
            <span>Real-time Validation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZeroTrustExample;
