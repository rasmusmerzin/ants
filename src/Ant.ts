import {
  vecToAng,
  angToVec,
  degToRad,
  getVecMagnitude,
  getVecDiffInLoopingGrid
} from './Trig';


export default class Ant {
  posX = 0;
  posY = 0;
  velX = 0;
  velY = 0;

  get pos(): [number, number] {
    return [this.posX, this.posY];
  }

  set pos(vec: [number, number]) {
    this.posX = vec[0];
    this.posY = vec[1];
  }

  get vel(): [number, number] {
    return [this.velX, this.velY];
  }

  set vel(vec: [number, number]) {
    this.velX = vec[0];
    this.velY = vec[1];
  }

  get angle(): number {
    return vecToAng(this.vel);
  }

  agility = degToRad(30);
  speed = 5;
  distancingRange = 100;
  distancingFactor = 1;

  constructor(options?: {
    posX?: number,
    posY?: number,
    agility?: number,
    speed?: number
  }) {
    if (options !== undefined) {
      this.posX = options.posX || 0;
      this.posY = options.posY || 0;
      if (options.agility !== undefined)
        this.agility = degToRad(options.agility);
      if (options.speed !== undefined)
        this.speed = options.speed;
    }
  }

  getNeighboursInRange(neighbours: Ant[]): Ant[] {
    return neighbours.filter(ant => {
      if (ant !== this) {
        const posDiff = getVecDiffInLoopingGrid(this.pos, ant.pos, [window.innerWidth, window.innerHeight]);
        return (
          posDiff[0] <= this.distancingRange &&
          posDiff[1] <= this.distancingRange &&
          // avoid calculating the hypotenuse(magnitude) if not necessary
          getVecMagnitude(posDiff) <= this.distancingRange
        );
      } else return false;
    });
  }

  calcPush(distance: number) {
    return Math.min(this.distancingFactor *this.distancingRange /distance, this.speed);
  }

  updatePosition(): Ant {
    this.posX += window.innerWidth +this.velX;
    this.posY += window.innerHeight +this.velY;
    this.posX %= window.innerWidth;
    this.posY %= window.innerHeight;
    return this;
  };

  updateVelocity(neighbours: Ant[]): Ant {
    neighbours = this.getNeighboursInRange(neighbours);
    if (neighbours.length > 0) {
      const vel: [number, number] = [0, 0];
      neighbours.map(ant => getVecDiffInLoopingGrid(this.pos, ant.pos, [window.innerWidth, window.innerHeight]))
        .forEach(posDiff => {
          const push = this.calcPush(getVecMagnitude(posDiff));
          const pushAngle = vecToAng(posDiff) +180;
          const pushVector = angToVec(pushAngle, push);
          vel[0] += pushVector[0];
          vel[1] += pushVector[1];
        });
      this.vel = vel;
    } else {
      let angle = this.angle;
      if (isNaN(angle)) angle = 0;
      angle += (Math.random() -.5) *2 *this.agility;
      [this.velX, this.velY] = angToVec(angle, this.speed);
    }
    return this;
  };
}

export const generateAntArray = (count: number): Ant[] => {
  const arr: Ant[] = [];
  for (let i=0; i<count; i++) arr.push(new Ant({
    posX: Math.random() *window.innerWidth,
    posY: Math.random() *window.innerHeight
  }));
  return arr;
};
