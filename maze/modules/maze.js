import { Game } from './game.js'
import { LoopTimer } from './loopTimer.js'

export class Maze {
  /**
   *
   * @param {Game} game
   * @param {number} w - width
   * @param {number} h - height
   */
  constructor(game, w, h) {
    this.game = game
    this.w = w
    this.h = h
    /** @type {boolean[][]} */
    this.maze = new Array()
    this.sizeBlock = 10
    this.gap = 2
    this.isRendered = false
    this.isCreating = false
  }

  update() {
    if (!this.isCreating && !this.maze.length) {
      this.createPerfectMaze()
    }
  }

  draw() {
    if (!this.isRendered) this.gender()
  }

  create() {
    this.isCreating = true
    this.maze = []
    const size = this.sizeBlock
    let row = 0
    let col = 0
    let width = this.w
    let height = this.h

    while (width >= size && height >= size) {
      this.maze[row]?.length
        ? (this.maze[row][col] = Math.random() > 0.5)
        : (this.maze[row] = [Math.random() > 0.5])

      // update row and col
      width -= size
      row++

      if (width < size && height >= size) {
        width = this.w
        height -= size
        row = 0
        col++
      }
    }

    this.isCreating = false
  }

  createPerfectMaze() {
    this.isCreating = true
    this.maze = []
    const size = this.sizeBlock
    let row = 0
    let col = 0
    let width = this.w
    let height = this.h

    // maze full wall
    while (width >= size && height >= size) {
      this.maze[row]?.length
        ? (this.maze[row][col] = false)
        : (this.maze[row] = [false])

      width -= size
      row++

      if (width < size && height >= size) {
        width = this.w
        height -= size
        row = 0
        col++
      }
    }

    // path caring
    const tamp = [{ x: 0, y: 0 }]
    this.maze[0][0] = true
    let a = 25 * 25
    while (tamp.length) {
      const lastPart = tamp[tamp.length - 1]
      let validatePart = [
        {
          x: lastPart.x + 2,
          y: lastPart.y,
        },
        {
          x: lastPart.x - 2,
          y: lastPart.y,
        },
        {
          x: lastPart.x,
          y: lastPart.y + 2,
        },
        {
          x: lastPart.x,
          y: lastPart.y - 2,
        },
      ]

      validatePart = validatePart.filter((val) => {
        return (
          this.maze[val.x]?.[val.y] !== undefined &&
          this.maze[val.x][val.y] === false
        )
      })

      if (!validatePart.length) {
        tamp.pop()
        continue
      }
      const selectedPart =
        validatePart[Math.floor(Math.random() * validatePart.length)]

      tamp.push(selectedPart)

      for (
        let i = 0;
        i <=
        Math.max(selectedPart.x, lastPart.x) -
          Math.min(lastPart.x, selectedPart.x);
        i++
      ) {
        const x = Math.min(lastPart.x, selectedPart.x) + i
        this.setMaze(x, lastPart.y, true)
      }
      for (
        let i = 0;
        i <=
        Math.max(selectedPart.y, lastPart.y) -
          Math.min(lastPart.y, selectedPart.y);
        i++
      ) {
        this.setMaze(lastPart.x, Math.min(lastPart.y, selectedPart.y) + i, true)
      }
    }

    this.isCreating = false
  }

  setMaze(x, y, val) {
    this.maze[x][y] = val
  }

  genderAnimate() {
    if (!this.maze.length) return
    this.isRendered = true

    const size = this.sizeBlock
    let row = 0
    let col = 0
    let width = this.w
    let height = this.h

    const callBack = () => {
      if (width >= size && height >= size) {
        // draw block
        !this.maze[row][col] &&
          this.game.ctx.fillRect(
            row * size + this.gap / 2,
            col * size + this.gap / 2,
            size - this.gap,
            size - this.gap
          )

        // update row and col
        width -= size
        row++

        if (width < size && height >= size) {
          width = this.w
          height -= size
          row = 0
          col++
        }
      } else {
        return false
      }

      return true
    }
    const delay = 100
    const loopTimer = new LoopTimer(callBack, delay, 0.9)
    setTimeout(() => loopTimer.start(), delay)
  }

  gender() {
    if (!this.maze.length) return
    this.isRendered = true
    const size = this.sizeBlock
    let row = 0
    let col = 0
    let width = this.w
    let height = this.h

    while (width >= size && height >= size) {
      !this.maze[row][col] &&
        this.game.ctx.fillRect(
          row * size + this.gap / 2,
          col * size + this.gap / 2,
          size - this.gap,
          size - this.gap
        )

      // update row and col
      width -= size
      row++

      if (width < size && height >= size) {
        width = this.w
        height -= size
        row = 0
        col++
      }
    }
  }

  reset() {
    this.maze = []
    this.isRendered = false
    this.isCreating = false
  }
}
