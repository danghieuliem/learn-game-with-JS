import { Game } from './game.js'
import { InputHandler, KEYS } from './input.js'

export class Player {
  /**
   *
   * @param {Game} game
   * @param {number} x
   * @param {number} y
   */
  constructor(game, x, y) {
    this.game = game
    this.x = x
    this.y = y

    this.oldX = x
    this.oldY = y

    this.states = [1]
    this.currentState = this.states[0]
  }

  /**
   *
   * @param {InputHandler} input
   */
  update(x, y) {
    this.x = x
    this.y = y
  }

  draw() {
    const ctx = this.game.ctx
    ctx.clearRect(
      this.oldX * this.game.maze.sizeBlock,
      this.oldY * this.game.maze.sizeBlock,
      this.game.maze.sizeBlock,
      this.game.maze.sizeBlock
    )
    ctx.save()
    ctx.fillStyle = 'red'
    ctx.fillRect(
      this.x * this.game.maze.sizeBlock + this.game.maze.gap * 0.5,
      this.y * this.game.maze.sizeBlock + this.game.maze.gap * 0.5,
      this.game.maze.sizeBlock - this.game.maze.gap,
      this.game.maze.sizeBlock - this.game.maze.gap
    )
    ctx.restore()
  }

  moveLeft() {
    if (this.x - 1 < 0 || !this.game.maze.maze[this.x - 1][this.y]) return
    this.x--
    this.draw()
    this.oldX = this.x
  }

  moveUp() {
    if (this.y - 1 < 0 || !this.game.maze.maze[this.x][this.y - 1]) return
    this.y--
    this.draw()
    this.oldY = this.y
  }

  moveDown() {
    if (
      this.y + 1 > this.game.maze.h / this.game.maze.sizeBlock ||
      !this.game.maze.maze[this.x][this.y + 1]
    )
      return
    this.y++
    this.draw()
    this.oldY = this.y
  }

  moveRight() {
    if (
      this.x + 1 > this.game.maze.w / this.game.maze.sizeBlock ||
      !this.game.maze.maze[this.x + 1][this.y]
    )
      return
    this.x++
    this.draw()
    this.oldX = this.x
  }
}
