/** @type {HTMLCanvasElement} */
/** @type {HTMLImageElement} */
const canvas = document.getElementById('mainCanvas')
const ctx = canvas.getContext('2d')

const CANVAS_WIDTH = (canvas.width = 500)
const CANVAS_HEIGHT = (canvas.height = 1000)

const numberOfEnemies = 50
const enemiesArray = []

let gameFrame = 0

class Enemy {
  constructor() {
    this.image = new Image()
    this.image.src = 'assets/enemies/enemy1.png'
    this.spriteWidth = 293
    this.spriteHeight = 155

    this.speed = Math.random() * 4 + 1

    this.scale = (Math.random() * 2 + 1.8).toFixed(2)
    this.width = this.spriteWidth / this.scale
    this.height = this.spriteHeight / this.scale
    this.x = Math.random() * (canvas.width - this.width)
    this.y = Math.random() * (canvas.height - this.height)
    this.frame = 0
    this.flapSpeed = Math.floor(Math.random() * 3 + 1)
  }

  update() {
    this.x -= Math.random() * 5 - 2.5
    this.y += Math.random() * 5 - 2.5

    // this.x -= this.speed
    // this.y += this.speed

    if (this.x + this.width < 0) this.x = canvas.width
    if (this.y > canvas.height) this.y = -this.height
    if (gameFrame % this.flapSpeed === 0)
      this.frame > 4 ? (this.frame = 0) : this.frame++
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.spriteWidth * this.frame,
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

for (let i = 0; i < numberOfEnemies; i++) {
  enemiesArray.push(new Enemy())
}

const animate = () => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  enemiesArray.forEach((enemy) => {
    enemy.update()
    enemy.draw()
  })
  gameFrame++
  requestAnimationFrame(animate)
}

animate()
