import Sequence from "./Sequence";

class SequencePath {
  id: string;
  name: string;
  description?: string;
  sequences: { [key: string]: Sequence }
  sequencePaths: { [key: string]: SequencePath }
  suggestedSequenceInfo: any;
  pathSuggestions: any;
  parentId: string;



  constructor(id: string, name: string, description?: string, suggestedSequenceInfo?: any) {
    if (suggestedSequenceInfo && typeof suggestedSequenceInfo === 'object') {
      console.log('%csuggestedSequenceInfo', 'color: orange; font-size: 14px', suggestedSequenceInfo[Object.keys(suggestedSequenceInfo)[0]].sequence);
      suggestedSequenceInfo = suggestedSequenceInfo[Object.keys(suggestedSequenceInfo)[0]].sequence;
    } else {
      suggestedSequenceInfo = {}; // Set it to an empty object if it's null or undefined
    }

    this.id = id;
    this.name = name;
    this.description = description;
    this.sequences = suggestedSequenceInfo.sequences || {};
    this.sequencePaths = suggestedSequenceInfo.sequencePaths || {};
    this.pathSuggestions = suggestedSequenceInfo.pathSuggestions || {};
    this.parentId = suggestedSequenceInfo.parentId || '';
  }


  addSequence(sequence: Sequence) {
    this.sequences[sequence.getId()] = sequence;
  }

  addSequencePath(sequencePath: SequencePath) {
    this.sequencePaths[sequencePath.getId()] = sequencePath;
  }

  getSequences() {
    return this.sequences;
  }

  getSequencePaths() {
    return this.sequencePaths;
  }

  getId() {
    return this.id;
  }


}


export default SequencePath;