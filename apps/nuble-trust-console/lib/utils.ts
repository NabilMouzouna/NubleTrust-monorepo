import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { createApplication } from "@nubletrust/postgres-drizzle";
import { randomBytes } from "crypto";

export interface registerAppReturn {
  id: string,
  developerId: string,
  name: string,
  description: string | null,
  apiKey: string,
  allowedOrigins: string[],
  createdAt: string | number | Date
}

function createApiKey() {
    // Generate 32 random bytes (256 bits)
    const randomPart = randomBytes(32).toString("base64url");
    const apiKey = `NT_${randomPart}`;
  
    return apiKey
  }
export async function registerApp(name: string, description: string, developerId: string){
  const apiKey = createApiKey()
  try {
    const app = await createApplication({
      name,
      description,
      developerId,
      apiKey,
      allowedOrigins: ["*"]
    })
    return app ? app : null
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw error
  }
}