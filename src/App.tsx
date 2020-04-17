import React from 'react';
import Dot from './Dot';
import Trig from './Trig';
import './App.css';


const RENDER_RATE = 60;
const PEEP_AGILITY = Trig.degToRad(30);
const PEEP_SPEED = 5;


interface Peep {
  posX: number;
  posY: number;
  velX: number;
  velY: number;
}

const App: React.FC = () => {
  const [peeps, setPeeps] = React.useState<Peep[]>([
    {
      posX: 200,
      posY: 200,
      velX: 1,
      velY: 0
    }
  ]);

  const updatePeepDirections = () => setPeeps(peeps => {
    peeps = peeps.map(node => {
      let angle = Trig.getVelAngle(node.velX, node.velY);
      angle += (Math.random() -.5) *PEEP_AGILITY;
      [node.velX, node.velY] = Trig.getVelVector(angle, PEEP_SPEED);
      return node;
    });
    return peeps;
  });

  const updatePeepPositions = () => setPeeps(peeps => {
    peeps = peeps.map(node => {
      node.posX += window.innerWidth +node.velX;
      node.posY += window.innerHeight +node.velY;
      node.posX %= window.innerWidth;
      node.posY %= window.innerHeight;
      return node;
    });
    return peeps;
  });

  React.useEffect(() => {
    const ticker = setInterval(() => {
      updatePeepDirections();
      updatePeepPositions();
    }, 1000 /RENDER_RATE);
    return () => clearInterval(ticker);
  }, []);

  return <div
    id='app'
  >
    {peeps.map((node, i) => <Dot
      key={i}
      posX={node.posX}
      posY={node.posY}
    />)}
  </div>;
};

export default App;
