import React from 'react';

const ColorPicker = ({ color, onChange }) => {
  return (
    <input
      type="color"
      value={color}
      onChange={(e) => onChange(e.target.value)}
      className="w-10 h-10 cursor-pointer"
    />
  );
};

export default ColorPicker;