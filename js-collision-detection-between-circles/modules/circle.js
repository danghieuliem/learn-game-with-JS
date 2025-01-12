class Circle {
  constructor({ x = 10, y = 10, radius = 300 }) {
    this.x = x
    this.y = y
    this.radius = radius
    this.grabbed = false
    this.isColliding = false
    this.style = 'black'
  }

  updateDraw(x = 0, y = 0, ctx) {
    this.x += x
    this.y += y

    ctx.strokeStyle = this.grabbed ? this.style : 'black'
    ctx.strokeStyle = this.isColliding ? 'red' : this.style

    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.stroke()
  }

  /**
   *
   * @param {Circle} circle
   * @returns boolean
   */
  toCollideWithCircle(circle) {
    let dx = circle.x - this.x
    let dy = circle.y - this.y

    let distance = Math.sqrt(dx ** 2 + dy ** 2)
    let sumOfRadii = this.radius + circle.radius

    if (distance < sumOfRadii) {
      return true
    } else if (distance === sumOfRadii) {
      return true
    } else if (distance > sumOfRadii) {
      return false
    }
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @returns boolean
   */
  toCollideWithPoint({ x, y }) {
    let dx = this.x - x
    let dy = this.y - y

    let distance = Math.sqrt(dx ** 2 + dy ** 2)
    let sumOfRadii = this.radius + 0

    if (distance < sumOfRadii) {
      return true
    } else if (distance === sumOfRadii) {
      return true
    } else if (distance > sumOfRadii) {
      return false
    }
  }
}

export default Circle
