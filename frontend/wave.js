import { STAGE_SIZE } from './constants'
import Hazard, { BouncingHazard, RingHazard } from './hazard'
import Easings from './easings'

const STAGE_OUTER_RADIUS = Math.sqrt(Math.pow(STAGE_SIZE.x / 2, 2) + Math.pow(STAGE_SIZE.y / 2, 2))
const STAGE_INNER_RADIUS = Math.min(STAGE_SIZE.x, STAGE_SIZE.y) / 2

function randomPoint(radius) {
  let angle = Math.random() * 2 * Math.PI
  return {
    x: STAGE_SIZE.x / 2 + Math.cos(angle) * radius,
    y: STAGE_SIZE.y / 2 + Math.sin(angle) * radius,
  }
}

function direction(from, to) {
  let dx = to.x - from.x
  let dy = to.y - from.y
  let len = Math.sqrt(dx * dx + dy * dy)
  return {
    x: dx / len,
    y: dy / len,
  }
}

function resolve(value) {
  if (typeof value === 'function') {
    return value()
  } else {
    return value
  }
}

export default class Wave {
  constructor (game) {
    this.game = game
  }

  update (delta) {}
}

export function spawnBouncingHazards(game, amount, health, scale, velocity) {
  for (let i = 0; i < amount; ++i) {
    let pos = randomPoint(STAGE_OUTER_RADIUS + 20)
    let target = randomPoint(STAGE_INNER_RADIUS - 20)
    let dir = direction(pos, target)
    let vel = resolve(velocity)
    game.addHazard(new BouncingHazard(pos.x, pos.y, resolve(health), resolve(scale), dir.x * vel, dir.y * vel))
  }
}

export function spawnRingHazards(game, amount, health, scale, centerX, centerY, outer, inner) {
  let cx = resolve(centerX)
  let cy = resolve(centerY)
  let otr = resolve(outer)
  let inr = resolve(inner)
  for (let i = 0; i < amount; ++i) {
    let angle = i / amount * 2 * Math.PI
    game.addHazard(new RingHazard(resolve(health), resolve(scale), cx, cy, angle, STAGE_OUTER_RADIUS + 20, otr, inr))
  }
}

export function spawnVerticalWall(game, amount, health, scale, x, vx, offset) {
  for (let i = 0; i < amount; ++i) {
    let y = STAGE_SIZE.y * (i + 0.5 + offset) / amount
    game.addHazard(new BouncingHazard(x, y, resolve(health), resolve(scale), vx, 0))
  }
}

export class WaitSecondsWave extends Wave {
  constructor (game, duration) {
    super(game)

    this.duration = duration * 48
  }

  update (delta) {
    super.update(delta)

    this.duration = Math.max(0, this.duration - delta)
    if (this.duration === 0) {
      this.game.advanceWave()
    }
  }
}

export class WaitHazardsClearWave extends Wave {
  constructor (game) {
    super(game)
  }

  update (delta) {
    super.update(delta)

    if (this.game.hazards.length === 0) {
      this.game.advanceWave()
    }
  }
}

const BOSS_WAVE_SPAN = 20
const BOSS_MOVE_SPAN = 2

export class BossWave extends Wave {
  constructor (game) {
    super(game)

    this.boss = new Hazard(-STAGE_SIZE.y / 2, STAGE_SIZE.y / 2, 25, STAGE_SIZE.y / 16)
    this.game.addHazard(this.boss)

    this.time = 0

    spawnBouncingHazards(game, 6, 2, 1, 1.5)
  }

  update (delta) {
    super.update(delta)

    if (this.boss.isDead()) {
      this.game.advanceWave()
      return
    }

    let lastIndex = Math.floor(this.time / BOSS_WAVE_SPAN)
    this.time += delta / 48
    let index = Math.floor(this.time / BOSS_WAVE_SPAN)

    let t = Math.min(1, (this.time % BOSS_WAVE_SPAN) / BOSS_MOVE_SPAN)
    this.boss.x = -STAGE_SIZE.y / 2 + (index + Easings.easeOutBounce(t)) * STAGE_SIZE.x / 4

    if (lastIndex != index) {
      spawnBouncingHazards(this.game, 6 - index, 2, 1, 1.5)
    }
  }
}
