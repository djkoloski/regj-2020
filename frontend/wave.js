import { STAGE_SIZE } from './constants'
import { BouncingHazard } from './hazard'

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
