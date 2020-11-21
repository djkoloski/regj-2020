class Input {
  constructor (keys) {
    this.keys = {}
    for (let name in keys) {
      this.keys[name] = new Key(keys[name])
      this[name] = this.keys[name]
    }

    this.gamepads = {}
    window.addEventListener('gamepadconnected', e => this.addGamepad(e.gamepad))
    window.addEventListener('gamepaddisconnectded', e => this.removeGamepad(e.gamepad))
  }

  addGamepad (gamepad) {
    this.gamepads[gamepad.index] = gamepad
  }

  removeGamepad (gamepad) {
    delete this.gamepads[gamepad.index]
  }

  update () {
    if (!('ongamepadconnected' in window)) {
      this.scanGamepads()
    }

    for (let name in this.keys) {
      this.keys[name].update(this.gamepads)
    }
  }

  scanGamepads () {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [])
    for (let i = 0; i < gamepads.length; ++i) {
      if (gamepads[i]) {
        if (gamepads[i].index in this.gamepads) {
          this.gamepads[gamepads[i].index] = gamepads[i]
        } else {
          this.addGamepad(gamepads[i])
        }
      }
    }
  }
}

class Key {
  constructor (config) {
    this._key = config.key
    this._pressed = false
    this._button = config.button
    this._gamepadPressed = false

    this._pressedThisFrame = false
    this._releasedThisFrame = false

    this._downListener = this._onKeyDown.bind(this)
    this._upListener = this._onKeyUp.bind(this)

    window.addEventListener('keydown', this._downListener, false)
    window.addEventListener('keyup', this._upListener, false)
  }

  isDown () {
    return this._pressed || this._gamepadPressed
  }

  pressed () {
    return this._pressedThisFrame
  }

  isUp () {
    return !this._pressed && !this._gamepadPressed
  }

  released () {
    return this._releasedThisFrame
  }

  _onKeyDown (e) {
    if (this._key == e.key) {
      if (!e.repeat) {
        this._pressed = true
        this._pressedThisFrame = true
      }
      e.preventDefault()
    }
  }

  _onKeyUp (e) {
    if (this._key == e.key) {
      if (!e.repeat) {
        this._pressed = false
        this._releasedThisFrame = true
      }
      e.preventDefault()
    }
  }

  update (gamepads) {
    this._pressedThisFrame = false
    this._releasedThisFrame = false

    for (let index in gamepads) {
      let gamepad = gamepads[index]
      if (gamepad.buttons[this._button].pressed) {
        this._pressedThisFrame = !this._gamepadPressed
        this._gamepadPressed = true
      } else {
        this._releasedThisFrame = this._gamepadPressed
        this._gamepadPressed = false
      }
    }
  }

  destroy () {
    window.removeEventListener('keydown', this._downListener)
    window.removeEventListener('keyup', this._upListener)
  }
}

window.Input = new Input({
  'moveRight': { key: 'd', button: 15 },
  'moveUp': { key: 'w', button: 12 },
  'moveLeft': { key: 'a', button: 14 },
  'moveDown': { key: 's', button: 13 },
  'shootRight': { key: 'ArrowRight', button: 1 },
  'shootUp': { key: 'ArrowUp', button: 3 },
  'shootLeft': { key: 'ArrowLeft', button: 2 },
  'shootDown': { key: 'ArrowDown', button: 0 },
  'confirm': { key: ' ', button: 9 },
  'action1': { key: 'z', button: 5 },
  'back': { key: 'Escape', button: 8 },
})

export default window.Input
