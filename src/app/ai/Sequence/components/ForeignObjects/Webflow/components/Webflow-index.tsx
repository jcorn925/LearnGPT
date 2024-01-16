import React, { useRef } from 'react';
import SequenceExplorer from '@src/components/GPTS/SequenceGPT/SequenceGpt';
import { SequenceGptProvider } from '@src/components/GPTS/SequenceGPT/GPT/Context/SequenceGptContext';
import SequencePathBubbles from '../../../SequencePathBubbles';
import SequencePathGenerator from '../../../SequencePathExplorer/SequencePaths';
import AddNode from '../../../Buttons/AddNode/AddNode';
import LiveGPT from '@src/components/GPTS/LiveGPT/GPT/gptLive-index';



export default function Webflow(
  { nodeDatum,
    toggleNode,
    nodeStyle,
    handleSetCurrentSequence,
    currentSequence,
    executeCurrentSequence,
    sequenceController,
    handleUpdateTreeData,
    setTreeData,
    handleAddChildSequence,
    handleAddPathOption,
    handleAddChildSequenceFromIdea,
    handleUpdateSequence,
    addTemplate,
    TemplateExample,
  }) {


  const parentRef = useRef(null);


  return (
    <div ref={parentRef}>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around',
          width: '100%',
          height: '100%',
          background: '#f0f0f0',
          borderRadius: '12px',
          // padding: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          ...nodeStyle
        }}
        onClick={(event) => {
          event.stopPropagation();
          handleSetCurrentSequence(nodeDatum.id);
        }}
      >
        <LiveGPT></LiveGPT>
        {/* <SequenceExplorer executeCurrentSequence={executeCurrentSequence} sequenceRef={currentSequence} open={true} toggleNode={toggleNode} /> */}

      </div>

      {/* {nodeDatum.children && (
        <button style={{ width: "100%" }}>
          {nodeDatum.__rd3t.collapsed ? "Expand" : "Collapse"}
        </button>
      )} */}

      <AddNode handleAddNode={() => handleAddChildSequence(nodeDatum.id, 'New Child', {
        "New Child": {
          "sequence": {
            "id": "97fa7fe2-6fcc-45c7-9051-50b5530ef930",
            "name": "Initial Sequence",
            "description": "Child sequence description",
            "inputVar": "",
            "functionality": "",
            "outputVar": "",
            "errorHandling": {
              "strategy": "continue",
              "fallbackOutput": "[]"
            },
            "timeout": 5000,
            "retryCount": 3,
            "retryDelay": 1000,
            "onStart": "",
          }
        }
      })}>

      </AddNode>
    </div>
  )
}