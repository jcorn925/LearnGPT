import React, { useRef } from 'react';
import SequenceExplorer from '@src/components/GPTS/SequenceGPT/SequenceGpt';
import { SequenceGptProvider } from '@src/components/GPTS/SequenceGPT/GPT/Context/SequenceGptContext';
import SequencePathBubbles from '../../../SequencePathBubbles';
import SequencePathGenerator from '../../../SequencePathExplorer/SequencePaths';
import AddNode from '../../../Buttons/AddNode/AddNode';
import { useState, useEffect } from 'react';
import { SearchIcon } from '@primer/octicons-react';
import styles from './Explorer.module.scss'
import ErrorBoundary from '../../../SequencePathExplorer/ErrorBoundary';


export default function Explorer(
  { nodeDatum,
    nodeStyle,
    toggleNode,
    setTreeData,
    addTemplate,
    TemplateExample,
    currentSequence,
    sequenceController,
    handleAddPathOption,
    handleUpdateSequence,
    handleUpdateTreeData,
    handleAddChildSequence,
    handleSetCurrentSequence,
    handleAddChildSequenceFromIdea,
  }) {

  const [triggered, setTriggered] = useState(false)

  const parentRef = useRef(null);


  return (
    <div className={styles['Explorer__wrapper']} ref={parentRef}>
      {/* {nodeDatum.children && (
        <button style={{ width: "100%" }} onClick={toggleNode}>
          {nodeDatum.__rd3t.collapsed ? "Expand" : "Collapse"}
        </button>
      )} */}
      <div >
        <div
          className={styles['Explorer__node__container']}
          style={{
            ...nodeStyle
          }}
          onClick={(event) => {
            event.stopPropagation();
            handleSetCurrentSequence(nodeDatum.id);
          }}>

          <text x={-25} y={5} fill="black" />

          <SequenceGptProvider>
            <SequencePathBubbles currentSequence={currentSequence} handleAddChildSequenceFromIdea={handleAddChildSequenceFromIdea} nodeId={nodeDatum.id} />
            <ErrorBoundary>
              <SequencePathGenerator
                sequenceRef={currentSequence}
                sequenceController={sequenceController}
                nodeId={nodeDatum.id}
                handleTreeDataUpdate={handleUpdateTreeData}
                setTreeData={setTreeData}
                trigger={triggered}
                handleAddChildSequence={handleAddChildSequence}
                handleAddPathOption={handleAddPathOption}
              />
            </ErrorBoundary>

          </SequenceGptProvider>

        </div>
      </div>



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