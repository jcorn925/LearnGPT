import StorageOps from '@src/Utils/LocalStorage/StorageOps';
import React, { useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import { v4 as uuidv4 } from 'uuid';
import { useSequenceController } from './Context/SequenceContext';
import './Sequence.scss';
import SequencePath from './classes/SequencePath';
import TreeControlBar from './components/Controlbar/ControlBar-index';
import Default from './components/ForeignObjects/Default/components/Default-index';
import Explorer from './components/ForeignObjects/Explorer/components/Explorer-index';
import NodeInfo from './components/ForeignObjects/NodeInfo/components/NodeInfo-index';
import { SequenceTabsParent } from './components/Tabs/SequenceTabs-index';
import { useSequenceLoader } from './hooks/useSequenceLoader';
import { useSequenceOperations } from './hooks/useSequenceOperations';

import { useGlobalContext } from '@Context/Global/GlobalProvider';

type TreeNode = {
  id: string;
  name: string;
  description: string;
  processName: string; // New property to distinguish sequences with unique processes
  children?: TreeNode[];
};

const SequenceControllerComponent = () => {

  const {
    sequenceController,
    printInfo,
    executeCurrentSequence,
    handleSetCurrentSequence,

  } = useSequenceController();





  const [currentSequenceId, setCurrentSequenceId] = useState<string | null>(null);
  const [currentSelectedNodeId, setCurrentSelectedNodeId] = useState(null);
  const [currentName, setCurrentName] = useState(null);

  const handleNameChange = (e) => {
    setCurrentName(e.target.value);
  };

  const [siblingSeperation, setSiblingSeperation] = useState<number>(1.5);
  const [depthFactor, setDepthFactor] = useState<number>(800);
  const [pathOptions, setPathOptions] = useState<SequencePath[]>([]);
  const [inverted = false, setInverted] = useState<boolean>(false);

  const [size, setSize] = useState({ width: 600, height: 700 });

  const {
    currentTemplate,
    theme = 'light', // Set the default theme to 'light'
  } = useGlobalContext();

  const [treeData, setTreeData] = useState<TreeNode>({
    id: 'root',
    name: '',
    description: '',
    processName: '',
    //@ts-ignore
    sequence: {
      "id": "97fa7fe2-6fcc-45c7-9051-50b5530ef930",
      "name": "Initial Sequence",
      "description": "Child sequence description",
      "inputVar": "",
      "functionality": "",
      "outputVar": "output var filler",
      "currentProgress": 0
    },
  });

  const sequenceStateIdRef = React.useRef<string | null>();
  useEffect(() => {
    if (!sequenceStateIdRef.current) {
      sequenceStateIdRef.current = uuidv4();
    }
  }, []);


  const {
    saveAppState,
    saveTreeDataToFile,
    loadTreeDataFromFile,
  } = useSequenceLoader(sequenceController, treeData, setTreeData);

  const {
    findNodeById,
    searchSequences,
    findParentNodeById,
    handleUpdateSequence,
    handleUpdateTreeData,
    handleRemoveSequence,
    handleAddChildSequence,
    handleAddChildSequenceFromIdea
  } = useSequenceOperations(sequenceController, treeData, setTreeData);

  const [executionStatus, setExecutionStatus] = useState('stopped');
  const [executionPath, setExecutionPath] = useState<string[]>([]);
  const [executionStep, setExecutionStep] = useState(0);


  const [translate, setTranslate] = useState({
    x: 20,
    y: 50
  });

  useEffect(() => {
    const handleResize = () => {
      setTranslate({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      });
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  // Inspect Sequence Data
  const inspectSequenceData = (sequenceId: string) => {
    const sequence = sequenceController.getSequenceById(sequenceId);
    console.log(sequence);
  };

  useEffect(() => {
    if (executionStatus === 'running' && executionStep < executionPath.length - 1) {
      const timer = setTimeout(() => {
        setExecutionStep((prevStep) => prevStep + 1);
      }, 1000); // Delay between steps
      return () => clearTimeout(timer);
    }
  }, [executionStatus, executionStep, executionPath]);



  const handleAddPathOption = (pathOption: SequencePath) => {
    setPathOptions((prevPathOptions) => [...prevPathOptions, pathOption]);
  };


  const CustomNode = ({ nodeDatum, toggleNode, foreignObjectProps }) => {


    const isCurrentSequence = nodeDatum.id === currentSequenceId;
    const isInExecutionPath = executionPath.includes(nodeDatum.id);
    const currentSequence = sequenceController.getSequenceById(nodeDatum.id);
    const isCurrentSelectedNode = nodeDatum.id === currentSelectedNodeId;

    const nodeStyle = isCurrentSelectedNode
      ? {
        fill: '#448fcb',
        border: '1px solid #448fcb',
        animation: 'border-fill s linear forwards',
      }
      : { fill: 'white', };

    const nodeColor = isCurrentSequence
      ? 'red'
      : isInExecutionPath
        ? 'green'
        : 'white';

    const borderColor = isInExecutionPath ? 'purple' : 'none';



    return (
      <g
        style={nodeStyle}
        onClick={(event) => {
          event.stopPropagation();
          handleSetCurrentSequence(nodeDatum.id);
          StorageOps.setCurrentSelectedNodeId(nodeDatum.id);
          setCurrentSelectedNodeId(nodeDatum.id);
        }}
      >


        <circle r={15}>{nodeDatum.name}</circle>
        <text style={{ fontSize: '26px', fill: nodeColor, stroke: borderColor, strokeWidth: 1 }} y={-5} x={-350} textAnchor="left">{nodeDatum.name}</text>


        {/* Render the node's process name */}
        {/*
        <foreignObject y={-5} x={-350}  width={700} height={30}>
          <div style={{ height: '30px', width: '100%', backgroundColor: 'white',  }}>
          <input className="nameInput" type="text" defaultValue={nodeDatum.name} id={`name-${nodeDatum.id}`} />
          </div>
        </foreignObject> */}


        <foreignObject {...foreignObjectProps} x={-350} y={20} width={700} height={600} style={{ transform: inverted ? "scaleY(-1)" : "none", overflow: 'visible', nodeStyle }} >
          <SequenceTabsParent>
            <Default

              nodeDatum={nodeDatum}
              toggleNode={toggleNode}
              currentSequence={currentSequence}
              sequenceController={sequenceController}
              handleSetCurrentSequence={handleSetCurrentSequence}
              executeCurrentSequence={executeCurrentSequence}
              handleUpdateTreeData={handleUpdateTreeData}
              handleAddPathOption={handleAddPathOption}
              setTreeData={setTreeData}
              nodeStyle={nodeStyle}
              handleAddChildSequence={handleAddChildSequence}
              handleAddChildSequenceFromIdea={handleAddChildSequenceFromIdea}
            />

            <NodeInfo
              nodeDatum={nodeDatum}
              toggleNode={toggleNode}
              handleUpdateSequence={handleUpdateSequence}
              currentSequence={currentSequence}
              sequenceController={sequenceController}
              handleSetCurrentSequence={handleSetCurrentSequence}
              executeCurrentSequence={executeCurrentSequence}
              handleUpdateTreeData={handleUpdateTreeData}
              handleAddPathOption={handleAddPathOption}
              setTreeData={setTreeData}
              nodeStyle={nodeStyle}
              handleAddChildSequence={handleAddChildSequence}
              handleAddChildSequenceFromIdea={handleAddChildSequenceFromIdea}
            />
            <Explorer
              nodeDatum={nodeDatum}
              toggleNode={toggleNode}
              currentSequence={currentSequence}
              sequenceController={sequenceController}
              handleSetCurrentSequence={handleSetCurrentSequence}
              executeCurrentSequence={executeCurrentSequence}
              handleUpdateTreeData={handleUpdateTreeData}
              handleAddPathOption={handleAddPathOption}
              setTreeData={setTreeData}
              nodeStyle={nodeStyle}
              handleAddChildSequence={handleAddChildSequence}
              handleAddChildSequenceFromIdea={handleAddChildSequenceFromIdea}
            />
          </SequenceTabsParent>
        </foreignObject>

        {/* <foreignObject {...foreignObjectProps} x={-350} y={20} width={700} height={600} style={{ transform: inverted ? "scaleY(-1)" : "none", overflow: 'visible', nodeStyle }} >
          <SequencePathBubbles currentSequence={currentSequence} handleAddChildSequenceFromIdea={handleAddChildSequenceFromIdea} nodeId={nodeDatum.id} />
        </foreignObject> */}

      </g >
    )
  }


  const pathStyle = {
    strokeWidth: '1px',
    stroke: '#000',
    strokeLinecap: 'round',
    color: 'white',
    transition: 'stroke-dashoffset 1s ease-in-out',
  };



  const handleNodeClick = (event, data) => {
    console.log(`Node ${data.name} clicked`);
  };

  const handleNodeMouseover = (event, data) => {
    console.log(`Mouseover on node ${data.name}`);
  };

  const handleNodeMouseout = (event, data) => {
    console.log(`Mouseout of node ${data.name}`);
  };

  const themes = {
    light: {
      backgroundImage: `-webkit-repeating-radial-gradient(center center, rgba(105, 105, 105, 0.80), rgba(169, 169, 169, 0.19) 1px, transparent 1px, transparent 100%)`
    },
    dark: {
      backgroundImage: `-webkit-repeating-radial-gradient(center center, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.19) 1px, transparent 1px, transparent 100%)`

    }
  }



  const nodeSize = { x: 200, y: 200 };


  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: 20, stroke: 'white', strokeWidth: '.5px', y: 20, style: { overflow: 'visible' } };


  return (
    <div style={{ width: '100vw', height: '100vh',  }}>


      <TreeControlBar
        setSiblingSeperation={setSiblingSeperation}
        printInfo={printInfo}
        siblingSeperation={siblingSeperation}
        saveTreeDataToFile={saveTreeDataToFile}
        setInverted={setInverted}
        inverted={inverted}
        depthFactor={depthFactor}
        setDepthFactor={setDepthFactor}
        loadTreeDataFromFile={loadTreeDataFromFile}
      ></TreeControlBar>


      <div style={{ width: '100%', height: '100vh', backgroundColor: theme, }}>
        <div
          className='treeWrapper'
          style={{
            width: "100%",
            height: "100%",
            transform: inverted ? "scaleY(-1)" : "none",
            backgroundImage: themes[theme].backgroundImage
          }}
        >
          <Tree
            data={treeData}
            enableLegacyTransitions
            translate={{ x: 500, y: 50 }}
            nodeSize={{ x: 1000, y: 500 }}
            separation={{ siblings: siblingSeperation, nonSiblings: 2 }} // Adjust the value of 'siblings' to control the separation between sibling nodes
            depthFactor={depthFactor}
            allowForeignObjects={true}
            transitionDuration={200}
            transitionEasing="ease-in"
            renderCustomNodeElement={(rd3tProps) =>
              CustomNode({ ...rd3tProps, foreignObjectProps })
            }
            pathFunc="step"
            orientation="vertical"
            onNodeClick={handleNodeClick}
            hasInteractiveNodes={true}
            onNodeMouseover={handleNodeMouseover}
            onNodeMouseout={handleNodeMouseout}
            pathClassFunc={() => 'custom-link'}
            styles={{
              links: pathStyle,

              nodes: {
                node: {
                  circle: {
                    fill: 'white',
                    stroke: 'white',
                  },
                  name: {
                    fontSize: 16,
                    fill: 'white',
                  },
                  attributes: {
                    fontSize: 14,
                    fill: 'white',
                  },
                },
                leafNode: {
                  circle: {
                    fill: 'white',
                    stroke: 'white',
                  },
                  name: {
                    fontSize: 16,
                    fill: 'white',
                    stroke: 'none',
                  },
                  attributes: {
                    fontSize: 14,
                    fill: 'white',

                  },
                },
              },
            }}
            collapsible={true}
            nodeSvgShape={{
              shape: 'circle',
              shapeProps: {
                r: 15,
              },
            }}
          />
        </div>

        <div>

        </div>
      </div>
    </div>
  );
};

export default SequenceControllerComponent;

