import {
  vecToAng,
  angToVec,
  degToRad,
  getVecMagnitude,
  getVecDiffInLoopingGrid,
} from "./Trig";

interface Push {
  posDiff: [number, number];
  distance: number;
}

export default class Ant {
  posX: number;
  posY: number;
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

  _agility = degToRad(30);

  set agility(ang: number) {
    this._agility = degToRad(ang);
  }

  speed: number;
  minSpeed: number;
  maxSpeed: number;
  distancingRange: number;
  distancingFactor: number;

  constructor(options: {
    posX?: number;
    posY?: number;
    agility: number;
    speed: number;
    minSpeed: number;
    maxSpeed: number;
    distancingRange: number;
    distancingFactor: number;
  }) {
    this.posX = options.posX || Math.random() * window.innerWidth;
    this.posY = options.posY || Math.random() * window.innerHeight;
    this.agility = options.agility;
    this.speed = options.speed;
    this.minSpeed = options.minSpeed;
    this.maxSpeed = options.maxSpeed;
    this.distancingRange = options.distancingRange;
    this.distancingFactor = options.distancingFactor;
  }

  getPushes(neighbours: (Ant | { pos: [number, number] })[]): Push[] {
    return neighbours
      .map((ant): Push | null => {
        if (ant !== this) {
          const posDiff = getVecDiffInLoopingGrid(this.pos, ant.pos, [
            window.innerWidth,
            window.innerHeight,
          ]);
          // avoid calculating the hypotenuse(magnitude) if not necessary
          if (
            posDiff[0] <= this.distancingRange &&
            posDiff[1] <= this.distancingRange
          ) {
            const distance = getVecMagnitude(posDiff);
            if (distance <= this.distancingRange) return { posDiff, distance };
            else return null;
          } else return null;
        } else return null;
      })
      .filter((push) => push !== null) as Push[];
  }

  calcPush(distance: number) {
    return Math.min(
      this.minSpeed +
        (this.distancingFactor * this.distancingRange) / distance -
        1,
      this.maxSpeed
    );
  }

  updatePosition(): Ant {
    this.posX += window.innerWidth + this.velX;
    this.posY += window.innerHeight + this.velY;
    this.posX %= window.innerWidth;
    this.posY %= window.innerHeight;
    return this;
  }

  updateVelocity(neighbours: (Ant | { pos: [number, number] })[]): Ant {
    const pushes = this.getPushes(neighbours);
    if (pushes.length > 0) {
      const vel: [number, number] = [0, 0];
      pushes.forEach((push) => {
        const pushAngle = vecToAng(push.posDiff) + Math.PI;
        const pushVector = angToVec(pushAngle, this.calcPush(push.distance));
        vel[0] += pushVector[0];
        vel[1] += pushVector[1];
      });
      this.vel = vel;
    } else {
      let angle = this.angle;
      if (isNaN(angle)) angle = 0;
      angle += (Math.random() - 0.5) * 2 * this._agility;
      [this.velX, this.velY] = angToVec(angle, this.speed);
    }
    return this;
  }
}
