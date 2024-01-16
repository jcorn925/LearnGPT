import { MouseEventHandler, useEffect, useState } from 'react';
import styles from './styles.module.css'; // Adjust the import path as needed
import { useCompletion } from 'ai/react';
import { Handle, NodeProps, Position, useReactFlow } from 'reactflow';


export default function Examples ({ data, id }) {
    const { complete, isLoading, completion } = useCompletion({
        api: '/api/examples',
    });  
    const { getEdges, getNodes, setNodes } = useReactFlow();
    const [attemptedFetch, setAttemptedFetch] = useState(false);
    const [imageURL, setImageURL] = useState("");


    function cleanResponse(completion) {
      if (typeof completion !== 'string') return null;
      const firstBraceIndex = completion.indexOf('{');
      const lastBraceIndex = completion.lastIndexOf('}');
      return (firstBraceIndex === -1 || lastBraceIndex === -1) ? null : completion.slice(firstBraceIndex, lastBraceIndex + 1);
    }

    function encloseWithBraces(response) {
      if (typeof response !== 'string') {
          console.error("Input is not a string.");
          return null;
      }
      if (!response.startsWith('{')) response = `{${response}`;
      if (!response.endsWith('}')) response = `${response}}`;
      return response;
    }
// set data.examples
    useEffect(() => {
      if (completion) {
        console.log("Completion: ", completion);
        let cleanedResponse = encloseWithBraces(completion);
        console.log("Cleaned response: ", cleanedResponse);
        // const cleanedResponse = cleanResponse(completion) ? completion : encloseWithBraces(completion);
        console.log("cleaned response: ", cleanedResponse);
    
        if (cleanedResponse !== null) {
          try {
            const parsedResponse = JSON.parse(cleanedResponse);
            console.log("Parsed Response: ", parsedResponse);
    
            setNodes((currentNodes) =>
              currentNodes.map((node) => {
                if (node.id === id) {
                  // Merge the new examples with the existing examples
                  const newExamples = { ...node.data.examples, ...parsedResponse };
                  console.log('New Examples: ', newExamples);
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      examples: newExamples
                    }
                  };
                }
                return node;
              })
            );
            console.log("examples: ", data.examples)
            setAttemptedFetch(false);
          } catch (error) {
            console.error("Error parsing JSON: ", error);
          }
        } else if (!attemptedFetch) {
          fetchExample(Object.keys(examples));
          setAttemptedFetch(true);
        }
      }
    }, [completion, attemptedFetch]);
    

    const fetchExample = async (existingKeys) => {
        const topLabel = findTopParentLabelAsString(getEdges, getNodes, id);
        const content = `(${topLabel}) ${data.description}`;
        console.log("Content: ", content);
        const request = `${content} (${existingKeys})`;
        console.log("Request: ", request);
        await complete(request);
    };

    // fetch image if data.examples changes
    useEffect(() => {
      if (data.examples) {
        const fetchImage = async () => {
          const exampleKeys = Object.keys(data.examples);
          const lastKey = exampleKeys[exampleKeys.length - 1];
          const newExample = data.examples[lastKey];
          const fetchedImageUrl = await fetchAndSetImageUrl(newExample.example);
          setImageURL(fetchedImageUrl);
        };
    
        fetchImage();
      }
    }, [data.examples]);

    // update example if imageURL changes
    useEffect(() => {
      if (imageURL) {
        updateNewExampleImage();
      }
    }, [imageURL]);
    
    const updateNewExampleImage = () => {
      // Get the last example key
      const exampleKeys = Object.keys(data.examples);
      const lastKey = exampleKeys[exampleKeys.length - 1];
    
      // Create an updated examples object with the new image URL
      const updatedExamples = {
        ...data.examples,
        [lastKey]: { ...data.examples[lastKey], image: imageURL }
      };
    
      // Update the nodes with the updated examples
      setNodes((currentNodes) => 
        currentNodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                examples: updatedExamples
              }
            };
          }
          return node;
        })
      );
    };

    // Function to fetch and set the image URL
    const fetchAndSetImageUrl = async (searchQuery) => {
      try {
        const response = await fetch('/api/fetchImageURL', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ searchQuery })  // Use the provided search query
        });
  
        const result = await response.json();
        // console.log('URL: ', result.firstImageUrl)
        return result.firstImageUrl;  // Return the first image URL from the result
      } catch (error) {
        console.error('Error fetching image:', error);
        return null;  // Return null in case of an error
      }
    };

    const newExampleClicked = async () => {
        const existingKeys = data.examples ? Object.keys(data.examples) : []
        console.log("keys: ", existingKeys);
        if (data.description !== undefined){
          await fetchExample(existingKeys);
        }
    }; 

    function findTopParentLabelAsString(getEdges, getNodes, targetNodeId) {
        let currentNodeId = targetNodeId;
        let topLabel = "";
    
        while (currentNodeId) {
            const parentEdge = getEdges().find(edge => edge.target === currentNodeId);
    
            if (parentEdge) {
                currentNodeId = parentEdge.source; // Move up to the parent node
            } else {
                // Get the label of the top-most parent node (or current node if it has no parent)
                const topParentNode = getNodes().find(node => node.id === currentNodeId);
                topLabel = topParentNode ? topParentNode.data.label : "";
                break; // Exit the loop
            }
        }
        return `${topLabel}`;
    }

  return (
    <div className={styles.content}>
      {isLoading ? (
          <div>Loading...</div> // Display loading indicator
      ) : (
      <button onClick={newExampleClicked} className={styles.newExampleButton}>
          New Example
      </button>
      )}

      {data.examples && Object.keys(data.examples).length > 0 ? (
        Object.keys(data.examples).map((key, index) => (
          <div key={index} style={{ height: 'auto' }}>
            <img 
              src={data.examples[key].image} // Assuming each example object has an 'image' property
              alt={key} 
              style={{ width: '100%', height: '30vh', marginBottom: '10px' }} 
            />
            <div className={styles.exampleTitle}>{key}</div>
            <div className={styles.exampleDescription}>{data.examples[key].example}</div>
          </div>
        ))
      ) : (
        <div>No examples available.</div>
      )}
    </div>
  );
};