'use client'

import { MouseEventHandler, useEffect, useState } from 'react';
import { Handle, NodeProps, Position, useReactFlow } from 'reactflow';
import { useCompletion } from 'ai/react';
import 'reactflow/dist/style.css';
import styles from './styles.module.css';
import NodeInput from './NodeInput'; 
import Examples from './Examples'

type GetLabelParams = {
  expanded: boolean;
  expandable: boolean;
};

export default function CustomNode({ data, id, xPos, yPos }: NodeProps) {
  const { complete, isLoading, completion } = useCompletion();  
  const { addNodes, addEdges, getEdges, getNodes, setNodes } = useReactFlow();
  const fetch = require('node-fetch');
  const [imageUrl, setImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState('Description'); // Default to 'Description' tab
  const [topParentLabel, setTopParentLabel] = useState('');

  // this function returns the label for the node based on the current state
  // function getLabel({ expanded, expandable }: GetLabelParams): string {
  //   if (!expandable) {
  //     return 'nothing to expand';
  //   }
  //   return expanded ? 'Click to collapse ▲' : 'Click to expand ▼';
  // }

  function encloseWithBraces(response) {
  if (typeof response !== 'string') {
      // Optional: handle non-string input gracefully
      console.error("Input is not a string.");
      return null;
  }

    return `{${response}}`;
  }

  useEffect(() => {
    console.log("Completion: ", completion);
    const input = cleanResponse(completion) ? completion : encloseWithBraces(completion);
    let cleanedResponse = cleanResponse(input);
    console.log("cleaned response: ", cleanedResponse);
      
      try {
        console.log('cleanedResponse: ', cleanedResponse)
        const parsedResponse = cleanedResponse ? JSON.parse(cleanedResponse) : {};
          
        // Transform the parsed response into nodes and add them
        const transformedNodes = transformResponseToNodes(parsedResponse);
        transformedNodes.forEach((node) => {
          addNodes(node);
          addEdges({ id: `${id}->${node.id}`, source: id, target: node.id });

          // setPromptHistory({ ...promptHistory, [data.label]: node.id });
        });
      } catch (error) {
        console.error("Error in addChildNode: ", error);
      }
    }, [completion]);

  const addChildNode = async (subCategory) => {
    if (!subCategory) return;

    // // prevent the expand/collapse behaviour when a new node is added while the
    // // node is expanded
    // if (data.expanded) {
    //   evt.preventDefault();
    //   evt.stopPropagation();
    // }

    const topLabel = findTopParentLabelAsString(getEdges, getNodes, id);
    // console.log('Top Parent Label: ', topParentLabel)
    const content = `(${topLabel}) ${subCategory.name}: ${subCategory.description}`;
    // const request = `${content}`
    await complete(content);
  };
  
  function cleanResponse(completion) {
    if (typeof completion !== 'string') return null;
    const firstBraceIndex = completion.indexOf('{');
    return firstBraceIndex === -1 ? null : completion.slice(firstBraceIndex);
  }
  
  function transformResponseToNodes(parsedResponse) {
    return Object.entries(parsedResponse).map(([key, value], index) => {
      // Extract description and subcategories
      const description = value.description || '';
      const subCategories = value.subCategories || [];
  
      return {
        id: key,
        position: { x: xPos, y: yPos + 500 }, // Example positioning
        data: {
          label: key,
          description: description,
          subCategories: subCategories.map(subCat => ({
            name: subCat.name,
            description: subCat.description
          })),
          expanded: true,
        }
      };
    });
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
            setTopParentLabel(topParentNode ? topParentNode.data.label : "");
            topLabel = topParentNode ? topParentNode.data.label : "";
            break; // Exit the loop
        }
    }
    return `${topLabel}`;
  }

 // set Image of node
  useEffect(() => {
    const topLabel = findTopParentLabelAsString(getEdges, getNodes, id);
    // console.log('Top Label: ', topParentLabel);
    const searchQuery = data.label !== topLabel ? `${data.label} ${topLabel}` : data.label;
    console.log("Search Query: ", searchQuery)
    const fetchAndSetImageUrl = async () => {
      try {
        const response = await fetch('/api/fetchImageURL', {
          method: 'POST',  // Specify the method as POST
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ searchQuery: searchQuery })  // Stringify the body
        });
        console.log("response: ", response)

        const result = await response.json();
        // console.log("result: ", result)
        updateNodeData(result.firstImageUrl);

      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    if (data.label) {
      fetchAndSetImageUrl();
    }
  }, [data.label]);

  const updateNodeData = (imageURL) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === id) {
          // Extract the first key-value pair          
          // Extract description and subCategories
          const imageUrl = imageURL || '';
  
          return {
            ...node,
            data: {
              ...node.data,
              image: imageUrl
            },
          };
        }
        return node;
      })
    );
  };

  const handleExamplesTabClick = async () => {
    setActiveTab("Examples");
  }; 

  // const label = getLabel(expanded, expandable);

  return (
    <div className="w-[500px] h-[auto] bg-white z-[50]">
      <div className={styles.label}>{data.Label}</div>

      <Handle position={Position.Top} type="target" />
      <Handle position={Position.Bottom} type="source" />

      <div className={styles.tabsContainer}>
        <div className={`${styles.tab} ${activeTab === 'Description' ? styles.activeTab : ''}`}
             onClick={() => setActiveTab('Description')}>
          Description
        </div>
        <div className={`${styles.tab} ${activeTab === 'Examples' ? styles.activeTab : ''}`}
             onClick={handleExamplesTabClick}>
          Examples
        </div>
      </div>

      {activeTab === 'Description' && (
        <div className={styles.content} style={{ height: 'auto' }}>
          {data.image && <img src={data.image} alt={data.label} style={{ width: '100%', height: '30vh' }} />}
          <NodeInput
            data={data}
            id={id}
            handleSubCategoryClick={addChildNode} 
          />
        </div>
      )}

      {activeTab === 'Examples' && (
        <div className={styles.content}>
          <Examples 
            data={data}
            id={id} 
          />
        </div>
      )}
      {isLoading ? (
        <div>Loading...</div> // Display loading indicator
        ) : (
        null
      )}
    </div>
  );
}

// adjust the route to not return duplicate sub-categories

// adjust the component to send the parent subject of the node with

// add error handling for timeouts

// reset when a new top prompt is given (same as refresh)

// ability to minimize extended nodesubject

// error handling for when an Image isn't present

// slideshow for multiple images

// add an option to see an example of each

// prevent an image from being displayed twice

// include section with links to youtube videos

// option to delete a node

// set topParentLabel in state the first time to function is ran

// transfer image grabbing for example to a useEffect

// add examples property on node data instead of using state

// make add node data format more consistent

// <div className={styles.button} onClick={addChildNode}>
// + Go Deeper
// </div>




// image slideshow
// profiles
