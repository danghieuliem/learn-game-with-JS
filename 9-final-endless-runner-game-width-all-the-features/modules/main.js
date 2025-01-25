import Game from './game.js'

window.addEventListener('load', () => {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById('mainCanvas')
  const ctx = canvas.getContext('2d')
  canvas.width = 500
  canvas.height = 500

  const game = new Game(canvas.width, canvas.height)

  let lastTime = 0
  const animate = (timeStamp = 0) => {
    const deltaTime = timeStamp - lastTime
    lastTime = timeStamp

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    game.update(deltaTime)
    game.draw(ctx)
    if (!game.gameOver) requestAnimationFrame(animate)
  }

  animate()
})
