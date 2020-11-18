import PIXI, { resources } from './PIXI'

export default class SpritesheetSprite extends PIXI.AnimatedSprite {
  constructor(resource) {
    const animations = resource.spritesheet.animations
    const animation = Object.keys(animations)[0]
    super(animations[animation])

    this.animations = animations
    this.animation = animation
  }

  play (animation, speed) {
    if (animation !== this.animation) {
      this.textures = this.animations[animation]
      this.animation = animation
    }
    this.animationSpeed = speed || 1
    super.play()
  }
}