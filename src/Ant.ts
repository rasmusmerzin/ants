import Trig from './Trig';


export default class Ant {
  posX = 0;
  posY = 0;
  velX = 0;
  velY = 0;

  agility = Trig.degToRad(30);
  speed = 5;

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
        this.agility = Trig.degToRad(options.agility);
      if (options.speed !== undefined)
        this.speed = options.speed;
    }
  }

  get angle() {
    return Trig.getVelAngle(this.velX, this.velY);
  }

  updatePosition() {
    this.posX += window.innerWidth +this.velX;
    this.posY += window.innerHeight +this.velY;
    this.posX %= window.innerWidth;
    this.posY %= window.innerHeight;
    return this;
  };

  updateDirection() {
    let angle = this.angle;
    if (isNaN(angle)) angle = 0;
    angle += (Math.random() -.5) *2 *this.agility;
    [this.velX, this.velY] = Trig.getVelVector(angle, this.speed);
    return this;
  };
}
