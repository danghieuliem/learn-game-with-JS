import Game from './game.js'

export class UI {
  constructor(game) {
    /** @type {Game} */
    this.game = game
    this.fontSize = 30
    this.fontFamily = 'Helvetica'
  }

  /**
   *
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    context.save()
    context.shadowOffsetX = 2
    context.shadowOffsetY = 2
    context.shadowColor = 'white'
    context.shadowBlur = 0

    context.font = this.fontSize + 'px ' + this.fontFamily
    context.textAlign = 'left'
    context.fillStyle = this.game.fontColor

    //score
    context.fillText('Score: ' + this.game.score, 20, 50)

    // Time
    context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily
    context.fillText(
      'Time: ' + (this.game.time * 0.001).toFixed(2) + 's',
      20,
      80
    )

    // game over messages
    if (this.game.gameOver) {
      context.textAlign = 'center'
      context.font = this.fontSize * 2 + 'px ' + this.fontFamily

      if (this.game.score > 5) {
        context.fillText(
          'Boo-yah',
          this.game.width * 0.5,
          this.game.height * 0.5 - 20
        )
        context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily
        context.fillText(
          'What are creatures of the night afraid of? YOU!!!',
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        )
      } else {
        context.fillText(
          'Love at first bite?',
          this.game.width * 0.5,
          this.game.height * 0.5 - 20
        )
        context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily
        context.fillText(
          'Nope. Better luck next time!',
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        )
      }

      context.restore()
    }
  }
}
