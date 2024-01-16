// Bookmark.js

import React from 'react';

const Bookmark = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        color: 'black',
        borderRadius: '12px',
        border: '1px solid black',
        padding: '5px 10px',
        margin: 5,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
};

export default Bookmark;
