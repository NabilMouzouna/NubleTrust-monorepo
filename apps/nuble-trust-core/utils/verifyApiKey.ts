import { getApplicationByApiKey } from "@nubletrust/postgres-drizzle";

export async function verifyApiKey(
  key: string,
): Promise<string | null> {
  //TODO: switch this to JWT so that I don't have to connect to DB twice
  try {
    const app = await getApplicationByApiKey(key);
    return app?.id || null;
  } catch (error) {
    console.error("Failed to verify API key:", (error as Error).message);
    return null;
  }
}