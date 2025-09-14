"use server"

import { revalidatePath } from "next/cache"
import { createApplication, getAllApplicationsByDeveloper } from "@nubletrust/postgres-drizzle"


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
  const payload = {
    name,
    description,
    developerId : "018123a6-f087-4d79-8b10-361bfc3f55f7",
    apiKey : await generateKey("live"),
    allowedOrigins : ["*"],

    }
    let newApp;
  try {
    newApp = await createApplication(payload)
  } catch (error) {
    throw new Error("something unexpected" + (error as Error).message)
  }
  console.log("Creating new app:", name)
  // In a real app, you'd save to database here

  revalidatePath("/console")
  return { success: true, app: newApp }
}

export async function getApps(developerId : string) {
return await getAllApplicationsByDeveloper(developerId)
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
