import PIXI, { resources } from './PIXI'
import { STAGE_SIZE } from './constants'
import Input from './input'
import SpritesheetSprite from './spritesheetSprite'
import { GAME_STATE } from './game'
import { BasicTower } from './tower'

const FOOSTEP_COOLDOWN = 14
const IDLE_SPEED = 0.125
const ANIM_SPEED = 0.275
const INVINCIBILITY_COOLDOWN = 100
const INVINCIBILITY_FLASH_SPEED = 0.15
const SHOOT_COOLDOWN = 80

export const PLAYER_STATE = {
  NORMAL: 0,
  BUILDING: 1,
}

export default class Player extends PIXI.Container {
  constructor () {
    super()

    this.health = 3

    this.speed = 1.5
    this.direction = { x: 0, y: 0 }

    this.sprite = new SpritesheetSprite(resources.player)
    this.sprite.x = -8
    this.sprite.y = -8
    this.sprite.play('idle', IDLE_SPEED)
    this.addChild(this.sprite)

    this.building = new PIXI.Sprite()
    this.building.x = -8
    this.building.y = -28
    this.building.visible = false
    this.addChild(this.building)

    this.state = PLAYER_STATE.NORMAL
    this.shootCooldown = 0
    this.footstepCooldown = 0
    this.invincibilityCooldown = 0
  }

  input () {
    let result = {x: 0, y: 0}
    if (Input.moveRight.isDown()) {
      result.x += 1
    }
    if (Input.moveLeft.isDown()) {
      result.x -= 1
    }
    if (Input.moveUp.isDown()) {
      result.y -= 1
    }
    if (Input.moveDown.isDown()) {
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
    switch (this.state) {
      case PLAYER_STATE.NORMAL:
        this.building.visible = false

        this.setDirection(this.input())
        this.x += this.direction.x * this.speed * delta
        this.y += this.direction.y * this.speed * delta
    
        this.x = Math.max(8, Math.min(STAGE_SIZE.x - 8, this.x))
        this.y = Math.max(8, Math.min(STAGE_SIZE.y - 8, this.y))
    
        if (this.direction.x > 0) {
          this.sprite.play('right', ANIM_SPEED)
        } else if (this.direction.x < 0) {
          this.sprite.play('left', ANIM_SPEED)
        } else if (this.direction.y > 0) {
          this.sprite.play('down', ANIM_SPEED)
        } else if (this.direction.y < 0) {
          this.sprite.play('up', ANIM_SPEED)
        } else {
          this.sprite.play('idle', IDLE_SPEED)
        }
    
        this.footstepCooldown = Math.max(0, this.footstepCooldown - delta)
        if (this.footstepCooldown <= 0 && (this.direction.x != 0 || this.direction.y != 0)) {
          resources.footstep.sound.play()
          this.footstepCooldown = FOOSTEP_COOLDOWN
        }

        if (this.parent.state == GAME_STATE.INTERMISSION && Input.action1.pressed()) {
          this.state = PLAYER_STATE.BUILDING
          this.sprite.play('building', IDLE_SPEED)
          resources.openMenu.sound.play()
        }
        break
      case PLAYER_STATE.BUILDING:
        this.building.texture = resources.entities.spritesheet.textures[BasicTower.SPRITE]
        this.building.visible = true

        if (Input.action1.pressed()) {
          this.state = PLAYER_STATE.NORMAL
          resources.closeMenu.sound.play()
        }
        if (Input.shootRight.pressed()) {
          this.tryBuy(BasicTower, 0)
        }
        if (Input.shootDown.pressed()) {
          this.tryBuy(BasicTower, Math.PI / 2)
        }
        if (Input.shootLeft.pressed()) {
          this.tryBuy(BasicTower, Math.PI)
        }
        if (Input.shootUp.pressed()) {
          this.tryBuy(BasicTower, Math.PI * 3 / 2)
        }
        break
    }

    switch (this.parent.state) {
      case GAME_STATE.ACTION:
        this.state = PLAYER_STATE.NORMAL
        this.updateShoot(delta)
        this.invincibilityCooldown = Math.max(0, this.invincibilityCooldown - delta)
        this.sprite.visible = (Math.floor(this.invincibilityCooldown * INVINCIBILITY_FLASH_SPEED) % 2 == 0)
        break;
      case GAME_STATE.INTERMISSION:
        this.shootCooldown = 0
        this.invincibilityCooldown = 0
        this.sprite.visible = true
        break;
    }
  }

  tryBuy (tower, rotation) {
    if (this.parent.tryBuy(tower, rotation)) {
      this.state = PLAYER_STATE.NORMAL
    }
  }

  updateShoot (delta) {
    this.shootCooldown = Math.max(0, this.shootCooldown - delta)
    if (this.shootCooldown == 0) {
      if (Input.shootRight.isDown()) {
        this.shoot(1, 0)
      } else if (Input.shootUp.isDown()) {
        this.shoot(0, -1)
      } else if (Input.shootLeft.isDown()) {
        this.shoot(-1, 0)
      } else if (Input.shootDown.isDown()) {
        this.shoot(0, 1)
      }
    }
  }

  shoot (dx, dy) {
    this.parent.spawnBullet(this.x, this.y, dx, dy)
    this.shootCooldown = SHOOT_COOLDOWN
    resources.playerShoot.sound.play()
  }

  setDirection (direction) {
    this.direction = direction
  }

  takeDamage (amount) {
    if (this.invincibilityCooldown == 0) {
      this.health = Math.max(0, this.health - amount)
      this.invincibilityCooldown = INVINCIBILITY_COOLDOWN
      resources.damage.sound.play()
    }
  }

  get collider () {
    return {
      x: this.x,
      y: this.y,
      width: 8,
      height: 8,
    }
  }
}
