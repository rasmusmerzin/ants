export const fullTurn = Math.PI * 2;

export const vecToAng = (vec: [number, number]): number =>
  (fullTurn + Math.atan(vec[1] / vec[0]) + (vec[0] < 0 ? Math.PI : 0)) %
  fullTurn;

export const angToVec = (angle: number, length = 1): [number, number] => [
  Math.cos(angle) * length,
  Math.sin(angle) * length,
];

export const getVecMagnitude = (vec: [number, number]): number =>
  (vec[0] ** 2 + vec[1] ** 2) ** 0.5;

export const getVecSum = (...vectors: [number, number][]): [number, number] => {
  const sum: [number, number] = [0, 0];
  vectors.forEach((vec) => {
    sum[0] += vec[0];
    sum[1] += vec[1];
  });
  return sum;
};

export const getVecDiffInLoopingGrid = (
  vec0: [number, number],
  vec1: [number, number],
  loopSize: [number, number]
): [number, number] => {
  const posDiff: [number, number] = [vec1[0] - vec0[0], vec1[1] - vec0[1]];
  if (posDiff[0] > loopSize[0] / 2) posDiff[0] -= loopSize[0];
  if (posDiff[1] > loopSize[1] / 2) posDiff[1] -= loopSize[1];
  return posDiff;
};

export const radToDeg = (rad: number): number => (rad / Math.PI) * 180;
export const degToRad = (deg: number): number => (deg * Math.PI) / 180;
