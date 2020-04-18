import Ant from './Ant';

[[10, 20], [300, 25], [10003, 30001]].forEach(pos => test(`ant position (${pos[0]}, ${pos[1]})`, () => {
  const [posX, posY] = pos;
  const ant = new Ant({ posX, posY });
  expect(ant.posX).toBe(posX);
  expect(ant.posY).toBe(posY);
  expect(ant.velX).toBe(0);
  expect(ant.velY).toBe(0);
  ant.updateDirection();
  expect(ant.velX).not.toBe(0);
  expect(ant.velY).not.toBe(0);
  ant.updatePosition();
  expect(Math.round(ant.posX)).toBe(Math.round((posX +ant.velX) %window.innerWidth));
  expect(Math.round(ant.posY)).toBe(Math.round((posY +ant.velY) %window.innerHeight));
  ant.velY
}));
