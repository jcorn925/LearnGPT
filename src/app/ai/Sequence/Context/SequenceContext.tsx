import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import SequenceController, { SequenceData } from '../classes/SequenceController';

// Define the context type


type SequenceControllerContextType = {
  sequenceController: SequenceController;
  addSequence: (sequenceData: SequenceData) => void;
  removeSequence: (sequenceId: string) => void;
  executeProcess: (startSequenceId: string) => void;
};

// Create the context
const SequenceControllerContext = createContext<SequenceControllerContextType | undefined>(undefined);

// Define the context provider component
export const SequenceControllerProvider = ({ children }) => {

  const sequenceController = useRef(new SequenceController()).current;

  const outputHistory = useRef({}).current

  const [currentPassDownValue, setCurrentPassDownValue] = useState<string>('');

  const [currentSequence, setCurrentSequence] = useState<SequenceData | undefined>(undefined);

  const addSequence = (sequenceData: SequenceData) => {
    sequenceController.addSequence(sequenceData);
  };

  const removeSequence = (sequenceId: string) => {
    sequenceController.removeSequence(sequenceId);
  };


  const handleSetCurrentSequence = (sequenceId: string) => {
    const sequence = sequenceController.getSequenceById(sequenceId);
    setCurrentSequence(sequence);
  };

  const executeCurrentSequence = () => {
    if (currentSequence) {
      const retreivedSequence = sequenceController.getSequenceById(currentSequence.id)
      const inputPassDown = outputHistory[currentSequence.getParentId()]?.[0] || currentPassDownValue

      const parentSequence = sequenceController.getSequenceById(currentSequence.getParentId())
      const parentOutput = parentSequence?.getOutputVar()


      console.log('%cinputPassDown', 'color: lightblue; font-size: 14px', inputPassDown);
      retreivedSequence?.execute(parentOutput).then((result) => {
        outputHistory[currentSequence.id] = [result, ...outputHistory[currentSequence.id] || []]
        // currentSequence.setOutputVar(result);
        console.log('%cresult', 'color: lightblue; font-size: 14px', result);
      });


      console.log('%cretreivedSequence', 'color: lightblue; font-size: 14px', retreivedSequence);
    }
  };


  useEffect(() => {
    console.log('%coutputHistory', 'color: lightblue; font-size: 14px', outputHistory);
  }, [currentSequence]);



  const getSequenceById = (sequenceId: string) => {
    return sequenceController.getSequenceById(sequenceId);
  };

  const printInfo = () => {
    console.log('%csequenceController ', 'color: lightblue; font-size: 14px', sequenceController);
  };

  const getOutputVar = (parentId) => {
    return sequenceController.getSequenceById(parentId)?.getOutputVar();
  };





  return (
    <SequenceControllerContext.Provider
      value={{
        sequenceController,
        addSequence,
        removeSequence,
        getOutputVar,
        getSequenceById,
        currentPassDownValue,
        printInfo,
        handleSetCurrentSequence,
        executeCurrentSequence

      }}
    >
      {children}
    </SequenceControllerContext.Provider>
  );
};

// Custom hook to use the SequenceController context
export const useSequenceController = () => {
  const context = useContext(SequenceControllerContext);
  if (!context) {
    throw new Error('useSequenceController must be used within a SequenceControllerProvider');
  }
  return context;
};