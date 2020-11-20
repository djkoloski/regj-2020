import PIXI from '../PIXI'

import entities from './entities'
import player from './player'
import bulletTravel from './bulletTravel'

export function SpritesheetLoader (res, next) {
  if ('spritesheet' in res.metadata) {
    const spritesheet = new PIXI.Spritesheet(res.texture, res.metadata.spritesheet)
    spritesheet.parse(() => {
      res.spritesheet = spritesheet
      res.textures = spritesheet.textures
      next()
    })
  } else {
    next()
  }
}

export const spritesheets = [
  { name: 'player', url: 'assets/player.png', metadata: { spritesheet: player } },
  { name: 'entities', url: 'assets/entities.png', metadata: { spritesheet: entities } },
  { name: 'bulletTravel', url: 'assets/bullet_travel.png', metadata: { spritesheet: bulletTravel } },
]
