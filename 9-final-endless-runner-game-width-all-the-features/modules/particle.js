import Game from './game.js'

export class Particle {
  constructor(game) {
    /** @type {Game} */
    this.game = game
    this.markedForDeletion = false
  }

  update() {
    this.x -= this.speedX + this.game.speed
    this.y -= this.speedY
    this.size *= 0.95
    if (this.size < 0.5) this.markedForDeletion = true
  }
}

export class Dust extends Particle {
  constructor(game, x, y) {
    super(game)
    this.size = Math.random() * 10 + 10
    this.x = x
    this.y = y
    this.speedX = Math.random()
    this.speedY = Math.random()
    this.color = 'rgba(0,0,0,0.2)'
  }

  /**
   *
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    context.beginPath()
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    context.fillStyle = this.color
    context.fill()
  }
}

export class Splash extends Particle {
  constructor(game, x, y) {
    super(game)
    this.size = Math.random() * 100 + 100
    this.x = x - this.size * 0.4
    this.y = y - this.size * 0.5
    this.speedX = Math.random() * 6 - 4
    this.speedY = Math.random() * 2 + 1
    this.gravity = 0
    this.image = document.getElementById('fire')
  }

  update() {
    super.update()
    this.gravity += 0.1
    this.y += this.gravity
  }

  /**
   *
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.size, this.size)
  }
}

export class Fire extends Particle {
  constructor(game, x, y) {
    super(game)
    this.size = Math.random() * 100 + 100
    this.x = x
    this.y = y
    this.speedX = 1
    this.speedY = 1
    this.image = document.getElementById('fire')
    this.angle = 0
    this.va = Math.random() * 0.2 - 0.1
  }

  update() {
    super.update()
    this.angle += this.va
    this.x += Math.sin(this.angle * 5)
  }

  /**
   *
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    context.save()
    context.translate(this.x, this.y)
    context.rotate(this.angle)
    context.drawImage(
      this.image,
      -this.size * 0.5,
      -this.size * 0.5,
      this.size,
      this.size
    )
    context.restore()
  }
}
