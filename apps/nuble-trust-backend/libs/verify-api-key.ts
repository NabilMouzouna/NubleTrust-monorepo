import { getApplicationByApiKey } from "@nubletrust/postgres-drizzle";

export default async function verifyApiKey(apiKey: string) {
    try {
        const application = await getApplicationByApiKey(apiKey);
        if (application) return application
        console.log("Application not found")
        return application
    } catch (error) {
        console.log("Error verifying API key", error)
        return error as Error
    }
}