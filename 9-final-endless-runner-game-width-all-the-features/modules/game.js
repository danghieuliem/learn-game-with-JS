import { Background } from './background.js'
import { CollisionAnimation } from './collisionAnimation.js'
import { ClimbingEnemy, Enemy, FlyingEnemy, GroundEnemy } from './enemies.js'
import InputHandler from './input.js'
import { Particle } from './particle.js'
import Player from './player.js'
import { UI } from './UI.js'

export default class Game {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.groundMargin = 80
    this.speed = 0
    this.maxSpeed = 3
    this.background = new Background(this)
    this.player = new Player(this)
    this.input = new InputHandler(this)
    this.UI = new UI(this)
    /** @type {Enemy[]} */
    this.enemies = []
    /** @type {Particle[]} */
    this.particles = []
    /** @type {CollisionAnimation[]} */
    this.collisions = []
    this.maxParticle = 50
    this.enemyTimer = 0
    this.enemyInterval = 1000
    this.debug = false
    this.score = 0
    this.fontColor = 'black'
    this.time = 0
    this.maxTime = 10000
    this.gameOver = false
    this.player.currentState = this.player.states[0]
    this.player.currentState.enter()
  }

  update(deltaTime) {
    this.time += deltaTime
    if (this.time > this.maxTime) this.gameOver = true
    this.background.update()
    this.player.update(this.input, deltaTime)

    // handleEnemies
    if (this.enemyTimer > this.enemyInterval) {
      this.addEnemy()
      this.enemyTimer = 0
    } else {
      this.enemyTimer += deltaTime
    }
    this.enemies.forEach((enemy) => {
      enemy.update(deltaTime)
    })
    this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion)

    // handle particles
    this.particles.forEach((particle, index) => {
      particle.update()
      if (particle.markedForDeletion) this.particles.splice(index, 1)
    })
    if (this.particles.length > this.maxParticle) {
      this.particles.length = this.maxParticle
    }

    // handle collision sprites
    this.collisions.forEach((collision, index) => {
      collision.update(deltaTime)
      if (collision.markedForDeletion) this.collisions.splice(index, 1)
    })
  }

  /**
   *
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    this.background.draw(context)
    this.player.draw(context)
    this.enemies.forEach((enemy) => {
      enemy.draw(context)
    })
    this.particles.forEach((particle) => {
      particle.draw(context)
    })
    this.collisions.forEach((collision) => {
      collision.draw(context)
    })
    this.UI.draw(context)
  }

  addEnemy() {
    if (this.speed > 0 && Math.random() < 0.5)
      this.enemies.push(new GroundEnemy(this))
    else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this))

    this.enemies.push(new FlyingEnemy(this))
  }
}
