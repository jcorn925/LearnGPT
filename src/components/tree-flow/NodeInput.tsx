`use client`

import styles from './styles.module.css';
import { useCompletion } from 'ai/react';
import React, { useEffect } from 'react';
import { useReactFlow } from 'reactflow';

export default function NodeInput ({ data, id, handleSubCategoryClick  }) {

  const { completion, input, handleInputChange, handleSubmit, isLoading } = useCompletion({
    api: '/api/initialInput',
  });
  const { setNodes } = useReactFlow();

  console.log('ID: ', id)
  console.log('ID: ', data.id)


  const updateNodeData = (parsedResponse) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === id) {
          // Extract the first key-value pair
          const [key, value] = Object.entries(parsedResponse)[0] || ['', {}];
          
          // Extract description and subCategories
          const description = value.description || '';
          const subCategories = value.subCategories || [];
  
          return {
            ...node,
            data: {
              ...node.data,
              label: key,
              description: description,
              subCategories: subCategories.map(subCat => ({ 
                name: subCat.name, 
                description: subCat.description 
              })),
            },
          };
        }
        return node;
      })
    );
  };

  useEffect(() => {
    if (completion) {
      const cleanedResponse = cleanResponse(completion);
      console.log("Completion: ", completion)
  
      try {
        let parsedResponse = cleanedResponse ? JSON.parse(cleanedResponse) : {};
        updateNodeData(parsedResponse);
      } catch (error) {
        console.error("Error parsing JSON: ", error);
      }
    }
  }, [completion, id]);

  function cleanResponse(completion) {
    if (typeof completion !== 'string') return null;
    const firstBraceIndex = completion.indexOf('{');
    return firstBraceIndex === -1 ? null : completion.slice(firstBraceIndex);
  }

  return (
    <div>
      <div className="whitespace-pre-wrap my-4 text-center">
        {data.description ? (
          <>
            <div className="font-bold mb-2">{data.label}</div>
            <div>{data.description}</div>
            {Array.isArray(data.subCategories) && (
              <div className="subcategories">
                {data.subCategories.map((subCategory, index) => (
                  <div
                    key={index}
                    onClick={() => handleSubCategoryClick(subCategory)}
                    className={styles.subcategoryItem} // CSS Modules apply :hover and :active automatically
                  >
                    <div className="font-semibold">{subCategory.name}</div>
                    <div>{subCategory.description}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div>Type in something you want to learn about.</div>
        )}
      </div>
      {id === "A" ? (
        <>
          <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch">
            <form onSubmit={handleSubmit} className="mb-4">
              <input
                className="w-full border border-gray-300 rounded shadow-xl p-2 dark:text-black"
                value={input}
                placeholder="What do you want to learn about?"
                onChange={handleInputChange}
              />
            </form>
          </div>
        </>
      ) : (null)}
    </div>   
  );
};
