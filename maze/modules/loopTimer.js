export class LoopTimer {
  /**
   *
   * @param {()=>boolean} callback
   * @param {number} interval
   * @param {number} velocityInterval
   *
   * - callback return true to continue loop
   */
  constructor(callback, interval, velocityInterval = 0) {
    this.callback = callback
    this.interval = interval
    this.lastTime = 0
    this.currentTimeout = 0
    this.velocityInterval = velocityInterval
  }

  start() {
    const cb = () => {
      const thisTime = Date.now()
      const deltaTime = thisTime - this.lastTime

      const delay = Math.max(this.interval - deltaTime, 0)
      this.lastTime = thisTime + delay
      this.interval *= this.velocityInterval
      this.currentTimeout = setTimeout(cb, delay)
      !this.callback() && this.stop()
    }
    this.currentTimeout = setTimeout(cb, 0)
    this.lastTime = Date.now()
  }

  stop() {
    clearTimeout(this.currentTimeout)
  }
}
