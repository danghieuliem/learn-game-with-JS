import { InputHandler } from './input.js'
import { Maze } from './maze.js'
import { Player } from './player.js'

export class Game {
  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} w
   * @param {number} h
   */
  constructor(ctx, w, h) {
    this.ctx = ctx
    this.w = w
    this.h = h
    this.maze = new Maze(this, w, h)
    this.player = new Player(this, 0, 0)
    this.input = new InputHandler(ctx, this.player)
    this.fps = 15
    this.frameTimer = 0
    this.frameInterval = 100 / this.fps
  }

  update(deltaTime) {
    this.maze.update()
  }

  draw() {
    // this.ctx.font = '30px Helvetica'
    // this.ctx.clearRect(0, 0, this.w, 60)
    // this.ctx.fillText('kdaw:' + this.input.keys[0], 20, 30)
    this.maze.draw()
    this.player.draw()
  }
}
