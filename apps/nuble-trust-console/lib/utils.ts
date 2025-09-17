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
export async function registerApp(name : string , description : string){
      const apiKey = createApiKey()
      const developerId = process.env.DEVELOPER_ID || "912d756b-265a-4c4c-9bc8-3082c8ddd29f" //TODO should be updated lated
      console.log(developerId)
      try {
        const app = await createApplication({
          name,
          description,
          developerId,
          apiKey,
          allowedOrigins :["*"]
        })
        console.log(app)
        return app? app : null
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message)
        }
        throw error
      }
    }