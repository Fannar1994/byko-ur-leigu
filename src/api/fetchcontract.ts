
export async function fetchContracts() {
  const baseUrl = import.meta.env.VITE_INSPHIRE_API;
  const sessionId = localStorage.getItem("inspSession");

  if (!sessionId) {
    throw new Error("No inspHire session found. Please log in.");
  }

  const response = await fetch(`${baseUrl}/api/contracts`, {
    method: "GET",
    headers: {
      "EnableString": "BYKO",
      "SessionID": sessionId,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Failed to fetch contracts: " + errorText);
  }

  const data = await response.json();
  return data;
}
