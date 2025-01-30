import { Player } from './player.js'

export const KEYS = {
  Escape: 'Escape',
  A: 'a',
  W: 'w',
  S: 's',
  D: 'd',
}

export class InputHandler {
  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {Player} player
   */
  constructor(ctx, player) {
    this.keys = []
    this.ctx = ctx
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case KEYS.Escape:
        case KEYS.A:
          player.moveLeft()
          break
        case KEYS.W:
          player.moveUp()
          break
        case KEYS.S:
          player.moveDown()
          break
        case KEYS.D:
          player.moveRight()
          break
      }
    })
    window.addEventListener('keyup', (e) => {
      switch (e.key) {
        case KEYS.Escape:
        case KEYS.A:
        case KEYS.W:
        case KEYS.S:
        case KEYS.D:
          this.keys.splice(this.keys.indexOf(e.key), 1)
          break
      }
    })

    const handleMousemove = (e) => {
      ctx.beginPath()
      ctx.fillStyle = 'blue'
      ctx.arc(e.offsetX, e.offsetY, 2, 0, Math.PI * 2)
      ctx.fill()
    }

    window.addEventListener('mousedown', (e) => {
      window.addEventListener('mousemove', handleMousemove)
    })

    window.addEventListener('mouseup', (e) => {
      window.removeEventListener('mousemove', handleMousemove)
    })
  }
}
