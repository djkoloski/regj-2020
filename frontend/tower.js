import { GAME_STATE } from './game'
import PIXI, { resources } from './PIXI'

export default class Tower extends PIXI.Container {
  constructor (x, y, rotation) {
    super()

    this.x = x
    this.y = y
    this.rotation = rotation
  }

  update (delta) {}
}

const BASIC_TOWER_SHOOT_COOLDOWN = 400

export class BasicTower extends Tower {
  constructor (x, y, rotation) {
    super(x, y, rotation)

    this.zIndex = -2

    this.sprite = new PIXI.Sprite(resources.entities.spritesheet.textures[BasicTower.SPRITE])
    this.sprite.x = -8
    this.sprite.y = -8
    this.addChild(this.sprite)

    this.shootTimer = Math.random() * BASIC_TOWER_SHOOT_COOLDOWN
  }

  update (delta) {
    switch (this.parent.state) {
      case GAME_STATE.ACTION:
        this.shootTimer = Math.max(0, this.shootTimer - delta)
        if (this.shootTimer === 0) {
          this.parent.spawnBullet(this.x, this.y, Math.cos(this.rotation), Math.sin(this.rotation))
          this.shootTimer = BASIC_TOWER_SHOOT_COOLDOWN
          resources.laserShoot.sound.play()
        }
        break
      case GAME_STATE.INTERMISSION:
        break
    }
  }
}
BasicTower.SPRITE = 'tower_0'
BasicTower.COST = 10
