import React, { useReducer } from 'react';
import Dot from './Dot';
import Dock from './Dock';
import Ant, { generateAnt, generateAntArray } from './Ant';
import './App.scss';


const RENDER_RATE = 60;


interface State {
  ants: Ant[],
  mousePos: [number, number],
  mouseDown: boolean
}

interface Action {
  type: 'updateAntVelocities'
      | 'updateAntPositions'
      | 'updateAntSetting'
      | 'increaseAntCount'
      | 'decreaseAntCount'
      | 'mouseDown'
      | 'mouseUp'
      | 'mouseMove',
  pos?: [number, number],
  setting?: string,
  value?: number
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
    case 'updateAntSetting':
      if (action.setting && action.value) {
        if (action.setting === 'count') {
          while (state.ants.length < action.value) state.ants.push(generateAnt());
          while (state.ants.length > action.value) state.ants.pop();
          return { ...state };
        } else {
          return {
            ...state,
            [action.setting]: action.value
          }
        }
      }
      break;
    case 'increaseAntCount':
      for (let i=0; i < (action.value || 1); i++) state.ants.push(generateAnt());
      return { ...state };
    case 'decreaseAntCount':
      for (let i=0; i < (action.value || 1); i++) state.ants.pop();
      return { ...state };
    case 'mouseDown':
      return { ...state, mouseDown: true, mousePos: action.pos || state.mousePos }
    case 'mouseUp':
      return { ...state, mouseDown: false, mousePos: action.pos || state.mousePos }
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
  >
    <div id='canvas'
      onMouseDown={e => dispatch({
        type: 'mouseDown',
        pos: [e.clientX, e.clientY]
      })}
      onMouseUp={() => dispatch({ type: 'mouseUp' })}
      onMouseMove={e => dispatch({
        type: 'mouseMove',
        pos: [e.clientX, e.clientY]
      })}
      onWheel={e => e.deltaY < 0
        ? dispatch({ type: 'increaseAntCount' })
        : dispatch({ type: 'decreaseAntCount' })
      }
      style={{
        cursor: state.mouseDown ? 'grab' : 'pointer'
      }}
    >
      {state.ants.map((node, i) => <Dot
        key={i}
        posX={node.posX}
        posY={node.posY}
        radius={5}
      />)}
      {state.mouseDown && <Dot
        posX={state.mousePos[0]}
        posY={state.mousePos[1]}
        radius={100}
        opacity={.1}
      />}
    </div>
    <Dock
      fields={[
        {
          label: 'count',
          value: state.ants.length,
          min: 1,
          max: 200,
          step: 1
        }
      ]}
      update={(setting: string, value: number) => dispatch({
        type: 'updateAntSetting',
        setting,
        value
      })}
    />
  </div>;
};

export default App;
