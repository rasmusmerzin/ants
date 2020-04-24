import React, { useReducer } from 'react';
import Dot from './components/Dot';
import Dock from './components/Dock';
import Ant from './logic/Ant';
import './App.scss';


const RENDER_RATE = 60;


interface State {
  ants: Ant[],
  antSettings: {
    agility: number,
    speed: number,
    minSpeed: number,
    maxSpeed: number,
    distancingRange: number,
    distancingFactor: number
  },
  mousePos: [number, number],
  mouseDown: boolean
}

type AntSetting = 'agility' | 'speed' | 'minSpeed' | 'maxSpeed' | 'distancingRange' | 'distancingFactor';

interface Action {
  type: 'updateAntVelocities'
      | 'updateAntPositions'
      | 'updateAntSetting'
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
      state.ants.forEach(ant => ant.updateVelocity(neighbours));
      return { ...state };
    case 'updateAntPositions':
      state.ants.forEach(ant => ant.updatePosition());
      return { ...state };
    case 'updateAntSetting':
      if (action.setting && action.value) {
        if (action.setting === 'count') {
          while (state.ants.length < action.value) state.ants.push(new Ant(state.antSettings));
          while (state.ants.length > action.value) state.ants.pop();
          return { ...state };
        } else {
          const setting = action.setting as AntSetting;
          const value = action.value as number;
          state.antSettings[setting] = value;
          if (['speed', 'minSpeed', 'maxSpeed'].indexOf(setting) !== -1) {
            state.antSettings.minSpeed = Math.min(
              state.antSettings.minSpeed,
              state.antSettings.maxSpeed,
              state.antSettings.speed,
            );
            state.antSettings.maxSpeed = Math.max(
              state.antSettings.minSpeed,
              state.antSettings.maxSpeed,
              state.antSettings.speed
            );
            state.antSettings.speed = Math.min(
              Math.max(
                state.antSettings.speed,
                state.antSettings.minSpeed
              ),
              state.antSettings.maxSpeed
            );
            state.ants.forEach(ant => {
              ant.speed = state.antSettings.speed;
              ant.minSpeed = state.antSettings.minSpeed;
              ant.maxSpeed = state.antSettings.maxSpeed;
            });
          } else {
            state.ants.forEach(ant => { ant[setting] = value; });
          }
          return { ...state }
        }
      }
      break;
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
    ants: [],
    antSettings: {
      agility: 30,
      speed: 6,
      minSpeed: 1,
      maxSpeed: 10,
      distancingRange: 100,
      distancingFactor: 2,
    },
    mousePos: [0, 0],
    mouseDown: false
  });

  React.useEffect(() => {
    const ticker = setInterval(() => {
      dispatch({ type: 'updateAntPositions' });
      dispatch({ type: 'updateAntVelocities' });
    }, 1000 /RENDER_RATE);

    dispatch({
      type: 'updateAntSetting',
      setting: 'count',
      value: 30
    });

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
        radius={state.antSettings.distancingRange}
        opacity={.1}
      />}
    </div>
    <Dock
      fields={[
        {
          label: 'count',
          value: state.ants.length,
          min: 1,
          max: 200
        },
        {
          label: 'agility',
          value: state.antSettings.agility,
          min: 1,
          max: 90
        },
        {
          label: 'minSpeed',
          value: state.antSettings.minSpeed,
          min: 1,
          max: 50
        },
        {
          label: 'speed',
          value: state.antSettings.speed,
          min: 1,
          max: 50
        },
        {
          label: 'maxSpeed',
          value: state.antSettings.maxSpeed,
          min: 1,
          max: 50
        },
        {
          label: 'distancingRange',
          value: state.antSettings.distancingRange,
          min: 10,
          max: 200,
          step: 10
        },
        {
          label: 'distancingFactor',
          value: state.antSettings.distancingFactor,
          min: .1,
          max: 4,
          step: .1
        }
      ]}
      update={(setting: string, value: number) => dispatch({
        type: 'updateAntSetting',
        setting: setting as AntSetting,
        value
      })}
    />
  </div>;
};

export default App;
