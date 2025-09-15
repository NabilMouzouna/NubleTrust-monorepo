



export async function generateKey(keyType: "live" | "test"): Promise<string> {
  return `nt_${keyType}_sk_${Math.random().toString(36).substring(2, 18)}`
}
export function createApp(){}
export const getApps = async () => {
  const developerId = "018123a6-f087-4d79-8b10-361bfc3f55f7"
  try {
      const response = await fetch(`/api/apps?id=${developerId}`)
      const appsList = await response.json() 
      console.log(appsList)
      return appsList
  } catch (error) {
      throw Error((error as Error).message as string)
  }
}