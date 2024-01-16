import React, { useState, useEffect } from "react";



const IdeasList = ({ ideas, handleAddChildSequence, sequenceRef , nodeId}) => {


  const handleAddChildFromIdea = (idea) => {
    handleAddChildSequence(nodeId, 'new Child son', idea);
  }

  const newIdeas = ideas && Object.keys(ideas);

  return (
    <ul>
      {newIdeas &&
        newIdeas.map((prop, index) => (
          <li key={index} onClick={() => handleAddChildFromIdea(ideas[prop])}
          >
            {ideas[prop] && <p>{ideas[prop]}</p>}
          </li>
        ))}
    </ul>
  );
};

export default IdeasList;
