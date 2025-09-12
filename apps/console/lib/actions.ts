"use server"

import { revalidatePath } from "next/cache"
import data from "./data.json"

export async function generateKey(keyType: "live" | "test"): Promise<string> {
  return `nt_${keyType}_sk_${Math.random().toString(36).substring(2, 18)}`
}

export async function createApp(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string

  if (!name) {
    throw new Error("App name is required")
  }

  // Generate new app ID and API keys
  const newApp = {
    id: `app_${Date.now()}`,
    name,
    description: description || "",
    apiKey: generateKey("live"),
    testApiKey: generateKey("test"),
    createdAt: new Date().toISOString(),
    status: "active",
    environment: "development",
    domain: "",
    redirectUrls: [],
    settings: {
      sessionTimeout: 3600,
      enableMFA: false,
      allowSignup: true,
      emailVerification: true,
    },
    usage: {
      totalUsers: 0,
      activeUsers: 0,
      apiCalls: 0,
      lastActivity: new Date().toISOString(),
    },
  }

  // In a real app, you'd save to database here
  console.log("Creating new app:", newApp)

  revalidatePath("/console")
  return { success: true, app: newApp }
}

export async function getApps() {
  // In a real app, fetch from database
  return data.apps
}

export async function getApp(id: string) {
  // In a real app, fetch from database
  return data.apps.find((app) => app.id === id)
}

export async function regenerateApiKey(appId: string, keyType: "live" | "test") {
  const newKey = generateKey(keyType)

  // In a real app, update database
  console.log(`Regenerating ${keyType} API key for app ${appId}:`, newKey)

  revalidatePath(`/console/${appId}`)
  return { success: true, newKey }
}

export async function updateAppSettings(appId: string, settings: any) {
  // In a real app, update database
  console.log("Updating app settings:", appId, settings)

  revalidatePath(`/console/${appId}`)
  return { success: true }
}
