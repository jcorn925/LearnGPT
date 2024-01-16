
import SequencePath from "../classes/SequencePath";
import Sequence from "../classes/Sequence";
import SequenceAppState from "../classes/SequenceAppState";
import StorageOps from "@src/Utils/LocalStorage/StorageOps";

export function useSequenceLoader(sequenceController, treeData, setTreeData) {

  const saveTreeDataToFile = async (downloadFile: boolean) => {
    // Get the map sequence from the sequenceController
    const mapSequence = sequenceController.getSequenceMap();
    const serializedMapSequence = sequenceController.serializeMap(mapSequence);
    console.log('%cmapSequence', 'color: lightblue; font-size: 14px', mapSequence);

    // Convert the tree data and map sequence to JSON format
    const jsonData = {
      treeData: await treeDataToJSON(treeData),
      mapSequence: serializedMapSequence,
    }



    console.log('%cjsonData', 'color: lightblue; font-size: 44px', sequenceController, treeData, );
    console.log('%cjsonData', 'color: lightblue; font-size: 44px', jsonData);

    const blob = new Blob([JSON.stringify(jsonData)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "sequences.json";
    console.log(link);
    link.click()

    URL.revokeObjectURL(url);
  };


  const saveAppState = async () => {
    const mapSequence = sequenceController.getSequenceMap();
    const serializedMapSequence = sequenceController.serializeMap(mapSequence);
    console.log('%cmapSequence', 'color: lightblue; font-size: 14px', mapSequence);

    // Convert the tree data and map sequence to JSON format
    const jsonData = {
      treeData: treeDataToJSON(treeData),
      mapSequence: serializedMapSequence,
    }
    const appState = await SequenceAppState.saveAppState(jsonData)
    console.log('%cappState', 'color: lightblue; font-size: 14px', appState);

  }

  const treeDataToJSON = async (node) => {
    // Retrieve the sequence object from the sequenceController
    const sequence = sequenceController.getSequenceById(node.id);

    const jsonNode = {
      id: node.id,
      name: node.name || null,
      description: node.description || null,
      processName: node.processName || null,
      outputVar: node.sequence?.outputVar || null,
      sequence: sequence,
    };


    console.log('%c Node', 'color: orange; font-size: 44px', node);

    // Add children and sequencePaths attributes if they exist
    if (node.children) {
      jsonNode.children = [];
      for (const child of node.children) {
        jsonNode.children.push(await treeDataToJSON(child));
      }
    }
    if (node.sequence && node.sequence.sequencePaths) {
      jsonNode.sequence.sequencePaths = node.sequence.sequencePaths;
    }

    // Retrieve the templates for the node
    jsonNode.templates = await getTemplatesForNodeId(node.id);

    return jsonNode;
  };


  const getTemplatesForNodeId = async (nodeId) => {
    let nodeTemplates = await StorageOps.getAllTemplatesForNode(nodeId)
    return nodeTemplates
  }



  const deserializeSequencePath = (sequencePathData) => {
    const sequencePath = new SequencePath(sequencePathData.id, sequencePathData.name, sequencePathData.description);

    if (sequencePathData.sequences && typeof sequencePathData.sequences === 'object') {
      for (const seqKey in sequencePathData.sequences) {
        sequencePath.addSequence(deserializeSequences(sequencePathData.sequences[seqKey]));
      }
    }

    if (sequencePathData.sequencePaths && typeof sequencePathData.sequencePaths === 'object') {
      for (const seqPathKey in sequencePathData.sequencePaths) {
        sequencePath.addSequencePath(deserializeSequencePath(sequencePathData.sequencePaths[seqPathKey]));
      }
    }

    return sequencePath;
  };

  const deserializeSequences = (sequenceData) => {
    const sequence = new Sequence(sequenceData);

    if (sequenceData.sequencePaths && typeof sequenceData.sequencePaths === 'object') {
      for (const key in sequenceData.sequencePaths) {
        const sequencePathData = sequenceData.sequencePaths[key];
        const sequencePath = deserializeSequencePath(sequencePathData);
        sequence.addSequencePath(sequencePath);
      }
    }

    return sequence;
  };


  const loadTreeDataFromFile = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const jsonData = event.target.result;
        const loadedData = JSON.parse(jsonData);

        // Extract treeData and mapSequence from the loaded data
        const { treeData, mapSequence } = loadedData;

        // Add the sequences to the SequenceController
        const addSequencesToController = (node) => {
          // Skip the root node, as it does not have an associated sequence
          if (node.id !== 'root' && node.sequence) {
            const sequence = deserializeSequences(node.sequence);
            sequenceController.addSequence(sequence);
          }

          if (node.children) {
            node.children.forEach(addSequencesToController);
          }
        };
        addSequencesToController(treeData);

        // Update the treeData state
        setTreeData(treeData);

        // Update the mapSequence in the SequenceController
        if (mapSequence) {
          const deserializedMap = new Map(mapSequence.map(({ key, value }) => [key, value]));
          sequenceController.setMapSequence(deserializedMap);

          // Populate sequencePaths for each sequence using mapSequence
          for (const { key, value } of mapSequence) {
            const sequence = sequenceController.getSequenceById(key);
            if (sequence && value.sequencePaths && typeof value.sequencePaths === 'object') {
              for (const pathKey in value.sequencePaths) {
                const sequencePathData = value.sequencePaths[pathKey];
                const sequencePath = deserializeSequencePath(sequencePathData);
                sequence.addSequencePath(sequencePath);
              }
            }
          }
        }
      };
      reader.readAsText(file);
    }
  };


  return { saveTreeDataToFile, loadTreeDataFromFile, saveAppState }


}