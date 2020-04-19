import React from 'react';
import Dot from './Dot';
import Ant, { generateAntArray } from './Ant';
import './App.css';


const RENDER_RATE = 60;


const App: React.FC = () => {
  const [ants, setAnts] = React.useState<Ant[]>(generateAntArray(10));

  const updateAntVelocities = () =>
    setAnts(ants => ants.map(ant => ant.updateVelocity(ants)));

  const updateAntPositions = () =>
    setAnts(ants => ants.map(ant => ant.updatePosition()));

  React.useEffect(() => {
    const ticker = setInterval(() => {
      updateAntPositions();
      updateAntVelocities();
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
