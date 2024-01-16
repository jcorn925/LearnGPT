import { useState } from 'react';

function TogglingComponent({ children }) {
  const [isLarge, setIsLarge] = useState(false);

  const toggleSize = () => {
    setIsLarge(prevState => !prevState);
  };

  return (
    <div
      style={{ width: isLarge ? '400px' : '200px', height: isLarge ? '400px' : '200px' , backgroundColor: 'red'}}
      onClick={toggleSize}
    >
      {children}
    </div>
  );
}


export default TogglingComponent;