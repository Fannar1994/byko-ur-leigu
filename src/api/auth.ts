
export async function loginToInspHire(username: string, password: string) {
  const baseUrl = import.meta.env.VITE_INSPHIRE_API; // 👈 read from .env.local

  const response = await fetch(`${baseUrl}/api/session`, {
    method: "POST",
    headers: {
      "EnableString": "BYKO",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();

  if (data.STATUS !== 1) {
    throw new Error("Invalid login");
  }

  return data.SESSIONID; // <- this is what you use in other requests
}
