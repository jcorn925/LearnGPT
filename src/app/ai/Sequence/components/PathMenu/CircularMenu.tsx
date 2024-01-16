import React, { useEffect, useState } from 'react';

const CircularMenu = ({ options, reference }) => {
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const radius = 100;
  const menuSize = options.length + 1;
  const radialOffset = (Math.PI / 2) / menuSize;

  const xPos = (rad) => Math.cos(rad);
  const yPos = (rad) => Math.sin(rad);

  useEffect(() => {
    if (reference.current) {
      const rect = reference.current.getBoundingClientRect();
      setCenter({ x: rect.right, y: rect.bottom });
    }
  }, [reference]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '500px',
        left:
        width: radius * 2,
        height: radius * 2,
        pointerEvents: 'none',
      }}
    >
      <ul style={{ listStyleType: 'none', pointerEvents: 'auto' }}>
        {options.map((option, index) => {
          const angle = radialOffset * (index + 1);
          const rotation = (90 / menuSize) * (index + 1);
          return (
            <li
              key={index}
              style={{
                position: 'absolute',
                top: radius * yPos(angle) + radius + 'px',
                left: radius * xPos(angle) + radius + 'px',
                transformOrigin: '0 0',
                transform: `rotate(${rotation}deg)`,
                backgroundColor: 'rgb(255,140,12)',
                width: '120px',
                fontSize: '16px',
                fontWeight: 'bold',
                borderRadius: '8px',
                pointerEvents: 'auto',
              }}
            >
              {option}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CircularMenu;
