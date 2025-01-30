import { Game } from './modules/game.js'
import { LoopTimer } from './modules/loopTimer.js'

window.addEventListener('load', () => {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById('mainCanvas')
  const ctx = canvas.getContext('2d')

  canvas.width = 500 - 10
  canvas.height = 500 - 10

  const game = new Game(ctx, canvas.width, canvas.height)

  game.update()
  game.draw()
  // const animate = (timeStamp = 0) => {
  //   game.update(timeStamp)
  //   game.draw()
  //   requestAnimationFrame(animate)
  // }

  // animate()
})
