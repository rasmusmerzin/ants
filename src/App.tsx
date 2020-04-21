import React, { useReducer } from 'react';
import Dot from './Dot';
import Ant, { generateAntArray } from './Ant';
import './App.css';


const RENDER_RATE = 60;


interface State {
  ants: Ant[],
  mousePos: [number, number],
  mouseDown: boolean
}

interface Action {
  type: 'updateAntVelocities'
      | 'updateAntPositions'
      | 'mouseDown'
      | 'mouseUp'
      | 'mouseMove',
  pos?: [number, number]
}


const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'updateAntVelocities':
      const neighbours: (Ant | { pos: [number, number] })[] = [...state.ants];
      if (state.mouseDown) neighbours.push({ pos: state.mousePos });
      return {
        ...state,
        ants: state.ants.map(ant => ant.updateVelocity(neighbours))
      };
    case 'updateAntPositions':
      return {
        ...state,
        ants: state.ants.map(ant => ant.updatePosition())
      };
    case 'mouseDown':
      return { ...state, mouseDown: true }
    case 'mouseUp':
      return { ...state, mouseDown: false }
    case 'mouseMove':
      if (action.pos) return { ...state, mousePos: action.pos }
  }
  return state;
};


const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, {
    ants: generateAntArray(30),
    mousePos: [0, 0],
    mouseDown: false
  });

  React.useEffect(() => {
    const ticker = setInterval(() => {
      dispatch({ type: 'updateAntPositions' });
      dispatch({ type: 'updateAntVelocities' });
    }, 1000 /RENDER_RATE);
    return () => clearInterval(ticker);
  }, []);

  return <div
    id='app'
    onMouseDown={() => dispatch({ type: 'mouseDown' })}
    onMouseUp={() => dispatch({ type: 'mouseUp' })}
    onMouseMove={e => dispatch({
      type: 'mouseMove',
      pos: [e.clientX, e.clientY]
    })}
  >
    {state.ants.map((node, i) => <Dot
      key={i}
      posX={node.posX}
      posY={node.posY}
    />)}
  </div>;
};

export default App;
