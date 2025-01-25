import { CollisionAnimation } from './collisionAnimation.js'
import Game from './game.js'
import InputHandler from './input.js'
import {
  Diving,
  Falling,
  Hit,
  Jumping,
  Rolling,
  Running,
  Sitting,
  states,
} from './playerStates.js'

export default class Player {
  constructor(game) {
    /** @type {Game} */
    this.game = game
    this.width = 100
    this.height = 91.3
    this.x = 0
    this.y = this.game.height - this.height - this.game.groundMargin
    this.image = document.getElementById('player')
    this.frameX = 0
    this.frameY = 0
    this.speed = 0
    this.maxSpeed = 4
    this.vy = 0
    this.weight = 0.5
    this.maxFrame = 5
    this.frameTimer = 0
    this.fps = 10
    this.frameInterval = 1000 / this.fps
    this.states = [
      new Sitting(game),
      new Running(game),
      new Jumping(game),
      new Falling(game),
      new Rolling(game),
      new Diving(game),
      new Hit(game),
    ]
    this.currentState = this.states[0]
  }

  /**
   *
   * @param {InputHandler} input
   */
  update(input, deltaTime) {
    this.checkCollision()
    this.currentState.handleInput(input)
    // horizontal movement
    this.x += this.speed
    if (
      input.keys.includes('ArrowRight') &&
      this.currentState !== this.states[states.HIT]
    )
      this.speed = this.maxSpeed
    else if (
      input.keys.includes('ArrowLeft') &&
      this.currentState !== this.states[states.HIT]
    )
      this.speed = -this.maxSpeed
    else this.speed = 0

    // horizontal boundaries
    if (this.x < 0) this.x = 0
    if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width

    // vertical movement
    this.y += this.vy
    if (!this.onGround()) this.vy += this.weight
    else this.vy = 0

    // vertical boundaries
    if (this.y > this.game.height - this.height - this.game.groundMargin) {
      this.y = this.game.height - this.height - this.game.groundMargin
    }

    // sprite animation
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0
      if (this.frameX < this.maxFrame) this.frameX++
      else this.frameX = 0
    } else {
      this.frameTimer += deltaTime
    }
  }

  /**
   *
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height)
    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }

  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin
  }

  setState(state, speed) {
    this.currentState = this.states[state]
    this.game.speed = this.game.maxSpeed * speed
    this.currentState.enter()
  }

  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      if (
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        enemy.markedForDeletion = true
        this.game.collisions.push(
          new CollisionAnimation(
            this.game,
            enemy.x + enemy.width * 0.5,
            enemy.y + enemy.height * 0.5
          )
        )
        if (
          this.currentState === this.states[states.ROLLING] ||
          this.currentState === this.states[states.DIVING]
        ) {
          this.game.score++
        } else {
          this.setState(states.HIT, 0)
        }
      }
    })
  }
}
