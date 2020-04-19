import {
  fullTurn,
  radToDeg,
  degToRad,
  angToVec,
  vecToAng,
  getVecMagnitude,
  getVecSum,
  getVecDiffInLoopingGrid
} from './Trig';

test('radian <-> degree conversion', () => {
  expect(radToDeg(Math.PI)).toBe(180);
  expect(degToRad(180)).toBe(Math.PI);
  expect(radToDeg(Math.PI /2)).toBe(90);
  expect(degToRad(90)).toBe(Math.PI /2);
  expect(radToDeg(Math.PI *2)).toBe(360);
  expect(degToRad(360)).toBe(Math.PI *2);
  expect(radToDeg(0)).toBe(0);
  expect(degToRad(0)).toBe(0);
});

test(
  'fullTurn is 360°',
  () => expect(radToDeg(fullTurn)).toBe(360)
);

test(
  'Angle 0 corresponds to vector vector (1, 0)',
  () => expect(angToVec(0)).toEqual([1, 0])
);

test(
  'O-vector angle is NaN',
  () => expect(vecToAng(0, 0)).toBeNaN()
);

[0, 45, 90, 135, 180, 225, 270, 315, 360].forEach(angle =>
  test(`angle ${angle}° consistency`, () => {
    const pos = angToVec(degToRad(angle));
    expect(Math.round(radToDeg(vecToAng(pos))))
      .toBe(angle %360);
  }));

[[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]].forEach(triple =>
  test(
    `hypotenuse for Pythagorean triple (${triple.join(', ')})`,
    () => expect(getVecMagnitude([triple[0], triple[1]]))
      .toBe(triple[2])
  ));

[
  [[-91, -68], [23, 16]],
  [[-82, 84], [22, -41]]
].forEach(set => test(
  `sum of (${set[0].join(', ')}) & (${set[1].join(', ')})`,
  () => expect(getVecSum(set[0], set[1]))
    .toEqual([
      set[0][0] +set[1][0],
      set[0][1] +set[1][1]
    ])
));

test(
  `diff of (91, 84) & (90, 89) in (99, 31)`,
  () => expect(getVecDiffInLoopingGrid([91, 84], [90, 89], [99, 31]))
    .toEqual([-1, 5])
);

test(
  `diff of (2, 4) & (89, 64) in (90, 70)`,
  () => expect(getVecDiffInLoopingGrid([2, 4], [89, 64], [90, 70]))
    .toEqual([-3, -10])
);
