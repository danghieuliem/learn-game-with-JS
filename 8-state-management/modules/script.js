import Player from './player.js'
import InputHandler from './input.js'
import { drawStateText } from './utils.js'

window.addEventListener('load', () => {
  /** @type {HTMLHeadElement} */
  const loading = document.getElementById('loading')
  loading.style.display = 'none'

  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById('mainCanvas')
  const ctx = canvas.getContext('2d')

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const player = new Player(canvas.width, canvas.height)
  const input = new InputHandler()

  let lastTime = 0
  const animate = (timeStamp = 0) => {
    const deltaTime = timeStamp - lastTime
    lastTime = timeStamp

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.update(input)
    player.draw(ctx, deltaTime)

    drawStateText(ctx, input, player)
    requestAnimationFrame(animate)
  }
  animate()
})
