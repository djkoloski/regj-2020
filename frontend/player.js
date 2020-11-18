import PIXI, { resources } from './PIXI'
import Input from './input'
import SpritesheetSprite from './spritesheetSprite'

export default class Player extends PIXI.Container {
  constructor () {
    super()

    this.speed = 1.5
    this.direction = {x: 0, y: 0}

    this.sprite = new SpritesheetSprite(resources.player)
    this.addChild(this.sprite)
    this.sprite.play('idle', 0.125)
  }

  input () {
    let result = {x: 0, y: 0}
    if (Input.right.isDown()) {
      result.x += 1
    }
    if (Input.left.isDown()) {
      result.x -= 1
    }
    if (Input.up.isDown()) {
      result.y -= 1
    }
    if (Input.down.isDown()) {
      result.y += 1
    }
    const len = Math.sqrt(result.x * result.x + result.y * result.y)
    if (len != 0) {
      result.x /= len
      result.y /= len
    }
    return result
  }

  update (delta) {
    this.setDirection(this.input())
    this.x += this.direction.x * this.speed * delta
    this.y += this.direction.y * this.speed * delta

    if (this.direction.x > 0) {
      this.sprite.play('right', 0.250)
    } else if (this.direction.x < 0) {
      this.sprite.play('left', 0.250)
    } else if (this.direction.y > 0) {
      this.sprite.play('down', 0.250)
    } else if (this.direction.y < 0) {
      this.sprite.play('up', 0.250)
    } else {
      this.sprite.play('idle', 0.125)
    }
  }

  setDirection (direction) {
    this.direction = direction
  }
}
