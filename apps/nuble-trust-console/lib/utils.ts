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
      const developerId = "018123a6-f087-4d79-8b10-361bfc3f55f7" //TODO should be updated lated
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