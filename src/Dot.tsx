import React from 'react';
import './Dot.css';

interface Props {
  posX: number;
  posY: number;
}

const Dot: React.FC<Props> = ({ posX, posY }) => {
  return <div
    className='peep'
    style={{
      left: posX +'px',
      top: posY +'px'
    }}
  ></div>;
};

export default Dot;
