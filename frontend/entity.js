import PIXI from './PIXI'

export default class Entity extends PIXI.Container {
  constructor () {
    super()

    this._dead = false
  }

  kill () {
    this._dead = true
  }

  isDead () {
    return this._dead
  }
}
