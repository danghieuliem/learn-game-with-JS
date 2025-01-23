import InputHandler from './input.js'
import Player from './player.js'

/**
 *
 * @param {CanvasRenderingContext2D} context
 * @param {InputHandler} input
 * @param {Player} player
 */
export const drawStateText = (context, input, player) => {
  context.font = '28px Helvetica'
  context.fillText('Last input: ' + input.lastHey, 20, 50)
  context.fillText('Active state: ' + player.currentState.state, 20, 90)
}
