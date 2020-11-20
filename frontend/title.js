import PIXI, { resources } from './PIXI'
import { STAGE_SIZE } from './constants'
import Easings from './easings'
import Input from './input'
import Game from './game'
import SpritesheetSprite from './spritesheetSprite'

const TITLE_MARGIN = 20
const TITLE_SPEED = 0.01

const INSTRUCTIONS_DELAY = 3
const INSTRUCTIONS_SPEED = 0.025

export default class Title extends PIXI.Container {
  constructor () {
    super()

    this.time = 0

    this.title = new PIXI.BitmapText('CONSTRUCTION ZONE', { fontName: 'Lilian', fontSize: 24 })
    this.title.x = (STAGE_SIZE.x - this.title.textWidth) / 2
    this.title.y = -(this.title.textHeight + TITLE_MARGIN)
    this.addChild(this.title)

    this.controls = new PIXI.Sprite(resources.controls.texture)
    this.controls.visible = false
    this.addChild(this.controls)

    this.instructions = new PIXI.BitmapText('Press space to continue', { fontName: 'Lilian', fontSize: 12, tint: 0xE6A800 })
    this.instructions.x = (STAGE_SIZE.x - this.instructions.textWidth) / 2
    this.instructions.y = 200
    this.instructions.visible = false
    this.addChild(this.instructions)

    this.moveSprite = new SpritesheetSprite(resources.player)
    this.moveSprite.x = 62
    this.moveSprite.y = 104
    this.moveSprite.visible = false
    this.moveSprite.play('right', 0.275)
    this.addChild(this.moveSprite)

    this.shootSprite = new SpritesheetSprite(resources.player)
    this.shootSprite.x = 141
    this.shootSprite.y = 104
    this.shootSprite.visible = false
    this.shootSprite.play('idle', 0.125)
    this.addChild(this.shootSprite)

    this.buildSprite = new SpritesheetSprite(resources.player)
    this.buildSprite.x = 240
    this.buildSprite.y = 104
    this.buildSprite.visible = false
    this.buildSprite.play('building', 0.125)
    this.addChild(this.buildSprite)

    this.music = resources.titleMusic.sound.play()
  }

  update (delta) {
    this.time += delta

    const titleAnimTime = Math.min(1, this.time * TITLE_SPEED)
    this.title.y = TITLE_MARGIN + (this.title.textHeight + TITLE_MARGIN) * (Easings.easeOutBounce(titleAnimTime) - 1)

    const instructionsAnimTime = this.time * INSTRUCTIONS_SPEED - INSTRUCTIONS_DELAY
    let controlsVisible = (instructionsAnimTime > 0)
    this.controls.visible = controlsVisible
    this.moveSprite.visible = controlsVisible
    this.shootSprite.visible = controlsVisible
    this.buildSprite.visible = controlsVisible
    this.instructions.visible = (instructionsAnimTime > 0 && Math.floor(instructionsAnimTime) % 2 == 0)

    if (Input.confirm.isDown()) {
      return new Game()
    }
  }

  destroy () {
    super.destroy()

    this.music.destroy()
  }
}
