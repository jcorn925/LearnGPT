import React, { useState, useEffect, useRef, memo } from "react";
import { useSequenceGpt } from "@src/components/GPTS/SequenceGPT/GPT/Context/SequenceGptContext";
import SequenceGPTQueryPlain, { QueryStatus } from "@src/components/GPTS/SequenceGPT/GPT/components/Prompt/SequenceGPTPlain";
import Controls from "@src/components/GPTS/SequenceGPT/GPT/components/Controls/controls-index";
import SequenceGenerator from "../../classes/SequenceGenerator";
import SequenceParser from "../../classes/SequenceParser";
import { v4 as uuid } from 'uuid';
import IdeasList from "../IdeaList";
import { SearchIcon } from "@primer/octicons-react";
import SequencePath from "../../classes/SequencePath";
import Trigger from "../Buttons/Triggers/Trigger-index";
import styles from './SequencePath.module.scss'
import SequencePathBubbles from "../SequencePathBubbles";
import PathControls from "@src/components/GPTS/SequenceGPT/GPT/components/Controls/PathControls-index";
import ErrorBoundary from "./ErrorBoundary";


const SequencePathGenerator = memo(({ sequenceRef, nodeId, handleAddChildSequence, sequenceController, ideas, node, handleAddPathOption }) => {


  const [queryStatus, setQueryStatus] = useState<QueryStatus>()
  const [triggered, setTriggered] = useState(false)
  const [ingestionData, setIngestionData] = useState([])
  const [sequences, setSequences] = useState([]);

  const [initTrigger, setInitTrigger] = useState(false);

  const [currentSequencePathInfo, setCurrentSequencePathInfo] = useState([]);

  const {
    done,
    answer,
    setDone
  } = useSequenceGpt()


  // take in the data and then parse it and then set the state of the currentSequencePathInfo
  useEffect(() => {
    if (done) {
      setIngestionData((prev) => [...prev, answer.text]);
      let jsonData
      try {
        jsonData = JSON.parse(answer.text);
      } catch (error) {
        console.log(error);
      }
      setCurrentSequencePathInfo(jsonData);
      // handleAddChildSequence(nodeId, 'new Child son', answer.text);
      setDone(false);
      let sequence = sequenceController.getSequenceById(nodeId);
      console.log(answer);

    }
  }, [done]);


  // Once the currentSequencePathInfo is set, then we can map over it and add the children to the Tree based on the data that is set.
  useEffect(() => {
    let sequence = sequenceController.getSequenceById(nodeId);
    if (currentSequencePathInfo.length > 0) {
      for (let i = 0; i < currentSequencePathInfo.length; i++) {
        const suggestedSequences = currentSequencePathInfo[i];
        let sequencePath;
        for (let [key, value] of Object.entries(suggestedSequences)) {
          let path = value.sequence
          console.log(path, 'path that is being added');
          sequencePath = new SequencePath(uuid(), path.name, path.description, suggestedSequences)
        }
        sequence.addSequencePath(sequencePath as SequencePath);
      }
      // handleAddChildSequence(nodeId, 'new Child son', ingestionData);
    }
  }, [currentSequencePathInfo]);


  useEffect(() => {
    // console.log('%c IngestionsData', 'color: orange; font-size: 14px', ingestionData);
  }, [currentSequencePathInfo, ingestionData]);

  function handlePathClick(e) {
    console.log('handlePathClick');
  }

  return (
    <div className={styles['SequenceExplorer__container']} >
      {node && <Node nodeData={node} onExploreIdea={handlePathClick} handleAddPathOption={handleAddPathOption} />}

      {triggered &&
        <SequenceGPTQueryPlain
          question={SequenceGenerator.generateSequenceFromIdeas(sequenceController.getSequenceById(nodeId)?.description ? sequenceController.getSequenceById(nodeId).description : [])}
          onStatusChange={setQueryStatus}
        />
      }
      {!initTrigger && <Trigger currentNodeTopic={'topic'} setTriggered={setTriggered} setInitTrigger={setInitTrigger}></Trigger>}


      <PathControls handleAddChildSequence={handleAddChildSequence} setTriggered={setTriggered}></PathControls>
    </div>
  );

});

export default SequencePathGenerator;



function Node({ nodeData, handleAddPathOption }) {
  const { name, description, processName, sequence, __rd3t } = nodeData

  return (
    <div>
      <h2>{name || 'Unknown Name'}</h2>

      {nodeData.pathSuggestions ? <PathList paths={nodeData.pathSuggestions} handleAddPathOption={handleAddPathOption}> </PathList> : null}

      <div>SequencePaths: {JSON.stringify(nodeData.pathSuggestions)}</div>

      <div>Sequence:</div>
      <ul>
        <li>ID: {sequence?.id || 'Unknown ID'}</li>
        <li>Description: {sequence?.description || 'No Description'}</li>
        <li>InputVar: {sequence?.inputVar || 'No InputVar'}</li>
        <li>Functionality: {sequence?.functionality || 'No Functionality'}</li>
        <li>OutputVar: {sequence?.outputVar || 'No OutputVar'}</li>


        <li>CurrentProgress: {sequence?.currentProgress || 'No CurrentProgress'}</li>
      </ul>
      <div>Rd3t: {__rd3t?.id || 'Unknown ID'}</div>
    </div>
  );
}



function PathList({ paths, handleAddPathOption }) {
  return (
    <div>
      {Object.keys(paths).map((key, index) => (
        <div key={index}>
          <span >{key}</span>
          <p onClick={() => { handleAddPathOption(paths[key]) }}>{paths[key]}</p>
        </div>
      ))}
    </div>
  );
}