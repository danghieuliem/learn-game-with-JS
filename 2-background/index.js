const canvas =
  document.getElementById('mainCanvas')
const ctx = canvas.getContext('2d')

let gameSpeed = 12
let gameFrame = 0

canvas.width = 800
canvas.height = 700

const CANVAS_WIDTH = canvas.width
const CANVAS_HEIGHT = canvas.height

const backgroundLayer1 = new Image()
const backgroundLayer2 = new Image()
const backgroundLayer3 = new Image()
const backgroundLayer4 = new Image()
const backgroundLayer5 = new Image()
backgroundLayer1.src = './assets/layer-1.png'
backgroundLayer2.src = './assets/layer-2.png'
backgroundLayer3.src = './assets/layer-3.png'
backgroundLayer4.src = './assets/layer-4.png'
backgroundLayer5.src = './assets/layer-5.png'

window.addEventListener('load', () => {
  class Layer {
    constructor(img, speedModi) {
      this.x = 0
      this.y = 0
      this.width = 2400
      this.height = 700
      this.x2 = this.width
      this.image = img
      this.speedModifier = speedModi
      this.speed = gameSpeed * this.speedModifier
    }
    update() {
      this.speed = gameSpeed * this.speedModifier
      if (this.x <= -this.width) this.x = 0
      this.x = this.x - this.speed
    }
    draw() {
      ctx.drawImage(
        this.image,
        this.x,
        this.y,
        this.width,
        this.height
      )
      ctx.drawImage(
        this.image,
        this.x + this.width,
        this.y,
        this.width,
        this.height
      )
    }
  }

  const layer1 = new Layer(backgroundLayer1, 0.1)
  const layer2 = new Layer(backgroundLayer2, 0.3)
  const layer3 = new Layer(backgroundLayer3, 0.2)
  const layer4 = new Layer(backgroundLayer4, 0.5)
  const layer5 = new Layer(backgroundLayer5, 1)

  const slider = document.getElementById('slider')
  slider.value = gameSpeed

  const showGameSpeed = document.getElementById(
    'showGameSpeed'
  )
  showGameSpeed.innerText = gameSpeed

  slider.addEventListener('change', (e) => {
    gameSpeed = e.target.value
    showGameSpeed.innerText = gameSpeed
  })

  const gameObjects = [
    layer1,
    layer2,
    layer3,
    layer4,
    layer5,
  ]

  const animate = () => {
    ctx.clearRect(
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    )

    gameObjects.forEach((layer) => {
      layer.update()
      layer.draw()
    })

    gameFrame--
    requestAnimationFrame(animate)
  }

  animate()
})
