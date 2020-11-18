class Input {
  constructor (keys) {
    for (let name in keys) {
      this[name] = new Key(keys[name])
    }
  }
}

class Key {
  constructor (values) {
    this._values = values
    this._pressed = 0

    this._downListener = this._onKeyDown.bind(this)
    this._upListener = this._onKeyUp.bind(this)

    window.addEventListener('keydown', this._downListener, false)
    window.addEventListener('keyup', this._upListener, false)
  }

  isDown () {
    return this._pressed > 0
  }

  isUp () {
    return this._pressed == 0
  }

  _onKeyDown (e) {
    if (this._values.includes(e.key)) {
      if (!e.repeat) {
        if (this._pressed == 0 && this.onPressed) {
          this.onPressed()
        }
        this._pressed += 1
      }
      e.preventDefault()
    }
  }

  _onKeyUp (e) {
    if (this._values.includes(e.key)) {
      if (!e.repeat) {
        if (this._pressed == 1 && this.onReleased) {
          this.onReleased()
        }
        this._pressed -= 1
      }
      e.preventDefault()
    }
  }

  destroy () {
    window.removeEventListener('keydown', this._downListener)
    window.removeEventListener('keyup', this._upListener)
  }
}

export default new Input({
  'right': ['ArrowRight', 'd'],
  'up': ['ArrowUp', 'w'],
  'left': ['ArrowLeft', 'a'],
  'down': ['ArrowDown', 's'],
})
