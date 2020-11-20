class Input {
  constructor (keys) {
    this.keys = {}
    for (let name in keys) {
      this.keys[name] = new Key(keys[name])
      this[name] = this.keys[name]
    }
  }

  update () {
    for (let name in this.keys) {
      this.keys[name].update()
    }
  }
}

class Key {
  constructor (values) {
    this._values = values
    this._pressed = 0

    this._pressedThisFrame = false
    this._releasedThisFrame = false

    this._downListener = this._onKeyDown.bind(this)
    this._upListener = this._onKeyUp.bind(this)

    window.addEventListener('keydown', this._downListener, false)
    window.addEventListener('keyup', this._upListener, false)
  }

  isDown () {
    return this._pressed > 0
  }

  pressed () {
    return this._pressedThisFrame
  }

  isUp () {
    return this._pressed == 0
  }

  released () {
    return this._releasedThisFrame
  }

  _onKeyDown (e) {
    if (this._values.includes(e.key)) {
      if (!e.repeat) {
        this._pressed += 1
        if (this._pressed == 1) {
          this._pressedThisFrame = true
        }
      }
      e.preventDefault()
    }
  }

  _onKeyUp (e) {
    if (this._values.includes(e.key)) {
      if (!e.repeat) {
        this._pressed -= 1
        if (this._pressed == 0) {
          this._releasedThisFrame = true
        }
      }
      e.preventDefault()
    }
  }

  update () {
    this._pressedThisFrame = false
    this._releasedThisFrame = false
  }

  destroy () {
    window.removeEventListener('keydown', this._downListener)
    window.removeEventListener('keyup', this._upListener)
  }
}

export default new Input({
  'moveRight': ['d'],
  'moveUp': ['w'],
  'moveLeft': ['a'],
  'moveDown': ['s'],
  'shootRight': ['ArrowRight'],
  'shootUp': ['ArrowUp'],
  'shootLeft': ['ArrowLeft'],
  'shootDown': ['ArrowDown'],
  'confirm': [' '],
  'action1': ['z'],
  'action2': ['x'],
  'action3': ['c'],
  // TODO remove
  'cheat': ['p'],
  'back': ['Escape'],
})
