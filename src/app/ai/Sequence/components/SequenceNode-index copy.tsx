import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library to generate unique IDs

type SequenceData = {
  id: string;
  name: string;
  description: string;
  // ... (other properties)
};

type SequenceComponentProps = {
  sequenceData: SequenceData;
  onRemove: () => void;
  onExecute: () => void;
};

const SequenceComponent: React.FC<SequenceComponentProps> = ({ sequenceData, onRemove, onExecute }) => {
  const [childSequences, setChildSequences] = useState<SequenceData[]>([]);
  const [newChildName, setNewChildName] = useState('');

  const [lineCoordinates, setLineCoordinates] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);

  const handleAddChildSequence = () => {
    const newChildSequence: SequenceData = {
      id: uuidv4(), // Generate a unique ID for the new child sequence
      name: newChildName,
      description: 'Child sequence description',
      // ... (other properties with default values)
    };
    setChildSequences((prevChildSequences) => [...prevChildSequences, newChildSequence]);
    setNewChildName(''); // Clear the input field

    const parentCoordinates = { x: 0, y: 0 }; // Replace with the actual parent coordinates
    const childCoordinates = { x: 100, y: 100 }; // Replace with the actual child coordinates
    const newLineCoordinates = {
      x1: parentCoordinates.x,
      y1: parentCoordinates.y,
      x2: childCoordinates.x,
      y2: childCoordinates.y,
    };
    setLineCoordinates((prevLineCoordinates) => [...prevLineCoordinates, newLineCoordinates]);




  };

  const handleRemoveChildSequence = (childSequenceId: string) => {
    setChildSequences((prevChildSequences) =>
      prevChildSequences.filter((seq) => seq.id !== childSequenceId)
    );
  };

  return (
    <div className="sequence-node">
      <div className="sequence-content">
        <h3>{sequenceData.name}</h3>
        <p>{sequenceData.description}</p>
        <button onClick={onRemove}>Remove Sequence</button>
        <button onClick={onExecute}>Execute Sequence</button>
      </div>
      {/* Render form for adding child sequences */}
      <div className="sequence-add-child-form">
        <input
          type="text"
          value={newChildName}
          onChange={(e) => setNewChildName(e.target.value)}
          placeholder="Child sequence name"
        />
        <button onClick={handleAddChildSequence}>Add Child Sequence</button>
      </div>
      {/* Render child sequence components */}
      <div className="sequence-children">
        {childSequences.map((childSequenceData) => (
          <div key={childSequenceData.id} className="child-container">
            <div className="connector"></div>
            <SequenceComponent
              sequenceData={childSequenceData}
              onRemove={() => handleRemoveChildSequence(childSequenceData.id)}
              onExecute={() => console.log(`Executing child sequence: ${childSequenceData.name}`)}
            />
          </div>
        ))}
      </div>
      {/* Add styles for the tree structure */}
      <style jsx>{`
        .sequence-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #000;
          background-color: #f0f0f0;
          margin: 10px;
          padding: 10px;
        }
        .sequence-content {
          text-align: center;
        }
        .sequence-add-child-form {
          margin-top: 10px;
        }
        .sequence-children
        {
          display: flex;
          margin-top: 10px;
          position: relative;
          }
          .child-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: fadeIn 0.5s ease-in;
          }
          .connector {
          width: 2px;
          height: 20px;
          background-color: #000;
          margin-bottom: 10px;
          }
          @keyframes fadeIn {
          from {
          opacity: 0;
          }
          to {
          opacity: 1;
          }
          }
          `}</style>
    </div>
  );
};

export default SequenceComponent;