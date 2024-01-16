import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  console.log("Prompt: ", prompt);

  const modifiedPrompt = `As a teacher using the OpenAI API to enhance learning, given the following Topic: "${prompt}", break it down into a 2 sentence description and three key subCategories to learn more. \n
    End the description with a period. \n
    The subcategories should help students gain a deeper understanding of the subject. Provide a name and brief description for each subCategory. \n
    Return the response in JSON format like the example below. \n
    Start your response directly with the JSON formatted data, WITHOUT ANY additional headers or titles. \n

    Example:

    Topic: "Why did the US Lose Vietnam?"

    {
      "Why did the US Lose Vietnam?": {
        "description": "The Vietnam War was a conflict between North and South Vietnam, in which the US supported the South and ultimately withdrew in defeat.",
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
    max_tokens: 700,
    prompt: modifiedPrompt,
  });

  // console.log('Response: ', response)

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}