export default class InputHandler {
  constructor() {
    this.lastHey = ''
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          this.lastHey = 'PRESS left'
          break

        case 'ArrowRight':
          this.lastHey = 'PRESS right'
          break

        case 'ArrowDown':
          this.lastHey = 'PRESS down'
          break

        case 'ArrowUp':
          this.lastHey = 'PRESS up'
          break
      }
    })
    window.addEventListener('keyup', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          this.lastHey = 'RELEASE left'
          break

        case 'ArrowRight':
          this.lastHey = 'RELEASE right'
          break

        case 'ArrowDown':
          this.lastHey = 'RELEASE down'
          break

        case 'ArrowUp':
          this.lastHey = 'RELEASE up'
          break
      }
    })
  }
}
