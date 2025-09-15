

export const getPbKey = async () => {

  if (localStorage.getItem("NT_publicKey")) return localStorage.getItem("NT_publicKey")
    try {
      const res = await fetch("http://localhost:3000/api/.well-known/publicKey");
      if (res.ok) {
        const key = await res.text();
        localStorage.setItem("NT_publicKey", key);
        alert("Public key fetched and stored successfully!");
        return key
      } else {
        alert("Failed to fetch public key");
        localStorage.removeItem("NT_publicKey"); 
        return null
      }
    } catch (error) {
      console.error("Error fetching public key:", error);
      alert("An error occurred while fetching the public key.");
      localStorage.removeItem("NT_publicKey"); // Clear from localStorage on error
      return (null);
    }
  };