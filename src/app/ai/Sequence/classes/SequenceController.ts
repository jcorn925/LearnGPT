import Sequence from "./Sequence";


type ErrorHandling = {
  strategy: string;
  fallbackOutput: any;
};

type SequenceCallback = string | (() => void);

export type SequenceData = {
  id: string;
  name: string;
  description: string;
  inputVar: string;
  functionality: string;
  outputVar: string;
  errorHandling: ErrorHandling;
  timeout: number;
  retryCount: number;
  retryDelay: number;
  onStart: SequenceCallback;
  onSuccess: SequenceCallback;
  onFailure: SequenceCallback;

  currentProgress: number;
};


export default class SequenceController {
  private sequences: Map<string, Sequence>;

  constructor() {
    this.sequences = new Map();
    const rootSequenceData: SequenceData = {
      id: 'root',
      name: 'Root',
      description: 'Root node',
      inputVar: '',
      outputVar: '',
      currentProgress: 0
    };

    // Create and add the root sequence to the controller
    this.addSequence(rootSequenceData);
  }

  // Add a new sequence to the controller
  addSequence(sequenceData: SequenceData, parentId: string | null = null) {
    const sequence = new Sequence(sequenceData);
    sequence.setParentId(parentId); // Set the parentId of the sequence
    this.sequences.set(sequence.getId(), sequence);
    console.log(this.sequences);
  }

  executeMap = () => {
    this.sequences.forEach((sequence) => {
      console.log(sequence.getId(), '');
      console.log(sequence.getName(), '');
      console.log(sequence.getDescription(), '');
    });
  }

  getPreviousSequenceId(currentSequenceId: string): string | undefined {
    const currentSequenceIndex = this.sequences.findIndex((sequence) => sequence.id === currentSequenceId);
    if (currentSequenceIndex > 0) {
      return this.sequences[currentSequenceIndex - 1].id;
    }
    return undefined;
  }

  setMapSequence(newMap: Map<string, SequenceData>): void {
    // Clear the existing sequences
    this.sequences.clear();

    // Iterate over the newMap and add each sequence to the controller
    newMap.forEach((sequenceData, sequenceId) => {
      // Create a new Sequence instance from the sequence data
      const sequence = new Sequence(sequenceData);

      // Add the sequence to the controller's sequences map
      this.sequences.set(sequenceId, sequence);
    });
  }

  setRootOutputVar(outputVar: string): void {
    const rootSequence = this.getSequenceById('root');
    if (rootSequence) {
      rootSequence.setOutputVar(outputVar);
    }
  }




  executeSequenceById(sequenceId: string): Promise<any> {
    const sequence = this.getSequenceById(sequenceId);
    if (!sequence) {
      return Promise.reject(new Error(`Sequence with ID ${sequenceId} not found.`));
    }

    return this.executeSequence(sequence);
  }

  executeSequence(sequence: Sequence): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('executeSequence', sequence.getId());
      resolve(sequence.getId())
    });
  }

  serializeMap(map) {
    // Convert the Map object into an array of key-value pairs.
    // Each key-value pair is represented as an object with "key" and "value" properties.
    const keyValueArray = Array.from(map.entries()).map(([key, value]) => {
      return { key, value };
    });

    // Serialize the array of key-value pairs into a JSON string.
    // Use the third argument to specify the number of spaces for indentation.
    const jsonString = JSON.stringify(keyValueArray, null, 2);

    return keyValueArray;
  }

  getSequenceMap = () => {
    return this.sequences;
  }


  getOutputVarById(sequenceId: string): string | undefined {
    const sequence = this.getSequenceById(sequenceId);
    if (!sequence) {
      return undefined;
    }

    return sequence.getOutputVar();
  }




  findPathToSequence(sequenceId: string, parentId: string = 'root', path: Sequence[] = []): Sequence[] | null {
    if (parentId === sequenceId) {
      return path;
    }

    const children = this.getChildrenOfSequence(parentId);
    for (const child of children) {
      const newPath = this.findPathToSequence(sequenceId, child.getId(), [...path, child]);
      if (newPath) {
        return newPath;
      }
    }

    console.log(path);

    return null;
  }



  removeAllSequences() {
    this.sequences.clear();
  }

  // Remove a sequence from the controller by ID
  removeSequence(sequenceId: string): void {
    this.sequences.delete(sequenceId);
  }


  getSequenceById(sequenceId: string): Sequence | null {
    return this.sequences.get(sequenceId) || null;
  }


  // Get a sequence by ID
  getSequence(sequenceId: string): Sequence | undefined {
    return this.sequences.get(sequenceId);
  }

  // Update a sequence by ID
  updateSequence(sequenceId: string, updatedData: Partial<SequenceData>): void {
    console.log('%csequenceId', 'color: lightblue; font-size: 14px', sequenceId);
    console.log('%cupdatedData', 'color: lightblue; font-size: 14px', updatedData);
    const sequence = this.sequences.get(sequenceId);
    console.log('%csequencessssssssss', 'color: lightblue; font-size: 14px', sequence);
    if (sequence) {
      Object.assign(sequence, updatedData);
      console.log('%csequencessssssssss', 'color: lightblue; font-size: 14px', sequence);
    }
  }


  getChildSequences(parentId: string): Sequence[] {
    const childSequences: Sequence[] = [];
    for (const sequence of this.sequences) {
      if (sequence.parentId === parentId) {
        childSequences.push(sequence);
      }
    }

    return childSequences;
  }

  getChildrenOfSequence(parentId: string): Sequence[] {
    const children: Sequence[] = [];
    for (const sequence of this.sequences.values()) {
      if (sequence.getParentId() === parentId) {
        children.push(sequence);
      }
    }
    return children;
  }





}













// // Example usage
// const sequenceController = new SequenceController();

// // Add sequences to the controller
// sequenceController.addSequence({
//   id: 'sequence_image_recognition',
//   name: 'Image Recognition',
//   description: 'Identify objects in the provided image.',
//   inputVar: 'image',
//   functionality: 'objectRecognition',
//   outputVar: 'objects',
//   errorHandling: { strategy: 'continue', fallbackOutput: '[]' },
//   timeout: 5000,
//   retryCount: 3,
//   retryDelay: 1000,
//   onStart: 'sequence_before_image_recognition',
//   onSuccess: 'sequence_after_image_recognition',
//   onFailure: 'sequence_handle_image_recognition_failure',
//   currentProgress: 0
// });

// // Add more sequences as needed...

// // Execute the entire process starting from a specific sequence
// sequenceController.executeProcess('sequence_image_recognition').catch((error) => {
//   console.error('An error occurred during execution:', error);
// });

// // Update a sequence
// sequenceController.updateSequence('sequence_image_recognition', {
// name: 'New Image Recognition',
// timeout: 6000
// });

// // Remove a sequence
// sequenceController.removeSequence('sequence_image_recognition');

// // Get a sequence
// const sequence = sequenceController.getSequence('sequence_image_recognition');
// if (sequence) {
// console.log(sequence.getName());
// }

