import PIXI, { resources } from './PIXI'
import { STAGE_SIZE } from './constants'
import Entity from './entity'

export default class Hazard extends Entity {
  constructor (x, y, health, scale) {
    super()

    this.x = x
    this.y = y
    this.value = 1
    this.health = health
    this.size = { x: 8 * scale, y: 8 * scale }

    this.sprite = new PIXI.Sprite()
    this.sprite.x = -this.size.x
    this.sprite.y = -this.size.y
    this.sprite.scale.x = scale
    this.sprite.scale.y = scale
    this.addChild(this.sprite)
  }

  update (delta) {
    let index = Math.min(7, this.health - 1)
    this.sprite.texture = resources.entities.spritesheet.textures[`hazard_${index}`]
  }

  takeDamage (amount) {
    if (this.health > 0) {
      this.health = Math.max(0, this.health - amount)
      if (this.health == 0) {
        this.kill()
      } else {
        resources.hit.sound.play()
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

  kill () {
    super.kill()
    resources.explode.sound.play()
  }
}

export class BouncingHazard extends Hazard {
  constructor (x, y, health, scale, vx, vy) {
    super(x, y, health, scale)

    this.vx = vx
    this.vy = vy
  }

  update (delta) {
    super.update(delta)

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
}

export class RingHazard extends Hazard {
  constructor (health, scale, cx, cy, angle, initial, outer, inner) {
    let x = Math.cos(angle) * outer + cx
    let y = Math.sin(angle) * outer + cy

    super(x, y, health, scale)

    this.cx = cx
    this.cy = cy
    this.fAngle = angle
    this.initial = initial
    this.outer = outer
    this.inner = inner

    this.time = 0
  }

  update (delta) {
    super.update(delta)

    this.time += delta

    let radius = 0

    const PERIOD = 100
    let t = Math.sin(this.time / PERIOD * Math.PI / 2)
    if (this.time < PERIOD) {
      radius = (1 - t) * this.initial + t * this.inner
    } else {
      radius = (1 - t) * this.outer + t * this.inner
    }

    const ANGULAR_VELOCITY = 0.01
    this.fAngle += ANGULAR_VELOCITY * delta

    this.x = this.cx + radius * Math.cos(this.fAngle)
    this.y = this.cy + radius * Math.sin(this.fAngle)
  }
}
