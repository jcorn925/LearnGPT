`use client`

import { useCompletion } from 'ai/react';
import { useEffect, useState } from 'react';
import { useReactFlow } from 'reactflow';

export default function QuestionInput ({ data, id, xPos, yPos }) {

  const { addNodes, addEdges, getEdges, getNodes } = useReactFlow();
  const { completion, complete, isLoading} = useCompletion();
  const [question, setQuestion] = useState('');

  const handleInputChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const topLabel = findTopParentLabelAsString(getEdges, getNodes, id);
    console.log("Top Label: ", topLabel);
    // console.log('Top Parent Label: ', topParentLabel)
    const content = `${question} (${topLabel} - ${data.content})`
    const request = "QUESTION: " + content

    try {

      const openAIResponse = await complete(request);
      const cleanedResponse = cleanResponse(openAIResponse);
      // console.log('cleanedResponse: ', cleanedResponse)
      let parsedResponse = cleanedResponse ? JSON.parse(cleanedResponse) : {};
      
      // Iterate over each key-value pair in the response
      Object.keys(parsedResponse).forEach(mainSubject => {
          let description = parsedResponse[mainSubject];
      
          // Insert a newline and a space before the first numbered point
          description = description.replace(/(\d\.)/, '\n\n$1');
      
          // Then, ensure each subsequent numbered point is on a new line
          description = description.replace(/(\d\.)/g, '\n$1');
          
          // Updating the parsed response for each key
          parsedResponse[mainSubject] = description;
      });
        
      // Transform the parsed response into nodes and add them
      const transformedNodes = transformResponseToNodes(parsedResponse);
      transformedNodes.forEach((node) => {
        addNodes(node);
        addEdges({ id: `${id}->${node.id}`, source: id, target: node.id });

        // setPromptHistory({ ...promptHistory, [data.label]: node.id });
      });

    } catch (error) {
      console.error("Error in addChildNode: ", error);
      // Handle error appropriately
    }

  };
  
  function cleanResponse(completion) {
    if (typeof completion !== 'string') return null;
    const firstBraceIndex = completion.indexOf('{');
    return firstBraceIndex === -1 ? null : completion.slice(firstBraceIndex);
  }
  
  function transformResponseToNodes(parsedResponse) {
    return Object.entries(parsedResponse).map(([key, value], index) => ({
      id: key,
      position: { x: xPos, y: yPos + 400 }, // Example positioning
      data: { 
        label: key,
        content: value,
        expanded: true,
      }
    }));
  }

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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={question}
        onChange={handleInputChange}
        placeholder="Ask a question..."
      />
      <button type="submit">Submit</button>
    </form>
  );
};

