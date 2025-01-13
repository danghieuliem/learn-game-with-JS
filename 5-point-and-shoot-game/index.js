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
const targetCanvas = document.getElementById('targetCanvas')
const targetCtx = targetCanvas.getContext('2d')

targetCanvas.width = window.innerWidth
targetCanvas.height = window.innerHeight

let score = 0
let gameOver = false
ctx.font = '50px Impact'

let timeToNextRaven = 0
let ravenInterval = 500
let lastTime = 0

/** @type {Ravens[]} */
let ravens = []

class Ravens {
  constructor() {
    this.spriteWidth = 271
    this.spriteHeight = 194
    this.sizeModifier = Math.random() * 0.6 + 0.4
    this.width = this.spriteWidth * this.sizeModifier
    this.height = this.spriteHeight * this.sizeModifier
    this.x = canvas.width
    this.y = Math.random() * (canvas.height - this.height)
    this.directionX = Math.random() * 3 + 3
    this.directionY = Math.random() * 3 - 2.5
    this.markedForDeletion = false
    this.image = new Image()
    this.image.src = './assets/raven.png'
    this.frame = 0
    this.maxFrame = 4
    this.timeSinceFlap = 0
    this.flapInterval = Math.random() * 50 + 50
    this.randomColor = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ]
    this.color = `rgb(${this.randomColor[0]},${this.randomColor[1]},${this.randomColor[2]})`
    this.hasTrail = Math.random() > 0.5
  }

  update(deltaTime) {
    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY = this.directionY * -1
    }
    this.x -= this.directionX
    this.y += this.directionY
    if (this.x < 0 - this.width) this.markedForDeletion = true
    this.timeSinceFlap += deltaTime

    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) this.frame = 0
      else this.frame++
      this.timeSinceFlap = 0
      if (this.hasTrail)
        for (let i = 0; i < 5; i++) {
          particles.push(new Particle(this.x, this.y, this.width, this.color))
        }
    }

    if (this.x < 0 - this.width) gameOver = true
  }

  draw() {
    const { image, x, y, width, height, spriteWidth, spriteHeight, frame } =
      this
    collisionCtx.fillStyle = this.color
    collisionCtx.fillRect(x, y, width, height)
    ctx.drawImage(
      image,
      frame * spriteWidth,
      0,
      spriteWidth,
      spriteHeight,
      x,
      y,
      width,
      height
    )
  }
}

let explosions = []

/** @type {Explosion[]} */
class Explosion {
  constructor(x, y, size) {
    this.image = new Image()
    this.image.src = './assets/smoke.png'
    this.spriteWidth = 200
    this.spriteHeight = 179
    this.size = size
    this.x = x
    this.y = y
    this.frame = 0
    this.sound = new Audio()
    this.sound.src = './assets/explosion.wav'
    this.timeSinceLastFrame = 0
    this.frameInterval = 120
    this.markedForDeletion = false
    this.angle = Math.random() * 6.2
  }

  update(deltaTime) {
    if (this.frame === 0) this.sound.play()
    this.timeSinceLastFrame += deltaTime
    if (this.timeSinceLastFrame > this.frameInterval) {
      this.frame++
      this.timeSinceLastFrame = 0
      if (this.frame > 5) this.markedForDeletion = true
    }
  }

  draw() {
    const { image, frame, spriteWidth, spriteHeight, x, y, size } = this
    ctx.drawImage(
      image,
      frame * spriteWidth,
      0,
      spriteWidth,
      spriteHeight,
      x,
      y - size / 4,
      size,
      size
    )
  }
}

/** @type {Particle[]} */
let particles = []
class Particle {
  constructor(x, y, size, color) {
    this.size = size
    this.x = x + this.size / 2 + Math.random() * 50 - 25
    this.y = y + this.size / 3 + Math.random() * 50 - 25
    this.radius = (Math.random() * this.size) / 10
    this.maxRadius = Math.random() * 20 + 35
    this.markedForDeletion = false
    this.speedX = Math.random() * 1 + 0.5
    this.color = color
  }
  update() {
    this.x += this.speedX
    this.radius += 0.25
    if (this.radius > this.maxRadius - 5) this.markedForDeletion = true
  }
  draw() {
    ctx.save()
    ctx.globalAlpha = 1 - this.radius / this.maxRadius
    ctx.beginPath()
    ctx.fillStyle = this.color
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

class Target {
  constructor() {
    this.x = 0
    this.y = 0
    this.sizeModifier = 0.5
    this.spriteWidth = 128
    this.spriteHeight = 128
    this.width = this.spriteWidth * this.sizeModifier
    this.height = this.spriteHeight * this.sizeModifier
    this.image = new Image()
    this.image.src = './assets/target.png'
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
const target = new Target()

window.addEventListener('click', (e) => {
  const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1)
  const pc = detectPixelColor.data
  ravens.forEach((object) => {
    if (
      object.randomColor[0] !== pc[0] ||
      object.randomColor[1] !== pc[1] ||
      object.randomColor[2] !== pc[2]
    )
      return
    object.markedForDeletion = true
    score++
    explosions.push(new Explosion(object.x, object.y, object.width))
  })
})

window.addEventListener('mousemove', (e) => {
  target.update(e.x, e.y)
})

const drawScore = () => {
  ctx.fillStyle = 'black'
  ctx.fillText('Score: ' + score, 50, 75)
  ctx.fillStyle = 'white'
  ctx.fillText('Score: ' + score, 55, 80)
}

const drawGameOver = () => {
  ctx.textAlign = 'center'
  ctx.font = '30px impact'
  ctx.fillStyle = 'black'
  ctx.fillText(
    'GAME OVER, your score is: ' + score,
    canvas.width / 2,
    canvas.height / 2
  )
  ctx.fillStyle = 'white'
  ctx.fillText(
    'GAME OVER, your score is: ' + score,
    canvas.width / 2 + 5,
    canvas.height / 2 + 5
  )
}

const animate = (timestamp = 0) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  collisionCtx.clearRect(0, 0, collisionCanvas.width, collisionCanvas.height)
  targetCtx.clearRect(0, 0, targetCanvas.width, targetCanvas.height)

  let deltaTime = timestamp - lastTime

  lastTime = timestamp
  timeToNextRaven += deltaTime

  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Ravens())
    timeToNextRaven = 0
    ravens.sort((a, b) => a.with - b.width)
  }

  drawScore()
  ;[...particles, ...ravens, ...explosions].forEach((object) =>
    object.update(deltaTime)
  )
  ;[...particles, ...ravens, ...explosions].forEach((object) => object.draw())
  target.draw()

  ravens = ravens.filter((object) => !object.markedForDeletion)
  explosions = explosions.filter((object) => !object.markedForDeletion)
  particles = particles.filter((object) => !object.markedForDeletion)

  if (!gameOver) requestAnimationFrame(animate)
  else drawGameOver()
}
animate()
