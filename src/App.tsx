import React from 'react';
import Dot from './Dot';
import Ant from './Ant';
import './App.css';


const RENDER_RATE = 60;


const App: React.FC = () => {
  const [ants, setAnts] = React.useState<Ant[]>([
    new Ant({ posX: 500, posY: 200 }),
    new Ant({ posY: 200, speed: 2 })
  ]);

  const updateAntDirections = () =>
    setAnts(ants => ants.map(ant => ant.updateDirection()));

  const updateAntPositions = () =>
    setAnts(ants => ants.map(ant => ant.updatePosition()));

  React.useEffect(() => {
    const ticker = setInterval(() => {
      updateAntDirections();
      updateAntPositions();
    }, 1000 /RENDER_RATE);
    return () => clearInterval(ticker);
  }, []);

  return <div id='app'>
    {ants.map((node, i) => <Dot
      key={i}
      posX={node.posX}
      posY={node.posY}
    />)}
  </div>;
};

export default App;
