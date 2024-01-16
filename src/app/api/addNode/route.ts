import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

function removePrefix(str) {
  const prefixes = ["QUESTION: ", "EXAMPLES: ", "NEW NODES: "];

  for (const prefix of prefixes) {
    if (str.startsWith(prefix)) {
      return str.substring(prefix.length);
    }
  }

  return str;
}


export async function POST(req: Request) {
  const { prompt } = await req.json();
  console.log("Prompt: ", prompt);
  const cleanedPrompt = removePrefix(prompt);

  let modifiedPrompt;

  if (prompt.startsWith("1")) {
    console.log("New Nodes triggered");

    modifiedPrompt = `You are a teacher using OpenAI API to enhance learning. Given the following Breakdown: "${cleanedPrompt}", expand on each numbered subcategory. \n
    For each subcategory, provide a one-sentence summary and three new numbered subcategories that help learn it deeper. \n
    Use the Key from the Parent Node that is provided in parentheses after "NEW NODES: " as context for your summary. \n
    End the one-sentence summary with a period followed by "Further broken down into: " \n
    Format the response in JSON, with each subcategory as a key and the summary and new subcategories as its value.
    
    Example:
    
    Breakdown:

    "NEW NODES: (What are Atomic Interactions?) Atomic interactions refer to the ways in which atoms interact with each other, such as through: 
    1. Chemical Bonds 
    2. Electrical Forces 
    3. Magnetic Forces 
    
      {"Chemical Bonds": "Chemical bonds are the lasting attraction between atoms that enables the formation of chemical compounds. Further broken down into: 1. Ionic Bonds 2. Covalent Bonds 3. Metallic Bonds",
      "Electrical Forces": "Electrical forces are the forces that occur due to the attraction or repulsion of particles with electric charges. Further broken down into: 1. Coulomb's Law 2. Electrostatic Induction 3. Capacitance",
      "Magnetic Forces": "Magnetic forces are the forces that arise due to the magnetic field produced by moving electric charges. Further broken down into: 1. Electromagnetism 2. Magnetic Fields 3. Magnetic Flux"}`;
  } 
  else if (prompt.startsWith("2")) {
    console.log("Examples triggered");
    modifiedPrompt = `You are a teacher using OpenAI API to enhance learning. Provide a specific real-life example about the "${cleanedPrompt}". \n
    The "${cleanedPrompt}" is just a description about a topic. You need to provide a real example to help users learn more about it. \n
    If the topic is related to a branch of math, the example could be an example usage of a related formula. \n
    If the topic is related to WW2 vehicles, the example should be a description of a specific model of vehicle. \n
    Use the Key from the Parent Node that is provided in parentheses after "NEW NODES: " as context for your summary. \n
    Also return a 1-3 word Key that can be paired with the Example. \n
    Format the response in JSON with the Key as the key and the Example as its Value.
    
    Example: 
    cleanedPrompt: "(Vehicles from WW2) Land Vehicles are vehicles that are used on land for transportation or combat purposes."
    
    Response format:
    {"Tiger Tank": "The Tiger Tank was one of the most formidable tanks in the German army during WW2, known for its thick armor and powerful 88mm gun."}`;

  }
  else if (prompt.startsWith("QUESTION: ")) {
    modifiedPrompt = `You are a teacher using OpenAI API to enhance learning. Given the following Question: "${cleanedPrompt}", give as accurate of an answer as possible. \n
    Use the Context that is inside the parentheses after the question as context for your summary. \n
    Determine how many 
    Also return a 1-3 word Key that can be paired with the Example. \n
    Format the response in JSON with the Key as the key and Example as its Value.

    Example: 
    Summary: "(Vehicles from WW2) Land Vehicles are vehicles that are used on land for transportation or combat purposes."

    {"A WW2 Land Vehicle": "Description of the land vehicle."}`

  }
  else {
    modifiedPrompt = `As a teacher using the OpenAI API to enhance learning, given the following Topic: "${prompt}", break it down into a one sentence summary and three key subcategories. \n
    End the one-sentence summary with a period followed by "Further broken down into: " \n
    The subcategories should help students gain a deeper understanding of the subject. Number each subcategory and provide a brief explanation for each. \n
    Return the response in JSON format with the category as each key and summary as its value. \n
    Start your response directly with the JSON formatted data, WITHOUT ANY additional headers or titles. \n

    Example:

    Topic: "What are Atomic Interactions?"

    {
      "What are Atomic Interactions?": "Atomic interactions refer to the ways in which atoms interact with each other. Further broken down into: 1. Chemical Bonds 2. Electrical Forces 3. Magnetic Forces"
    }`

  }
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