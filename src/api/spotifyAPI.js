export const spotifyAPI = async (url, method, token = null, body = null) => {
  try {
    const headers = {};

    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (method !== "GET") headers["Content-Type"] = "application/json";

    const options = {
      method,
      headers,
    };

    if (body && method !== "GET" && method !== "HEAD") {
      options.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en fetch:", error.message);
    throw error;
  }
};
