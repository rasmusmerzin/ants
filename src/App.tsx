import React, { useReducer, TouchList } from "react";
import Dot from "./components/Dot";
import Dock from "./components/Dock";
import Ant from "./logic/Ant";
import "./App.scss";

type Touch = [number, number];

interface State {
  renderRate: number;
  ants: Ant[];
  antSettings: {
    agility: number;
    speed: number;
    minSpeed: number;
    maxSpeed: number;
    distancingRange: number;
    distancingFactor: number;
  };
  mousePos: [number, number];
  mouseDown: boolean;
  touches: Touch[];
}

type AntSetting =
  | "agility"
  | "speed"
  | "minSpeed"
  | "maxSpeed"
  | "distancingRange"
  | "distancingFactor";

interface Action {
  type:
    | "updateAntVelocities"
    | "updateAntPositions"
    | "updateSettings"
    | "mouseDown"
    | "mouseUp"
    | "mouseMove"
    | "touch";
  pos?: [number, number];
  setting?: AntSetting | "count" | "renderRate";
  value?: number;
  touches?: TouchList;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "updateAntVelocities":
      const neighbours: (Ant | { pos: [number, number] })[] = [...state.ants];
      if (state.mouseDown) neighbours.push({ pos: state.mousePos });
      state.touches.forEach((touch) => neighbours.push({ pos: touch }));
      state.ants.forEach((ant) => ant.updateVelocity(neighbours));
      return { ...state };
    case "updateAntPositions":
      state.ants.forEach((ant) => ant.updatePosition());
      return { ...state };
    case "updateSettings":
      if (action.setting && action.value) {
        if (action.setting === "count") {
          while (state.ants.length < action.value)
            state.ants.push(new Ant(state.antSettings));
          while (state.ants.length > action.value) state.ants.pop();
          return { ...state };
        } else if (action.setting === "renderRate") {
          return { ...state, renderRate: action.value };
        } else {
          const setting = action.setting as AntSetting;
          const value = action.value as number;
          state.antSettings[setting] = value;
          state.ants.forEach((ant) => {
            ant[setting] = value;
          });
          return { ...state };
        }
      }
      break;
    case "mouseDown":
      return {
        ...state,
        mouseDown: true,
        mousePos: action.pos || state.mousePos,
      };
    case "mouseUp":
      return {
        ...state,
        mouseDown: false,
        mousePos: action.pos || state.mousePos,
      };
    case "mouseMove":
      if (action.pos) return { ...state, mousePos: action.pos };
      break;
    case "touch":
      state.touches = [];
      if (action.touches) {
        for (let i = 0; i < action.touches.length; i++) {
          const item = action.touches.item(i);
          if (item) state.touches.push([item.clientX, item.clientY]);
        }
      }
      return { ...state };
  }
  return state;
};

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, {
    renderRate: 60,
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
    mouseDown: false,
    touches: [],
  });

  React.useEffect(
    () =>
      dispatch({
        type: "updateSettings",
        setting: "count",
        value: 30,
      }),
    []
  );

  React.useEffect(() => {
    const ticker = setInterval(() => {
      dispatch({ type: "updateAntPositions" });
      dispatch({ type: "updateAntVelocities" });
    }, 1000 / state.renderRate);

    return () => clearInterval(ticker);
  }, [state.renderRate]);

  return (
    <div id="app">
      <div
        id="canvas"
        onMouseDown={(e) =>
          dispatch({ type: "mouseDown", pos: [e.clientX, e.clientY] })
        }
        onMouseMove={(e) =>
          dispatch({ type: "mouseMove", pos: [e.clientX, e.clientY] })
        }
        onMouseUp={() => dispatch({ type: "mouseUp" })}
        onTouchStart={(e) => dispatch({ type: "touch", touches: e.touches })}
        onTouchMove={(e) => dispatch({ type: "touch", touches: e.touches })}
        onTouchEnd={(e) => dispatch({ type: "touch", touches: e.touches })}
        style={{
          cursor: state.mouseDown ? "grab" : "pointer",
        }}
      >
        {state.ants.map((node, i) => (
          <Dot key={i} posX={node.posX} posY={node.posY} radius={5} />
        ))}
        {state.mouseDown && (
          <Dot
            posX={state.mousePos[0]}
            posY={state.mousePos[1]}
            radius={state.antSettings.distancingRange}
            opacity={0.1}
          />
        )}
        {state.touches.map((touch, i) => (
          <Dot
            key={i}
            posX={touch[0]}
            posY={touch[1]}
            radius={state.antSettings.distancingRange}
            opacity={0.1}
          />
        ))}
      </div>
      <Dock
        fields={[
          {
            key: "renderRate",
            label: "render rate",
            value: state.renderRate,
            min: 1,
            max: 60,
            step: 1,
          },
          {
            key: "count",
            value: state.ants.length,
            min: 1,
            max: 200,
          },
          {
            key: "agility",
            value: state.antSettings.agility,
            min: 1,
            max: 90,
          },
          {
            key: "speed",
            value: state.antSettings.speed,
            min: 1,
            max: 50,
          },
          {
            key: "distancingRange",
            label: "distancing range",
            value: state.antSettings.distancingRange,
            min: 10,
            max: 200,
            step: 10,
          },
          {
            key: "distancingFactor",
            label: "distancing factor",
            value: state.antSettings.distancingFactor,
            min: 0.1,
            max: 4,
            step: 0.1,
          },
        ]}
        update={(setting: string, value: number) =>
          dispatch({
            type: "updateSettings",
            setting: setting as AntSetting,
            value,
          })
        }
      />
    </div>
  );
};

export default App;
