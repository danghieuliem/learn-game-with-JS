/** @type {HTMLCanvasElement} */
/** @type {HTMLImageElement} */
const canvas = document.getElementById('mainCanvas')
const ctx = canvas.getContext('2d')

const CANVAS_WIDTH = (canvas.width = 500)
const CANVAS_HEIGHT = (canvas.height = 1000)

const numberOfEnemies = 200
const enemiesArray = []

let gameFrame = 0

class Enemy {
  constructor() {
    this.image = new Image()
    this.image.src = 'assets/enemies/enemy3.png'
    this.spriteWidth = 218
    this.spriteHeight = 177
    this.scale = (Math.random() * 2 + 1.8).toFixed(2)
    this.width = this.spriteWidth / this.scale
    this.height = this.spriteHeight / this.scale
    this.x = Math.random() * (canvas.width - this.width)
    this.y = Math.random() * (canvas.height - this.height)
    this.frame = 0
    this.flapSpeed = Math.floor(Math.random() * 3 + 1)
    this.angle = 0
    this.angleSpeed = Math.random() * 0.5 + 1
  }
  update() {
    this.x =
      (canvas.width / 2) * Math.cos((this.angle * Math.PI) / 90) +
      (canvas.width / 2 - this.width / 2)
    this.y =
      (canvas.height / 2) * Math.sin((this.angle * Math.PI) / 270) +
      (canvas.height / 2 - this.height / 2)
    this.angle += this.angleSpeed
    if (this.x + this.width < 0) this.x = canvas.width
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
