import React from 'react';
import './Dot.css';

interface Props {
  posX: number,
  posY: number,
  radius: number,
  opacity?: number
}

const Dot: React.FC<Props> = ({ posX, posY, radius, opacity }) => {
  return <div
    className='dot'
    style={{
      height: (radius *2) +'px',
      width: (radius *2) +'px',
      left: (posX -radius) +'px',
      top: (posY -radius) +'px',
      opacity
    }}
  ></div>;
};

export default Dot;
