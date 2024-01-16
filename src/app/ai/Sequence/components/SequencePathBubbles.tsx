import React, { useState, useEffect, useRef, memo } from "react";
import { v4 as uuid } from 'uuid';
import { useSequenceGpt } from "@src/components/GPTS/SequenceGPT/GPT/Context/SequenceGptContext";
import CircularMenu from "./PathMenu/CircularMenu";
import FloatingMenu from "./PathMenu/FloatingMenu/FloatingMenu";
import { CircleMenu } from "./PathMenu/CircleRotate/CircleMenu";

export default function SequencePathBubbles({ currentSequence, handleAddChildSequenceFromIdea, nodeId,  }) {

  const [refresh, setRefresh] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const [sequencePaths, setSequencePaths] = useState(currentSequence?.sequencePaths || {});
  const containerRef = useRef(null);

  const {
    done
  } = useSequenceGpt()


  useEffect(() => {
    if (done) {
      // console.log('%cdoneFronm sequencePAth bubbles', 'color: red; font-size: 14px', done);
      setRefresh((prev) => prev + 1);
      console.log('%c currentSequence', 'color: orange; font-size: 24px', currentSequence);
      setSequencePaths(currentSequence?.sequencePaths);

    }
  }, [done]);

  useEffect(() => {
    if (done) {
      console.log('%cdoneFronm sequencePAth bubbles', 'color: red; font-size: 14px', done);
      setIsDone(true);
    }
  }, [done]);

  useEffect(() => {
    if (isDone) {
      // console.log('%c currentSequence', 'color: orange; font-size: 24px', currentSequence);
      setSequencePaths(currentSequence?.sequencePaths || {});
      setIsDone(false);
    }
  }, [currentSequence, isDone]);


  useEffect(() => {

  }, [sequencePaths]);


  // console.log('%c currentSequence', 'color: orange; font-size: 24px', currentSequence);
  const handleAddChildFromIdea = (parentNodeId, suggestionTopic, suggestedSequence) => {
    console.log('%c suggestedSequence', 'color: orange; font-size: 24px', suggestedSequence);
    handleAddChildSequenceFromIdea(currentSequence.getId(), suggestionTopic, suggestedSequence);
  }


  const menuItems = Object.values(currentSequence?.sequencePaths || {}).flatMap((sequencePath) => {

    console.log('%csequencePath', 'color: green; font-size: 14px', sequencePath);

    return Object.values(sequencePath.pathSuggestions || {}).map((suggestion) => {
      return {
        iconClassName: 'fa fa-chevron-right',
        onClick: () => handleAddChildFromIdea(sequencePath.parentId, suggestion, sequencePath),
        title: suggestion.topicName,
        description: suggestion.description,
        colorOnHover: 'purple',
      };
    });
  });



  return (
    <>
      <div ref={containerRef}>
        <FloatingMenu items={menuItems} />
      </div>
    </>
  );


};




interface CircleProps {
  angle: number;
  radius: number;
  size: number;
}

const Circle: React.FC<CircleProps> = ({ angle, radius, size, handleAddChildFromIdea, path }) => {
  const circleStyle: CSSProperties = {
    position: 'absolute',
    top: radius - radius * Math.cos(angle) - size / 2, // Adjusted calculation for 'top'
    right: radius - radius * Math.sin(angle) - size / 2, // Adjusted calculation for 'right'
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: 'purple',
    pointerEvents: 'auto', // Added pointerEvents for the circles
  };

  return <div style={circleStyle} onClick={() => { handleAddChildFromIdea(path) }} />;
};

interface FloatingCirclesProps {
  paths: any[]; // Updated prop
}

const angleCalculator = (index: number, numberOfCircles: number, angleStep: number, angleOffset: number): number => {
  const halfCircles = Math.ceil(numberOfCircles / 2);
  if (index < halfCircles) {
    return angleStep * index + angleOffset;
  } else {
    return angleStep * (index + 1) + angleOffset;
  }
};

const FloatingCircles: React.FC<FloatingCirclesProps> = ({ paths, handleAddChildFromIdea }) => {
  const size = 60;
  const radius = 300;
  const numberOfCircles = paths.length;
  const angleStep = Math.PI / (numberOfCircles); // Adjusted the angleStep calculation
  const angleOffset = (3 * Math.PI) / 2;

  // New state to manage visible circles
  // Initialize visibleCircles with an empty array
  const [visibleCircles, setVisibleCircles] = useState([]);

  // Function to handle circle click
  const onCircleClick = (path) => {
    handleAddChildFromIdea(path);
    setVisibleCircles(visibleCircles.filter((circle) => circle !== path)); // Remove the clicked circle from the visible circles list
  };


  // Update visibleCircles when paths change
  useEffect(() => {
    setVisibleCircles(paths);
  }, [paths]);

  return (
    <div
      className="floating-circles"
      style={{
        position: 'relative',
        width: 2 * radius,
        height: 2 * radius, // Adjusted height to be 2 * radius
        pointerEvents: 'none', // Added pointerEvents for the container
      }}
    >
      {visibleCircles.map((path, index) => (
        <Circle key={index} angle={angleCalculator(index, numberOfCircles, angleStep, angleOffset)} radius={radius} size={size} handleAddChildFromIdea={() => onCircleClick(path)} path={path} />
      ))}
    </div>
  );
};
