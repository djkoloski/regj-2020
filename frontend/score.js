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
  constructor (score) {
    super()

    let record = Number(localStorage.getItem('record') || '0')
    if (score > record) {
      localStorage.setItem('record', score.toString())
    }

    this.time = 0

    this.title = new PIXI.BitmapText('GAME OVER', { fontName: 'Lilian', fontSize: 24 })
    this.title.x = (STAGE_SIZE.x - this.title.textWidth) / 2
    this.title.y = -(this.title.textHeight + TITLE_MARGIN)
    this.addChild(this.title)

    this.instructions = new PIXI.BitmapText('Press space to try again', { fontName: 'Lilian', fontSize: 12, tint: 0xE6A800 })
    this.instructions.x = (STAGE_SIZE.x - this.instructions.textWidth) / 2
    this.instructions.y = 200
    this.instructions.visible = false
    this.addChild(this.instructions)

    this.buildSprite = new SpritesheetSprite(resources.player)
    this.buildSprite.x = 152
    this.buildSprite.y = 124
    this.buildSprite.visible = false
    this.buildSprite.play('building', 0.125)
    this.buildSprite.visible = false
    this.addChild(this.buildSprite)

    this.score = new PIXI.BitmapText(`★ ${score} ★`, { fontName: 'Lilian', fontSize: 24, tint: 0xE6A800 })
    this.score.x = (STAGE_SIZE.x - this.score.textWidth) / 2
    this.score.y = 75
    this.score.visible = false
    this.addChild(this.score)

    let recordString = `Record: ${record} `
    if (score > record) {
      recordString = `NEW RECORD`
    }
    this.bestScore = new PIXI.BitmapText(recordString, { fontName: 'Lilian', fontSize: 12 })
    this.bestScore.x = (STAGE_SIZE.x - this.bestScore.textWidth) / 2
    this.bestScore.y = 100
    this.bestScore.visible = false
    this.addChild(this.bestScore)

    this.music = resources.titleMusic.sound.play()
  }

  update (delta) {
    this.time += delta

    const titleAnimTime = Math.min(1, this.time * TITLE_SPEED)
    this.title.y = TITLE_MARGIN + (this.title.textHeight + TITLE_MARGIN) * (Easings.easeOutBounce(titleAnimTime) - 1)

    const instructionsAnimTime = this.time * INSTRUCTIONS_SPEED - INSTRUCTIONS_DELAY
    let controlsVisible = (instructionsAnimTime > 0)
    this.buildSprite.visible = controlsVisible
    this.score.visible = controlsVisible
    this.bestScore.visible = controlsVisible
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
