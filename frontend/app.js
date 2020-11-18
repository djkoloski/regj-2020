import PIXI, { loader } from './PIXI'
import { SpritesheetLoader, spritesheets } from './spritesheets'
import Player from './player'

// Init
let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas'
}
PIXI.utils.sayHello(type)
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

// Make app
let app = new PIXI.Application({
  width: 800,
  height: 600,
  antialias: false,
  transparent: false,
  resolution: 1
})
document.getElementById('game').appendChild(app.view)

// Load resources
loader
  .use(SpritesheetLoader)
  .add(spritesheets)
  .load(setup)

let player

function setup () {
  app.stage.scale.x = 3
  app.stage.scale.y = 3

  player = new Player()
  app.stage.addChild(player)

  player.x = 10
  player.y = 10

  app.ticker.add(delta => gameLoop(delta))
}

function gameLoop(delta) {
  player.update(delta)
}
