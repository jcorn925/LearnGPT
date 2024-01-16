'use client'

import { Button } from '@/components/ui/button';
import { useCompletion } from 'ai/react';
import Tree from './Tree';
import { ReactFlowProvider } from 'reactflow';

import {CareerPathTreeChart} from './Tree'

export default function SloganGenerator() {
  const { completion, input, handleInputChange, handleSubmit } = useCompletion();

  return (

    <>
      <div className="w-screen h-screen">

          <CareerPathTreeChart />
      </div>

    </>
    // <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch">




    //   <form onSubmit={handleSubmit}>
    //     <input
    //       className="fixed w-full max-w-md bottom-0 border border-gray-300 rounded mb-8 shadow-xl p-2 dark:text-black"
    //       value={input}
    //       placeholder="Describe your business..."
    //       onChange={handleInputChange}
    //     />
    //     <Button type="submit" className="">Submit</Button>
    //   </form>
    //   {completion ? (
    //     <div className="whitespace-pre-wrap my-4">{completion}</div>
    //   ) : (
    //     <div>Enter a business description and click enter to generate slogans.</div>
    //   )}
    // </div>
  );
}