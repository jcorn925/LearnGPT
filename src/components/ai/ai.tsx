import React,{ useState, useEffect } from 'react'
import OpenAI from "openai";

const openai = new OpenAI();

export default function Home() {
    const [value, setvalue] = useState('')



    async function main() {
        const completion = await openai.chat.completions.create({
          messages: [{ role: "system", content: "You are a helpful assistant." }],
          model: "gpt-3.5-turbo",
        });
      
        console.log(completion.choices[0]);
      }

      useEffect(() => {
        main();
      }, []);

  
    const handleClick = async () => {
      const response = await fetch(
        'http://localhost:2000/api/completion',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'text/event-stream',
          },
        }
      )
      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader()
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        console.log('Received: ', value)
        setvalue((prev) => prev + value)
      }
    }
  
    return (
      <main  >
        <p>Streaming response:</p>
        <br />
        <div style={{ whiteSpace: 'pre-wrap' }}>{value}</div>
        <button colorScheme='whatsapp' onClick={handleClick}>
          Submit
        </button>
      </main>
    )
  }