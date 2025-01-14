document.addEventListener('DOMContentLoaded', () => {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById('mainCanvas')
  const ctx = canvas.getContext('2d')

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  /** @type {HTMLCanvasElement} */
  const collisionCanvas = document.getElementById('collisionCanvas')
  const collisionCtx = collisionCanvas.getContext('2d')

  collisionCanvas.width = window.innerWidth
  collisionCanvas.height = window.innerHeight

  /** @type {HTMLCanvasElement} */
  const backgroundCanvas = document.getElementById('backgroundCanvas')
  const backgroundCtx = backgroundCanvas.getContext('2d')

  backgroundCanvas.width = window.innerWidth
  backgroundCanvas.height = window.innerHeight

  /** @type {HTMLCanvasElement} */
  const targetCanvas = document.getElementById('targetCanvas')
  const targetCtx = targetCanvas.getContext('2d')

  targetCanvas.width = window.innerWidth
  targetCanvas.height = window.innerHeight

  class Target {
    constructor() {
      this.x = 0
      this.y = 0
      this.sizeModifier = 0.5
      this.spriteWidth = 128
      this.spriteHeight = 128
      this.width = this.spriteWidth * this.sizeModifier
      this.height = this.spriteHeight * this.sizeModifier
      this.image = target
    }

    update(x = 0, y = 0) {
      this.x = x
      this.y = y
    }

    draw() {
      targetCtx.save()
      targetCtx.globalCompositeOperation = 'source-out'
      targetCtx.fillStyle = 'red'
      targetCtx.fillRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      )
      targetCtx.globalCompositeOperation = 'destination-in'
      targetCtx.drawImage(
        this.image,
        0,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      )
    }
  }

  class Game {
    constructor(ctx, collisionCtx, width, height) {
      /** @type {Enemy[]} */
      this.enemies = []
      /** @type {CanvasRenderingContext2D} */
      this.ctx = ctx
      /** @type {CanvasRenderingContext2D} */
      this.collisionCtx = collisionCtx
      this.width = width
      this.height = height
      this.enemyInterval = 500
      this.enemyTimer = 0
      this.enemyType = ['worm', 'ghost', 'spider']
    }
    update(deltaTime) {
      this.enemies = this.enemies.filter((ob) => !ob.markedForDeletion)
      if (this.enemyTimer > this.enemyInterval) {
        this.#addNewEnemy()
        this.enemyTimer = 0
      } else {
        this.enemyTimer += deltaTime
      }
      this.enemies.forEach((ob) => ob.update(deltaTime))
    }
    draw() {
      this.enemies.forEach((ob) => ob.draw())
    }
    handleShort(x, y) {
      const pc = [...this.collisionCtx.getImageData(x, y, 1, 1).data]
      if (pc.every((i) => !i)) return
      this.enemies.forEach((object) => {
        if (
          object.randomColor[0] !== pc[0] ||
          object.randomColor[1] !== pc[1] ||
          object.randomColor[2] !== pc[2]
        )
          return
        object.markedForDeletion = true
      })
    }
    #addNewEnemy() {
      const randomEnemy =
        this.enemyType[Math.floor(Math.random() * this.enemyType.length)]

      switch (randomEnemy) {
        case 'worm':
          this.enemies.push(new Worm(this))
          break
        case 'ghost':
          this.enemies.push(new Ghost(this))
          break
        case 'spider':
          this.enemies.push(new Spider(this))
          break
        default:
          this.enemies.push(new Worm(this))
      }

      // this.enemies.sort((a, b) => a.y - b.y)
    }
  }

  class Enemy {
    /**
     *
     * @param {Game} game
     */
    constructor(game) {
      /** @type {Game} */
      this.game = game
      this.markedForDeletion = false
      this.frameX = 0
      this.maxFrame = 5
      this.frameInterval = 100
      this.frameTimer = 0
      this.randomColor = [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
      ]
      this.collisionColor = `rgb(${this.randomColor[0]},${this.randomColor[1]},${this.randomColor[2]})`
    }
    update(deltaTime) {
      this.x -= this.vx * deltaTime
      if (this.x < 0 - this.width) this.markedForDeletion = true
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX < this.maxFrame) this.frameX++
        else this.frameX = 0
        this.frameTimer = 0
      } else {
        this.frameTimer += deltaTime
      }
    }
    draw() {
      this.game.collisionCtx.save()
      this.game.collisionCtx.fillStyle = this.collisionColor
      this.game.collisionCtx.fillRect(this.x, this.y, this.width, this.height)
      this.game.collisionCtx.restore()

      this.game.ctx.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      )
    }
  }

  class Worm extends Enemy {
    constructor(game) {
      super(game)
      this.enemyType = 'worm'
      this.image = worm
      this.spriteWidth = 229
      this.spriteHeight = 171
      this.width = this.spriteWidth / 2
      this.height = this.spriteHeight / 2
      this.x = this.game.width
      this.y = this.game.height - this.height
      this.vx = Math.random() * 0.1 + 0.1
    }
  }

  class Ghost extends Enemy {
    constructor(game) {
      super(game)
      this.enemyType = 'ghost'
      this.image = ghost
      this.spriteWidth = 261
      this.spriteHeight = 209
      this.width = this.spriteWidth / 2
      this.height = this.spriteHeight / 2
      this.x = this.game.width
      this.y = Math.random() * this.game.height * 0.6
      this.vx = Math.random() * 0.2 + 0.1
      this.angle = 0
      this.curve = Math.random() * 3
    }
    update(deltaTime) {
      super.update(deltaTime)
      this.y += Math.sin(this.angle) * this.curve
      this.angle += 0.04
    }
    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw() {
      this.game.ctx.save()
      this.game.ctx.globalAlpha = 0.5
      super.draw(this.game.ctx)
      this.game.ctx.restore()
    }
  }

  class Spider extends Enemy {
    constructor(game) {
      super(game)
      this.enemyType = 'spider'
      this.image = spider
      this.spriteWidth = 310
      this.spriteHeight = 175
      this.width = this.spriteWidth / 2
      this.height = this.spriteHeight / 2
      this.x = Math.random() * (this.game.width - this.width)
      this.y = 0 - this.height
      this.vx = 0
      this.vy = Math.random() * 0.1 + 0.1
      this.maxLength = Math.random() * this.game.height
    }
    update(deltaTime) {
      super.update(deltaTime)
      if (this.y < 0 - this.height * 2) this.markedForDeletion = true
      this.y += this.vy * deltaTime
      if (this.y > this.maxLength) this.vy *= -1
    }
    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw() {
      this.game.ctx.beginPath()
      this.game.ctx.moveTo(this.x + this.width / 2, 0)
      this.game.ctx.lineTo(this.x + this.width / 2, this.y + 10)
      this.game.ctx.stroke()
      super.draw(this.game.ctx)
    }
  }

  const game = new Game(ctx, collisionCtx, canvas.width, canvas.height)
  let lastTime = 1

  const tg = new Target()

  document.addEventListener('click', (e) => {
    game.handleShort(e.x, e.y)
  })
  window.addEventListener('mousemove', (e) => {
    tg.update(e.x, e.y)
  })

  targetCtx.fillStyle = 'red'
  targetCtx.fillRect(0, 0, 300, 300)

  // Render background image
  const image = new Image()
  image.src = './assets/background.png'
  image.addEventListener('load', () => {
    backgroundCtx.drawImage(
      image,
      0,
      0,
      backgroundCanvas.width,
      backgroundCanvas.height
    )
  })

  const animate = (timestamp = 0) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height)
    targetCtx.clearRect(0, 0, targetCanvas.width, targetCanvas.height)

    const deltaTime = timestamp - lastTime
    lastTime = timestamp
    game.update(deltaTime)
    game.draw()
    tg.draw()

    requestAnimationFrame(animate)
  }
  animate()
})
