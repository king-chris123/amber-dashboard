// This secure function runs on the server and protects your API key.
export const handler = async () => {
  const { AMBER_API_KEY, AMBER_SITE_ID } = process.env;
  const AMBER_API_URL = `https://api.amber.com.au/v1/sites/${AMBER_SITE_ID}/prices/current`;

  try {
    const response = await fetch(AMBER_API_URL, {
      headers: { 'Authorization': `Bearer ${AMBER_API_KEY}` },
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};