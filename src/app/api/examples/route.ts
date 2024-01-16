import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

function extractContentAfterPeriod(text) {
    const lastPeriodIndex = text.lastIndexOf('(');
    if (lastPeriodIndex !== -1) {
        return text.substring(lastPeriodIndex).trim();
    }
    return '';
}

function extractContentBeforePeriod(text) {
    const lastPeriodIndex = text.lastIndexOf('(');
    if (lastPeriodIndex !== -1) {
        return text.substring(0, lastPeriodIndex).trim();
    }
    return text;
}

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const extractedExamples = extractContentAfterPeriod(prompt);
  const shavedPrompt = extractContentBeforePeriod(prompt);
  console.log("Extracted examples: ", extractedExamples);
  console.log("Updated Prompt: ", shavedPrompt);

  const modifiedPrompt = `You are a teacher using OpenAI API to enhance learning, given the following Topic. Provide a specific real-life example about the "${shavedPrompt}". \n
    DO NOT provide an example that is already in  ${extractedExamples} if it isn't empty. \n
    The Prompt is just a description about a topic. You need to provide a real example to help users learn more about it. \n
    If the topic is related to a branch of math, the example could be an example usage of a related formula. \n
    If the topic is related to WW2 vehicles, the example should be a description of a specific model of vehicle. \n
    Use the Key from the Parent Node that is provided in parentheses as context for your summary. \n
    Return the response in JSON format like the example below. \n
    Start your response directly with the JSON formatted data, WITHOUT ANY additional headers or titles. \n

    
    Example: 

    Topic: "(Vehicles from WW2) Land Vehicles are vehicles that are used on land for transportation or combat purposes."
    
    {
      "Tiger Tank": {
        "example": "The Tiger Tank was one of the most formidable tanks in the German army during WW2, known for its thick armor and powerful 88mm gun."
      }
    }`


  const response = await openai.completions.create({
    model: 'gpt-3.5-turbo-instruct',
    stream: true,
    temperature: 0.8,
    max_tokens: 600,
    prompt: modifiedPrompt,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}