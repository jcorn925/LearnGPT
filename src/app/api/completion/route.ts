import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

// function removePrefix(str) {
//   const prefixes = ["QUESTION: ", "EXAMPLES: ", "NEW NODES: "];

//   for (const prefix of prefixes) {
//     if (str.startsWith(prefix)) {
//       return str.substring(prefix.length);
//     }
//   }

//   return str;
// }

export async function POST(req: Request) {
  const { prompt } = await req.json();
  console.log("Prompt: ", prompt);
  // const cleanedPrompt = removePrefix(prompt);

  const modifiedPrompt = `You are a teacher using OpenAI API to enhance learning. Given the following Breakdown: "${prompt}", break it down into a 2 sentence description and three key subCategories to learn more. \n
    The subcategories should help students gain a deeper understanding of the subject. Provide a name and brief description for each subCategory. \n
    Use the Key from the Parent Node that is provided in parentheses as context for your summary. \n
    Return the response in JSON format like the example below. \n
    Start your response directly with the JSON formatted data, WITHOUT ANY additional headers or titles. \n
    
    Example:
    
    Breakdown: "(Why did the US Lose Vietnam?) Military Strategies: The United States' military strategies, including the use of napalm and heavy bombing, were not effective against the guerrilla tactics of the North Vietnamese and Viet Cong."
    
    {
      "Military Strategies": {
        "description": "The United States' military strategies, including the use of napalm and heavy bombing, were not effective against the guerrilla tactics of the North Vietnamese and Viet Cong.",
        "subCategories": [
          {
            "name": "Military Strategies",
            "description": "The United States' military strategies, including the use of napalm and heavy bombing, were not effective against the guerrilla tactics of the North Vietnamese and Viet Cong."
          },
          {
            "name": "Political Climate",
            "description": "The anti-war movement and political unrest in the United States, combined with the corrupt and unpopular South Vietnamese government, made it difficult for the US to maintain public support for the war."
          },
          {
            "name": "Cultural Misunderstandings",
            "description": "The cultural differences between the US and Vietnam, including language barriers and lack of understanding of the local population, hindered the US' ability to win hearts and minds and gain support for their cause."
          }
        ]
      }
    }`

  const response = await openai.completions.create({
    model: 'gpt-3.5-turbo-instruct',
    stream: true,
    temperature: 0.8,
    max_tokens: 600,
    prompt: modifiedPrompt,
  });

  // console.log('Response: ', response)

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}