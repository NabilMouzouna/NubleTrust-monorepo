"use client"

import { useState } from "react"
import { Copy, Eye, EyeOff, RefreshCw, Settings, BarChart3, Users, Activity, Key, Check } from "lucide-react"

type App = {
  id: string
  name: string
  description: string
  apiKey: string
  testApiKey: string
  createdAt: string
  status: string
  environment: string
  domain: string
  redirectUrls: string[]
  settings: {
    sessionTimeout: number
    enableMFA: boolean
    allowSignup: boolean
    emailVerification: boolean
  }
  usage: {
    totalUsers: number
    activeUsers: number
    apiCalls: number
    lastActivity: string
  }
}

export default function AppDashboard({ app }: { app: App }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showLiveKey, setShowLiveKey] = useState(false)
  const [showTestKey, setShowTestKey] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null)
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates((prev) => ({ ...prev, [key]: true }))
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }))
      }, 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleRegenerateKey = async (keyType: "live" | "test") => {
    if (!confirm(`Are you sure you want to regenerate the ${keyType} API key? This will invalidate the current key.`)) {
      return
    }

    setIsRegenerating(keyType)
    try {
      // TODO: Implement proper API call to regenerate key
      console.log(`Regenerating ${keyType} key for app ${app.id}`)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert(`${keyType} key regenerated successfully!`)
    } catch (error) {
      console.error("Failed to regenerate key:", error)
      alert("Failed to regenerate API key. Please try again.")
    } finally {
      setIsRegenerating(null)
    }
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "keys", label: "API Keys", icon: Key },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "users", label: "Users", icon: Users },
  ]

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue bg-clip-text text-transparent">
            {app.name}
          </h1>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              app.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
            }`}
          >
            {app.status}
          </span>
        </div>
        <p className="text-gray-300">{app.description}</p>
      </div>

      <div className="mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="text-gray-400 text-sm font-medium">Total Users</h3>
              </div>
              <p className="text-2xl font-bold text-white">{app.usage.totalUsers.toLocaleString()}</p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-green-400" />
                <h3 className="text-gray-400 text-sm font-medium">Active Users</h3>
              </div>
              <p className="text-2xl font-bold text-white">{app.usage.activeUsers.toLocaleString()}</p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="text-gray-400 text-sm font-medium">API Calls</h3>
              </div>
              <p className="text-2xl font-bold text-white">{app.usage.apiCalls.toLocaleString()}</p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-5 h-5 text-gray-400" />
                <h3 className="text-gray-400 text-sm font-medium">Environment</h3>
              </div>
              <p className="text-2xl font-bold text-white capitalize">{app.environment}</p>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-white font-semibold mb-4">Application Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">App ID</label>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-900/50 rounded px-3 py-2 text-white font-mono text-sm flex-1">{app.id}</code>
                  <button
                    onClick={() => copyToClipboard(app.id, "app-id")}
                    className="p-2 hover:bg-white/10 rounded-md transition-colors"
                  >
                    {copiedStates["app-id"] ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Created</label>
                <p className="text-white">{new Date(app.createdAt).toLocaleDateString()}</p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Domain</label>
                <p className="text-white">{app.domain || "Not configured"}</p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Last Activity</label>
                <p className="text-white">{new Date(app.usage.lastActivity).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "keys" && (
        <div className="space-y-6">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">Live API Key</h3>
                <p className="text-gray-400 text-sm">Use this key in your production environment</p>
              </div>
              <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-medium">LIVE</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <code className="bg-gray-900/50 rounded px-3 py-2 text-white font-mono text-sm flex-1">
                {showLiveKey ? app.apiKey : app.apiKey.replace(/sk_\w+/, "sk_" + "•".repeat(16))}
              </code>
              <button
                onClick={() => setShowLiveKey(!showLiveKey)}
                className="p-2 hover:bg-white/10 rounded-md transition-colors"
              >
                {showLiveKey ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
              <button
                onClick={() => copyToClipboard(app.apiKey, "live-key")}
                className="p-2 hover:bg-white/10 rounded-md transition-colors"
              >
                {copiedStates["live-key"] ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <button
                onClick={() => handleRegenerateKey("live")}
                disabled={isRegenerating === "live"}
                className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-md text-sm transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRegenerating === "live" ? "animate-spin" : ""}`} />
                {isRegenerating === "live" ? "Regenerating..." : "Regenerate"}
              </button>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">Test API Key</h3>
                <p className="text-gray-400 text-sm">Use this key for development and testing</p>
              </div>
              <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium">TEST</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <code className="bg-gray-900/50 rounded px-3 py-2 text-white font-mono text-sm flex-1">
                {showTestKey ? app.testApiKey : app.testApiKey.replace(/sk_\w+/, "sk_" + "•".repeat(16))}
              </code>
              <button
                onClick={() => setShowTestKey(!showTestKey)}
                className="p-2 hover:bg-white/10 rounded-md transition-colors"
              >
                {showTestKey ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
              <button
                onClick={() => copyToClipboard(app.testApiKey, "test-key")}
                className="p-2 hover:bg-white/10 rounded-md transition-colors"
              >
                {copiedStates["test-key"] ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <button
                onClick={() => handleRegenerateKey("test")}
                disabled={isRegenerating === "test"}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-md text-sm transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRegenerating === "test" ? "animate-spin" : ""}`} />
                {isRegenerating === "test" ? "Regenerating..." : "Regenerate"}
              </button>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-white font-semibold mb-4">Usage Instructions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-gray-400 font-medium mb-2">Initialize NubleTrust SDK</h4>
                <pre className="bg-gray-900/50 rounded p-4 text-sm text-white overflow-x-auto">
                  {`import { NubleTrust } from '@nubletrust/sdk'

const nubleTrust = new NubleTrust({
  apiKey: '${showLiveKey ? app.apiKey : "your_api_key_here"}',
  environment: '${app.environment}'
})`}
                </pre>
              </div>

              <div>
                <h4 className="text-gray-400 font-medium mb-2">Environment Variables</h4>
                <pre className="bg-gray-900/50 rounded p-4 text-sm text-white overflow-x-auto">
                  {`# .env.local
NUBLETRUST_API_KEY=${showLiveKey ? app.apiKey : "your_api_key_here"}
NUBLETRUST_ENVIRONMENT=${app.environment}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-white font-semibold mb-4">Authentication Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">Allow User Signup</label>
                  <p className="text-gray-400 text-sm">Allow new users to create accounts</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={app.settings.allowSignup}
                  className="w-4 h-4 text-purple-500 bg-gray-900 rounded focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">Email Verification</label>
                  <p className="text-gray-400 text-sm">Require email verification for new accounts</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={app.settings.emailVerification}
                  className="w-4 h-4 text-purple-500 bg-gray-900 rounded focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">Multi-Factor Authentication</label>
                  <p className="text-gray-400 text-sm">Enable MFA for enhanced security</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={app.settings.enableMFA}
                  className="w-4 h-4 text-purple-500 bg-gray-900 rounded focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Session Timeout (seconds)</label>
                <input
                  type="number"
                  defaultValue={app.settings.sessionTimeout}
                  className="w-full bg-gray-900/50 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-white font-semibold mb-4">Redirect URLs</h3>
            <p className="text-gray-400 text-sm mb-4">Configure allowed redirect URLs for OAuth flows</p>
            <div className="space-y-2">
              {app.redirectUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="url"
                    defaultValue={url}
                    className="flex-1 bg-gray-900/50 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button className="px-3 py-2 text-red-400 hover:bg-red-500/20 rounded-md text-sm">Remove</button>
                </div>
              ))}
              <button className="w-full border-2 border-dashed border-gray-600 hover:border-purple-500 text-gray-400 hover:text-purple-400 py-3 rounded-md text-sm transition-colors">
                + Add Redirect URL
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
          <h3 className="text-white font-semibold mb-4">User Management</h3>
          <p className="text-gray-400">User management features will be available in the next update.</p>
        </div>
      )}
    </div>
  )
}
