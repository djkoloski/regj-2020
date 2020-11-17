const CONFIG = {
  type: Phaser.CANVAS,
  canvas: document.getElementById('game'),
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
}

const game = new Phaser.Game(CONFIG)

function preload () {
  this.load.spritesheet({
    key: 'player',
    url: 'assets/player.png',
    frameConfig: {
      frameWidth: 64,
      frameHeight: 64
    }
  })
}

var player
var cursors

function create () {
  player = this.physics.add.sprite(100, 450, 'player')

  player.setCollideWorldBounds(true)

  this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
    frameRate: 8,
    repeat: -1
  })
  this.anims.create({
    key: 'down',
    frames: this.anims.generateFrameNumbers('player', { start: 8, end: 15 }),
    frameRate: 16,
    repeat: -1
  })
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('player', { start: 16, end: 23 }),
    frameRate: 16,
    repeat: -1
  })
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('player', { start: 24, end: 31 }),
    frameRate: 16,
    repeat: -1
  })
  this.anims.create({
    key: 'up',
    frames: this.anims.generateFrameNumbers('player', { start: 32, end: 39 }),
    frameRate: 16,
    repeat: -1
  })

  player.anims.play('idle', true)

  cursors = this.input.keyboard.createCursorKeys()
}

function update () {
  const PLAYER_SPEED = 250

  let anim = 'idle'
  let input = { x: 0, y: 0 }

  if (cursors.up.isDown) {
    input.y = -1
    anim = 'up'
  } else if (cursors.down.isDown) {
    input.y = 1
    anim = 'down'
  }

  if (cursors.left.isDown) {
    input.x = -1
    anim = 'left'
  } else if (cursors.right.isDown) {
    input.x = 1
    anim = 'right'
  }

  const inputLen = Math.max(1, Math.sqrt(input.x * input.x + input.y * input.y))
  player.setVelocityX(input.x * PLAYER_SPEED / inputLen)
  player.setVelocityY(input.y * PLAYER_SPEED / inputLen)
  player.anims.play(anim, true)
}