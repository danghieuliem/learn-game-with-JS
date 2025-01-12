import LoopTimer from './modules/loopTimer.js'
import Circle from './modules/circle.js'

/** @type {HTMLCanvasElement} */
const mainCanvas = document.getElementById('mainCanvas')
/** @type {CanvasRenderingContext2D} */
const mainCtx = mainCanvas.getContext('2d')

const CANVAS_WIDTH = (mainCanvas.width = window.innerWidth - 50)
const CANVAS_HEIGHT = (mainCanvas.height = window.innerHeight - 50)

const TOTAL_OBJECT = 10

const reset = () => {
  mainCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

const toCheckColliding = () => {
  /** @type {Circle[]}*/
  const listItemGrabbed = []
  /** @type {Circle[]}*/
  const listItemNoGrabbed = []

  // to screening item is grabbing
  listObject.forEach((item) => {
    if (item.grabbed) listItemGrabbed.push(item)
    else listItemNoGrabbed.push(item)
  })

  // to check colliding
  listItemGrabbed.forEach((item) => {
    let isCollied = false
    listItemNoGrabbed.map((i) => {
      i.isColliding = i.toCollideWithCircle(item)
      i.isColliding && (isCollied = true)
    })
    item.isColliding = isCollied
  })
}

const drawAnima = () => {
  reset()
  mainCtx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  toCheckColliding()
  const array = [...listObject]
  const callback = () => {
    if (!array.length) return false // return false to break loop
    const object = array.shift()
    object.grabbed
      ? object.updateDraw(movementX, movementY, mainCtx)
      : object.updateDraw(0, 0, mainCtx)
    return true // return false to continue loop
  }

  const loopTimer = new LoopTimer(callback, 200)

  loopTimer.start()
}

// draw border canvas screen
// and all item of list object inside main canvas
const draw = async (movementX = 0, movementY = 0) => {
  reset()
  mainCtx.strokeStyle = 'black'
  mainCtx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  toCheckColliding()
  listObject.forEach((item) => {
    item.grabbed
      ? item.updateDraw(movementX, movementY, mainCtx)
      : item.updateDraw(0, 0, mainCtx)
  })
}

/** @type {Circle[]} */
const listObject = []

// generate objects
for (let i = 0; i < TOTAL_OBJECT; i++) {
  const offset = 5
  const radius =
    Math.ceil(Math.random() * (Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) / 2 / 5)) +
    10
  const x = Math.ceil(Math.random() * CANVAS_WIDTH - radius - offset)
  const y = Math.ceil(Math.random() * CANVAS_HEIGHT - radius - offset)

  listObject.push(
    new Circle({
      x: Math.max(x, radius + offset),
      y: Math.max(y, radius + offset),
      radius: radius,
    })
  )
}

drawAnima()

/** @param {MouseEvent} e */
const onMousedown = (e) => {
  console.log('onMousedown')

  e.preventDefault()
  e.stopPropagation()

  listObject.forEach((item) => {
    const grabbed = item.toCollideWithPoint({ x: e.offsetX, y: e.offsetY })
    if (grabbed) {
      item.grabbed = grabbed
      item.style = grabbed ? 'white' : 'black'

      draw()
    }
  })

  mainCanvas.addEventListener('mousemove', onMousemove)
}

/** @param {MouseEvent} e */
const onMouseup = (e) => {
  console.log('onMouseup')

  e.preventDefault()
  e.stopPropagation()

  listObject.forEach((item) => {
    item.grabbed = false
    item.style = 'black'
  })

  mainCanvas.removeEventListener('mousemove', onMousemove)
  draw()
}

/** @param {MouseEvent} e */
const onMousemove = (e) => {
  console.log('onMousemove')

  e.preventDefault()
  e.stopPropagation()

  draw(e.movementX, e.movementY)
}

mainCanvas.addEventListener('mousedown', onMousedown)
mainCanvas.addEventListener('mouseup', onMouseup)
