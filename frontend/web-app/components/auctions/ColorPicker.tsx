'use client'

import React from 'react';


const ColorPicker: React.FC<{
  color: string,
  setColor: (color: string) => void,
}> = ({
  color,
  setColor,
}) => {
  return (
    <>
      <TwitterPicker color={color} onChange={setColor}/>
    </>
  );
}

export default ColorPicker;