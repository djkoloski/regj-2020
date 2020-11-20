import PIXI, { loader, resources } from './PIXI'
import { SpritesheetLoader, spritesheets } from './spritesheets'
import { APP_SIZE } from './constants'
import Title from './title'
import Input from './input'

// Init
let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas'
}
PIXI.utils.sayHello(type)
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

// Make app
let app = new PIXI.Application({
  width: APP_SIZE.width,
  height: APP_SIZE.height,
  antialias: false,
  transparent: false,
  resolution: 1
})
document.getElementById('game').appendChild(app.view)

// Load resources
loader
  .use(SpritesheetLoader)
  .add([
    { name: 'font', url: 'assets/lilian.fnt' },
    { name: 'bullet', url: 'assets/bullet.png' },
    { name: 'controls', url: 'assets/controls.png' },
    { name: 'header', url: 'assets/header.png' },
    { name: 'titleMusic', url: 'assets/glouglou.mp3' },
    { name: 'gameMusic', url: 'assets/skate.mp3' },
    { name: 'footstep', url: 'assets/footstep.mp3' },
    { name: 'playerShoot', url: 'assets/player_shoot.mp3' },
    { name: 'waveStart', url: 'assets/wave_start.mp3' },
    { name: 'waveEnd', url: 'assets/wave_end.mp3' },
    { name: 'damage', url: 'assets/damage.mp3' },
    { name: 'hit', url: 'assets/hit.mp3' },
    { name: 'explode', url: 'assets/explode.mp3' },
    { name: 'money', url: 'assets/money.mp3' },
    { name: 'interest', url: 'assets/interest.mp3' },
    { name: 'laserShoot', url: 'assets/laser_shoot.mp3' },
    { name: 'error', url: 'assets/error.mp3' },
    { name: 'openMenu', url: 'assets/open_menu.mp3' },
    { name: 'closeMenu', url: 'assets/close_menu.mp3' },
  ])
  .add(spritesheets)
  .load(setup)

// Main loop
let mode

function setMode (newMode) {
  if (mode !== undefined) {
    mode.destroy()
  }
  mode = newMode
  app.stage.addChild(mode)
}

function setup () {
  app.ticker.add(delta => gameLoop(delta))

  app.stage.scale.x = 3
  app.stage.scale.y = 3

  // balance
  resources.titleMusic.sound.loop = true

  resources.gameMusic.sound.volume = 0.4
  resources.gameMusic.sound.loop = true

  resources.footstep.sound.volume = 0.75

  resources.waveStart.sound.volume = 0.5
  resources.waveEnd.sound.volume = 0.5

  resources.interest.sound.volume = 0.25

  resources.laserShoot.sound.volume = 0.25

  resources.openMenu.sound.volume = 0.75
  resources.closeMenu.sound.volume = 0.75

  setMode(new Title())
}

function gameLoop(delta) {
  let result = mode.update(delta)
  if (result !== undefined) {
    setMode(result)
  }

  Input.update()
}
