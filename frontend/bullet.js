import PIXI, { resources } from './PIXI';
import { STAGE_SIZE } from './constants'
import Entity from './entity'

export default class Bullet extends Entity {
  constructor (x, y, vx, vy) {
    super()

    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.rotation = Math.atan2(vy, vx)

    this.sprite = new PIXI.Sprite(resources.bullet.texture)
    this.sprite.x = -4
    this.sprite.y = -1.5
    this.addChild(this.sprite)
  }

  update (delta) {
    this.x += this.vx * delta
    this.y += this.vy * delta

    const PADDING = 4

    if (this.x < -PADDING || this.x > STAGE_SIZE.x + PADDING || this.y < -PADDING || this.y > STAGE_SIZE.y + PADDING) {
      this.kill()
    }
  }

  hit () {
    this.kill()
  }

  get damage () {
    return 1
  }

  get collider () {
    let width = 4
    let height = 1.5
    if (this.vx == 0) {
      let swap = width
      width = height
      height = swap
    }

    return {
      x: this.x,
      y: this.y,
      width: width,
      height: height,
    }
  }
}