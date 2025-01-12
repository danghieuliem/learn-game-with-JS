class LoopTimer {
  constructor(callback, delay) {
    this.timeout = null
    this.lastTime = null
    this.callback = callback
    this.delay = delay
  }

  start() {
    const cb = () => {
      const thisTime = Date.now()
      const loopTime = thisTime - this.lastTime
      const delay = Math.max(this.delay - loopTime, 0)

      this.timeout = setTimeout(cb, delay)
      this.lastTime = thisTime + delay

      // stop loop when call back return false
      !this.callback() && this.stop()
    }

    this.timeout = setTimeout(cb, 0)
    this.lastTime = Date.now()

    return this.lastTime
  }

  stop() {
    clearTimeout(this.timeout)
    return this.lastTime
  }
}

export default LoopTimer
