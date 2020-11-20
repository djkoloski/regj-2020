import PIXI, { resources } from './PIXI'
import { STAGE_SIZE } from './constants'
import Input from './input'
import Player from './player'
import Score from './score'
import Bullet from './bullet'
import LEVELS from './levels'

function overlaps(a, b) {
  let ax0 = a.x - a.width
  let ax1 = a.x + a.width
  let ay0 = a.y - a.height
  let ay1 = a.y + a.height

  let bx0 = b.x - b.width
  let bx1 = b.x + b.width
  let by0 = b.y - b.height
  let by1 = b.y + b.height

  return ax0 < bx1 && ax1 > bx0 && ay0 < by1 && ay1 > by0
}

const BULLET_SPEED = 3
// 1 interest for every 10 saved
const INTEREST = 0.1
const INSTRUCTIONS_SPEED = 0.025

export const GAME_STATE = {
  ACTION: 0,
  INTERMISSION: 1,
}

export default class Game extends PIXI.Container {
  constructor () {
    super()

    this.x = 0
    this.y = 30
    this.sortableChildren = true

    let header = new PIXI.Sprite(resources.header.texture)
    header.y = -30
    header.zIndex = 1
    this.addChild(header)

    this.levelName = new PIXI.BitmapText('', { fontName: 'Lilian', fontSize: 16 })
    this.levelName.x = (STAGE_SIZE.x - this.levelName.textWidth) / 2
    this.levelName.y = -27
    this.levelName.zIndex = 1
    this.addChild(this.levelName)

    this.health = new PIXI.BitmapText('', { fontName: 'Lilian', fontSize: 16 })
    this.health.x = 5
    this.health.y = -27
    this.health.zIndex = 1
    this.addChild(this.health)

    this.bank = new PIXI.BitmapText('', { fontName: 'Lilian', fontSize: 16 })
    this.bank.x = STAGE_SIZE.x - this.bank.textWidth - 5
    this.bank.y = -27
    this.bank.zIndex = 1
    this.addChild(this.bank)

    this.instructions = new PIXI.BitmapText('Press space to continue', { fontName: 'Lilian', fontSize: 12, tint: 0xE6A800 })
    this.instructions.x = (STAGE_SIZE.x - this.instructions.textWidth) / 2
    this.instructions.y = 170
    this.instructions.visible = false
    this.instructions.zIndex = -1
    this.addChild(this.instructions)

    this.player = new Player()
    this.player.x = STAGE_SIZE.x / 2
    this.player.y = STAGE_SIZE.y / 2
    this.player.zIndex = 1
    this.addChild(this.player)

    this.state = GAME_STATE.ACTION
    this.levelIndex = 0

    this.time = 0
    this.money = 0
    this.earned = 0
    this.bullets = []
    this.hazards = []
    this.towers = []

    this.music = resources.gameMusic.sound.play()

    this.action()
  }

  update (delta) {
    this.time += delta

    this.player.update(delta)

    // TODO remove
    if (Input.cheat.pressed()) {
      for (let hazard of this.hazards) {
        hazard.kill()
        this.money += hazard.value
        this.earned += hazard.value
      }
    }

    switch (this.state) {
      case GAME_STATE.ACTION:
        if (this.wave === null) {
          if (this.levelIndex == LEVELS.length - 1) {
            return new Score(this.earned, true)
          }
          this.intermission()
          break
        }

        this.updateHazards(delta)
        this.updateBullets(delta)
        this.updateTowers(delta)

        if (this.player.health <= 0) {
          return new Score(this.earned, false)
        }

        this.health.text = '♥ '.repeat(this.player.health)
        this.levelName.text = LEVELS[this.levelIndex].name
        this.bank.text = `$ ${this.money}`
        this.instructions.visible = false
        break;
      case GAME_STATE.INTERMISSION:
        if (Input.confirm.pressed()) {
          this.action()
        }

        this.health.text = `${this.earned} ★`
        this.levelName.text = '♩ INTERMISSION ♩'
        this.bank.text = `$ ${this.money}`
        this.instructions.visible = (Math.floor(this.time * INSTRUCTIONS_SPEED) % 2 == 0)
        break;
      default:
        break;
    }

    this.bullets = this.clean(this.bullets)
    this.hazards = this.clean(this.hazards)

    if (this.wave != null) {
      this.wave.update(delta)
    }

    this.levelName.x = (STAGE_SIZE.x - this.levelName.textWidth) / 2
    this.bank.x = STAGE_SIZE.x - this.bank.textWidth - 5
  }

  clean (entities) {
    let result = []
    for (let entity of entities) {
      if (entity.isDead()) {
        entity.destroy()
      } else {
        result.push(entity)
      }
    }
    return result
  }

  destroy () {
    super.destroy()
    this.music.destroy()
  }

  spawnBullet (x, y, dx, dy) {
    let vx = dx * BULLET_SPEED
    let vy = dy * BULLET_SPEED
    let bullet = new Bullet(x, y, vx, vy)
    this.addChild(bullet)
    this.bullets.push(bullet)
  }

  updateHazards (delta) {
    this.hazards = this.hazards.filter(hazard => !hazard._destroyed)
    for (let hazard of this.hazards) {
      hazard.update(delta)
      if (overlaps(this.player.collider, hazard.collider)) {
        this.player.takeDamage(1)
      }
    }
  }

  updateBullets (delta) {
    for (let bullet of this.bullets) {
      bullet.update(delta)
      for (let hazard of this.hazards) {
        if (!hazard.isDead() && overlaps(bullet.collider, hazard.collider)) {
          hazard.takeDamage(bullet.damage)
          bullet.hit()

          if (hazard.isDead()) {
            this.money += hazard.value
            this.earned += hazard.value
          }
        }
      }
    }
  }

  updateTowers (delta) {
    for (let tower of this.towers) {
      tower.update(delta)
    }
  }

  addMoney (amount) {
    this.money += amount
    this.earned += amount
  }

  addHazard (hazard) {
    this.addChild(hazard)
    this.hazards.push(hazard)
  }

  startWave () {
    this.wave = LEVELS[this.levelIndex].waves[this.waveIndex](this)
  }

  advanceWave () {
    this.waveIndex += 1
    if (this.waveIndex < LEVELS[this.levelIndex].waves.length) {
      this.startWave()
    } else {
      this.wave = null
    }
  }

  action () {
    // Reward players for saving
    let interest = Math.floor(this.money * INTEREST)
    if (interest > 0) {
      this.addMoney(interest)
      resources.interest.sound.play()
    }

    this.state = GAME_STATE.ACTION

    // Danger noise
    resources.waveStart.sound.play()

    this.time = 0

    // Start waves
    this.waveIndex = 0
    this.startWave()
  }

  intermission () {
    // Destroy all hazards and bullets
    for (let bullet of this.bullets) {
      bullet.destroy()
    }
    this.bullets = []
    for (let hazard of this.hazards) {
      hazard.destroy()
    }
    this.hazards = []

    // Reset state
    this.time = 0
    this.player.health = 3

    this.state = GAME_STATE.INTERMISSION

    // Next level
    this.levelIndex = Math.min(LEVELS.length - 1, this.levelIndex + 1)

    // Happy noise
    resources.waveEnd.sound.play()
  }

  tryBuy (Tower, rotation) {
    if (this.money >= Tower.COST) {
      this.money -= Tower.COST
      let tower = new Tower(this.player.x, this.player.y, rotation)
      this.addChild(tower)
      this.towers.push(tower)
      resources.money.sound.play()
      return true
    } else {
      resources.error.sound.play()
      return false
    }
  }
}