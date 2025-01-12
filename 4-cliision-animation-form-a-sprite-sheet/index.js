/** @type {HTMLCanvasElement} */
const mainCanvas = document.getElementById('mainCanvas')
/** @type {CanvasRenderingContext2D} */
const mainCtx = mainCanvas.getContext('2d')

const CANVAS_WIDTH = (mainCanvas.width = 500)
const CANVAS_HEIGHT = (mainCanvas.height = 700)

/** @type {Explosions[]} */
const explosions = []

let canvasPosition = mainCanvas.getBoundingClientRect()

class Explosions {
  constructor(x, y) {
    this.spriteWidth = 200
    this.spriteHeight = 179
    this.width = this.spriteWidth * 0.7
    this.height = this.spriteHeight * 0.7
    this.x = x
    this.y = y
    this.image = new Image()
    this.image.src = 'assets/smoke.png'
    this.frame = 0
    this.timer = 0
    this.angle = Math.random() * 6.2
    this.sound = new Audio()
    this.sound.src = 'assets/sounds/explosion.wav'
  }

  update() {
    if (this.frame === 0) this.sound.play()
    this.timer++
    if (this.timer % 10 === 0) {
      this.frame++
    }
  }

  draw() {
    mainCtx.save() // [[open scope]] save the entire current screen and can only change one object before drawing
    mainCtx.translate(this.x, this.y)
    mainCtx.rotate(this.angle)
    const { image, spriteWidth, frame, spriteHeight, x, y, width, height } =
      this
    mainCtx.drawImage(
      image,
      spriteWidth * frame,
      0,
      spriteWidth,
      spriteHeight,
      0 - width / 2,
      0 - height / 2,
      width,
      height
    )

    mainCtx.restore() // [[close scope]]
  }
}

window.addEventListener('click', (e) => {
  createAnimation(e)
})

// window.addEventListener('mousemove', (e) => {
//   createAnimation(e)
// })

const createAnimation = (e) => {
  let positionX = e.x - canvasPosition.left,
    positionY = e.y - canvasPosition.top

  explosions.push(new Explosions(positionX, positionY))
}

const animate = () => {
  mainCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  for (let i = 0; i < explosions.length; i++) {
    explosions[i].update()
    explosions[i].draw()
    if (explosions[i].frame > 5) {
      explosions.splice(i, 1)
      i--
    }
  }
  requestAnimationFrame(animate)
}

animate()
