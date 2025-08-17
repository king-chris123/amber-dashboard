// This is the final, working code for your secure backend function.
export const handler = async () => {
  // These variables are read from your Netlify project settings.
  const { AMBER_API_KEY, AMBER_SITE_ID } = process.env;

  // Double-check that the variables were found.
  if (!AMBER_API_KEY || !AMBER_SITE_ID) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API Key or Site ID is missing." }),
    };
  }

  const AMBER_API_URL = `https://api.amber.com.au/v1/sites/${AMBER_SITE_ID}/prices/current`;

  try {
    const response = await fetch(AMBER_API_URL, {
      headers: { 'Authorization': `Bearer ${AMBER_API_KEY}` },
    });

    if (!response.ok) {
      // If Amber gives an error, pass it along.
      throw new Error(`Amber API responded with status ${response.status}`);
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
