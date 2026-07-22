import React from 'react';

const Scrollbar = ({ progress }) => {
  return (
    <div className="scrollbar">
      <div
        className="scrollbar__progress"
        style={{
          transform: `scaleY(${progress})`,
        }}
      />
    </div>
  );
};

export default Scrollbar;
