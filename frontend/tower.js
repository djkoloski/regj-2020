import { GAME_STATE } from './game'
import PIXI, { resources } from './PIXI'

export default class Tower extends PIXI.Container {
  constructor (x, y, rotation) {
    super()

    this.zIndex = -2

    this.x = x
    this.y = y
    this.rotation = rotation
  }

  update (delta) {}
}

const BASIC_TOWER_SHOOT_COOLDOWN = 400
const ADVANCED_TOWER_SHOOT_COOLDOWN = 300
const ELITE_TOWER_SHOOT_COOLDOWN = 200

export class BasicTower extends Tower {
  constructor (x, y, rotation) {
    super(x, y, rotation)

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

export class AdvancedTower extends Tower {
  constructor (x, y, rotation) {
    super(x, y, rotation)

    this.sprite = new PIXI.Sprite(resources.entities.spritesheet.textures[AdvancedTower.SPRITE])
    this.sprite.x = -8
    this.sprite.y = -8
    this.addChild(this.sprite)

    this.defaultRotation = rotation

    this.shootTimer = Math.random() * ADVANCED_TOWER_SHOOT_COOLDOWN
  }

  update (delta) {
    switch (this.parent.state) {
      case GAME_STATE.ACTION:
        let aim = { x: Math.cos(this.defaultRotation), y: Math.sin(this.defaultRotation) }
        let target = null
        let targetDistance = 0
        let targetRotation = 0
        for (let hazard of this.parent.hazards) {
          let d = { x: hazard.x - this.x, y: hazard.y - this.y }
          let len = Math.sqrt(d.x * d.x + d.y * d.y)
          let dot = (aim.x * d.x + aim.y * d.y) / len
          if (dot >= Math.cos(Math.PI / 4)) {
            if (target == null || len < targetDistance) {
              target = hazard
              targetDistance = len
              targetRotation = Math.atan2(d.y, d.x)
            }
          }
        }

        if (target !== null) {
          this.rotation = targetRotation
        }

        this.shootTimer = Math.max(0, this.shootTimer - delta)
        if (this.shootTimer === 0) {
          this.parent.spawnBullet(this.x, this.y, Math.cos(this.rotation), Math.sin(this.rotation))
          this.shootTimer = ADVANCED_TOWER_SHOOT_COOLDOWN
          resources.laserShoot.sound.play()
        }
        break
      case GAME_STATE.INTERMISSION:
        break
    }
  }
}
AdvancedTower.SPRITE = 'tower_1'
AdvancedTower.COST = 20

export class EliteTower extends Tower {
  constructor (x, y, rotation) {
    super(x, y, rotation)

    this.sprite = new PIXI.Sprite(resources.entities.spritesheet.textures[EliteTower.SPRITE])
    this.sprite.x = -8
    this.sprite.y = -8
    this.addChild(this.sprite)

    this.shootTimer = Math.random() * ELITE_TOWER_SHOOT_COOLDOWN
  }

  update (delta) {
    switch (this.parent.state) {
      case GAME_STATE.ACTION:
        let target = null
        let targetDistance = 0
        let targetRotation = 0
        for (let hazard of this.parent.hazards) {
          let d = { x: hazard.x - this.x, y: hazard.y - this.y }
          let len = Math.sqrt(d.x * d.x + d.y * d.y)
          if (target == null || len < targetDistance) {
            target = hazard
            targetDistance = len
            targetRotation = Math.atan2(d.y, d.x)
          }
        }

        if (target !== null) {
          this.rotation = targetRotation
        }

        this.shootTimer = Math.max(0, this.shootTimer - delta)
        if (this.shootTimer === 0) {
          this.parent.spawnBullet(this.x, this.y, Math.cos(this.rotation), Math.sin(this.rotation))
          this.shootTimer = ELITE_TOWER_SHOOT_COOLDOWN
          resources.laserShoot.sound.play()
        }
        break
      case GAME_STATE.INTERMISSION:
        break
    }
  }
}
EliteTower.SPRITE = 'tower_2'
EliteTower.COST = 30

export const TOWERS = [ BasicTower, AdvancedTower, EliteTower ]