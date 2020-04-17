const fullTurn = Math.PI *2;

const getVelAngle = (velX: number, velY: number): number =>
  velX === 0 && velY === 0
    ? 0
    : (fullTurn +Math.atan(velY /velX) +(velX < 0 ? Math.PI : 0)) %fullTurn;

const getVelVector = (angle: number, length = 1): [number, number] =>
  angle === 0
    ? [0, 0]
    : [Math.cos(angle) *length, Math.sin(angle) *length];

const getVelMagnitude = (velX: number, velY: number): number =>
  (velX **2 +velY **2) **.5;

const radToDeg = (rad: number): number => rad /Math.PI *180;
const degToRad = (deg: number): number => deg *Math.PI /180;

export default {
  getVelAngle,
  getVelVector,
  getVelMagnitude,
  radToDeg,
  degToRad,

  fullTurn
};
