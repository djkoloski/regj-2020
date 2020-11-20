import PIXI, { resources } from './PIXI'
import { STAGE_SIZE } from './constants'
import Entity from './entity'

export default class Hazard extends Entity {
  constructor (x, y) {
    super()

    this.x = x
    this.y = y
    this.value = 1
    this.health = 1
    this.size = { x: 8, y: 8 }
  }

  takeDamage (amount) {
    if (this.health > 0) {
      this.health = Math.max(0, this.health - amount)
      if (this.health == 0) {
        this.kill()
      }
    }
  }

  get collider () {
    return {
      x: this.x,
      y: this.y,
      width: this.size.x,
      height: this.size.y,
    }
  }
}

export class BouncingHazard extends Hazard {
  constructor (x, y, vx, vy) {
    super(x, y)

    this.vx = vx
    this.vy = vy

    this.sprite = new PIXI.Sprite(resources.entities.spritesheet.textures.hazard_0)
    this.addChild(this.sprite)
    this.sprite.x = -this.size.x
    this.sprite.y = -this.size.y
  }

  update (delta) {
    this.x += this.vx * delta
    this.y += this.vy * delta

    // bounce
    let reverseBottom = (this.y + this.size.y >= STAGE_SIZE.y && this.vy > 0)
    let reverseTop = (this.y - this.size.y <= 0 && this.vy < 0)
    if (reverseBottom || reverseTop) {
      this.vy = -this.vy
    }
    let reverseRight = (this.x + this.size.x >= STAGE_SIZE.x && this.vx > 0)
    let reverseLeft = (this.x - this.size.x <= 0 && this.vx < 0)
    if (reverseRight || reverseLeft) {
      this.vx = -this.vx
    }
  }

  kill () {
    super.kill()

    resources.explode.sound.play()
  }
}