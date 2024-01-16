export async function POST(req: Request) {
  const { searchQuery } = await req.json();
  // console.log('Search Query: ', searchQuery);
  const apiKey = process.env.BING_API_KEY;

  if (!apiKey) {
    console.error('Bing API key is not set');
    return Response.error();
  }

  // console.log("search query: ", searchQuery)
  const endpoint = "https://api.bing.microsoft.com/v7.0/images/search";

  try {
    const response = await fetch(`${endpoint}?q=${searchQuery}&imageType=Photo`, {
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
      }
    });
    // console.log("response: ", response)

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    // console.log('Data: ', data)
    const firstImageUrl = data.value[0]?.contentUrl; // Extract the URL of the first image

    // console.log("data: ", firstImageUrl)
    return Response.json ({ firstImageUrl })
  } catch (error) {
    console.error('Error fetching data from Bing Images API:', error);
  }
}




