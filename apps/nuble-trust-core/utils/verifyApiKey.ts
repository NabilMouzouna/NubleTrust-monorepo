import { getApplicationByApiKey } from "@nubletrust/postgres-drizzle";

export async function verifyApiKey(
  key: string,
): Promise<string | null> {
  //TODO: switch this to JWT so that I don't have to connect to DB twice
  try {
    const app = await getApplicationByApiKey(key);
    console.log(app)
    return app?.id || null;
    console.log('✅ found')
  } catch (error) {
    console.error("Failed to verify API key:", (error as Error).message);
    return null;
  }
}