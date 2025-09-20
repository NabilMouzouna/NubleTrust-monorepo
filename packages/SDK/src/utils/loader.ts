export async function Loader(endpoint: string, payload: object | null, apiKey: string) : Promise<ResponseType | null | undefined> {
    try {
      const result = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
  
      if (!result.ok) {
        throw new Error(
          `Request failed with status ${result.status}: ${result.statusText}`
        );
      }
  
      const data = await result.json();
      return data;
    } catch (err) {
      console.error("Loader error:", err);
      throw err;
    }
  }