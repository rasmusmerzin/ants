import Trig from './Trig';

test(
  'fullTurn is 360°',
  () => expect(Trig.radToDeg(Trig.fullTurn)).toBe(360)
);

test(
  'Angle 0 corresponds to O-vector',
  () => expect(Trig.getVelVector(0)).toEqual([0, 0])
);

test(
  'O-vector angle is 0',
  () => expect(Trig.getVelAngle(0, 0)).toBe(0)
);

[0, 45, 90, 135, 180, 225, 270, 315, 360].forEach(angle =>
  test(`angle ${angle}° consistency`, () => {
    const [posX, posY] = Trig.getVelVector(Trig.degToRad(angle));
    expect(Math.round(Trig.radToDeg(Trig.getVelAngle(posX, posY))))
      .toBe(angle %360);
  }));

[[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]].forEach(triple =>
  test(
    `Pythagorean triple (${triple.join(', ')})`,
    () => expect(Trig.getVelMagnitude(triple[0], triple[1]))
      .toBe(triple[2])
  ));
