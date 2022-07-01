import { STATES } from '.'

const PADDING = 16

export class Brick {
  private color = '#5bab7d'
  private points = 10
  private broken: boolean
  private width: number
  private height: number
  private x: number
  private y: number

  constructor() {
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.broken = false
  }

  setPosition(x: number, y: number) {
    this.x = x
    this.y = y
  }

  setDimensions(width: number, height: number) {
    this.width = width
    this.height = height
  }

  break() {
    this.broken = true
  }

  reset() {
    this.broken = false
  }

  getProperties() {
    return {
      width: this.width,
      height: this.height,
      color: this.color,
      broken: this.broken,
      points: this.points,
      x: this.x,
      y: this.y,
    }
  }
}

export class Paddle {
  private width = 180
  private height = 20
  private color = '#636363'
  private state = 'STILL'
  private theta = 0
  private x: number
  private y: number

  constructor() {
    this.x = 0
    this.y = 0
  }

  setPosition(x: number, y: number) {
    this.x = x
    this.y = y
  }

  setMovement(state: string, theta: number) {
    this.state = state
    this.theta = theta
  }

  resetMovement() {
    this.state = STATES.STILL
    this.theta = 0
  }

  getProperties() {
    return {
      width: this.width,
      height: this.height,
      color: this.color,
      state: this.state,
      theta: this.theta,
      x: this.x,
      y: this.y,
    }
  }
}

export class Ball {
  private radius = 16
  private color = '#e32746'
  private speedX = 8
  private speedY = 8
  private x: number
  private y: number

  constructor() {
    this.x = 0
    this.y = 0
  }

  setPosition(x: number, y: number) {
    this.x = x
    this.y = y
  }

  setSpeedX(speedX: number) {
    this.speedX = speedX
  }

  setSpeedY(speedY: number) {
    this.speedY = speedY
  }

  resetSpeed() {
    this.speedX = 7
    this.speedY = 7
  }

  getProperties() {
    return {
      radius: this.radius,
      color: this.color,
      speedX: this.speedX,
      speedY: this.speedY,
      x: this.x,
      y: this.y,
    }
  }
}

export class Game {
  private canvas: HTMLCanvasElement | null
  private paddle: Paddle
  private ball: Ball
  private bricks: Brick[][]
  private lifes: number
  private score: number

  constructor(lifes: number) {
    this.canvas = null
    this.paddle = new Paddle()
    this.ball = new Ball()
    this.lifes = lifes
    this.score = 0
    this.bricks = this.createBricks(4, 5)
  }

  setCanvas(canvas: HTMLCanvasElement | null) {
    this.canvas = canvas
  }

  setDimensions(width: number, height: number) {
    if (!this.canvas) return

    this.canvas.width = width
    this.canvas.height = height
  }

  setPaddleMovement(state: string, theta: number) {
    this.paddle.setMovement(state, theta)
  }

  private createBricks(r: number, c: number) {
    const bricks: Brick[][] = []

    for (let i = 0; i < r; i++) {
      const rows: Brick[] = []

      for (let j = 0; j < c; j++) {
        rows.push(new Brick())
      }

      bricks.push(rows)
    }

    return bricks
  }

  private clearFrame() {
    if (!this.canvas) return

    const ctx = this.canvas.getContext('2d')

    if (!ctx) return

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  private lose() {
    return this.lifes === 0
  }

  private win() {
    let totalScore = 0

    this.bricks.forEach((rowBricks) => {
      rowBricks.forEach((columnBrick) => {
        const { points } = columnBrick.getProperties()
        totalScore += points
      })
    })

    return this.score === totalScore
  }

  isFinished() {
    return this.lose() || this.win()
  }

  private drawPaddle() {
    if (!this.canvas) return

    const ctx = this.canvas.getContext('2d')

    if (!ctx) return

    const { x, y, width, height, color } = this.paddle.getProperties()
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.rect(x, y, width, height)
    ctx.fill()
  }

  private drawBall() {
    if (!this.canvas) return

    const ctx = this.canvas.getContext('2d')

    if (!ctx) return

    const { x, y, radius, color } = this.ball.getProperties()
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fill()
  }

  private drawBricks() {
    if (!this.canvas) return

    const ctx = this.canvas.getContext('2d')

    if (!ctx) return

    this.bricks.forEach((rowBricks) => {
      rowBricks.forEach((columnBrick) => {
        const { x, y, width, height, color, broken } =
          columnBrick.getProperties()

        if (!broken) {
          ctx.beginPath()
          ctx.fillStyle = color
          ctx.rect(x, y, width, height)
          ctx.fill()
        }
      })
    })
  }

  private movePaddle() {
    if (!this.canvas) return

    const { state, theta, width, x, y } = this.paddle.getProperties()
    const step = Math.round(25 * Math.sin(theta))
    switch (state) {
      case STATES.RIGHT: {
        const maxX = this.canvas.width - width
        const nextX = x + step

        if (nextX >= maxX) this.paddle.setPosition(maxX, y)
        else this.paddle.setPosition(nextX, y)

        break
      }
      case STATES.LEFT: {
        const minX = 0
        const nextX = x - step

        if (nextX <= minX) this.paddle.setPosition(minX, y)
        else this.paddle.setPosition(nextX, y)

        break
      }
      default:
        break
    }
  }

  private moveBall() {
    if (!this.canvas) return

    const { width: gameWidth, height: gameHeight } = this.canvas
    const {
      width: paddleWidth,
      height: paddleHeight,
      x: paddleX,
      y: paddleY,
    } = this.paddle.getProperties()
    const {
      radius: ballRadius,
      speedX: ballSpeedX,
      speedY: ballSpeedY,
      x: ballX,
      y: ballY,
    } = this.ball.getProperties()

    // ! MOVE BALL
    const newPosition = {
      x: ballX - ballSpeedX,
      y: ballY - ballSpeedY,
    }
    this.ball.setPosition(newPosition.x, newPosition.y)

    // ! CHECK IF THERE WAS ANY COLLISION WITH GAME, BRICKS OR PADDLE BOUNDS
    // * BALL BOUNDS
    const ballTop = newPosition.y - ballRadius
    const ballBottom = newPosition.y + ballRadius
    const ballLeft = newPosition.x - ballRadius
    const ballRight = newPosition.x + ballRadius

    // * BRICKS BOUNDS
    this.bricks.forEach((rowBricks) => {
      rowBricks.forEach((columnBrick) => {
        const {
          x: brickX,
          y: brickY,
          width: brickWidth,
          height: brickHeight,
          broken,
          points,
        } = columnBrick.getProperties()

        const brickTop = brickY
        const brickLeft = brickX
        const brickRight = brickLeft + brickWidth
        const brickBottom = brickTop + brickHeight

        if (
          !broken &&
          ballTop < brickBottom &&
          ballRight > brickLeft &&
          ballLeft < brickRight &&
          ballBottom > brickTop
        ) {
          columnBrick.break()
          this.score += points
          this.ball.setSpeedY(-ballSpeedY)
        }
      })
    })

    // * GAME BOUNDS
    const gameTop = 0
    const gameBottom = gameHeight
    const gameLeft = 0
    const gameRight = gameWidth

    // * PADDLE BOUNDS
    const paddleTop = paddleY
    const paddleLeft = paddleX
    const paddleRight = paddleLeft + paddleWidth
    const paddleBottom = paddleTop + paddleHeight

    if (
      ballTop < paddleBottom &&
      ballRight > paddleLeft &&
      ballLeft < paddleRight &&
      ballBottom > paddleTop
    ) {
      const paddleCenter = (paddleLeft + paddleRight) / 2
      const ballFromCenterX = ballX - paddleCenter

      this.ball.setSpeedX(Math.round(ballFromCenterX * 0.1))
      this.ball.setSpeedY(-ballSpeedY)
      this.ball.setPosition(newPosition.x, paddleTop - ballRadius)
    } else if (ballBottom > gameBottom) {
      this.lifes--
      this.setInitialPositions()
    } else if (ballTop < gameTop) this.ball.setSpeedY(-ballSpeedY)
    else if (ballLeft < gameLeft || ballRight > gameRight)
      this.ball.setSpeedX(-ballSpeedX)
  }

  private showLifes() {
    if (!this.canvas) return

    const ctx = this.canvas.getContext('2d')

    if (!ctx) return

    const fontSize = 28
    const text = `Lifes: ${this.lifes}`
    ctx.font = `${fontSize}px Arial`
    ctx.fillStyle = '#000'
    ctx.textAlign = 'center'
    const { width } = ctx.measureText(text)
    ctx.fillText(text, width / 2 + PADDING, fontSize + PADDING)
  }

  private showScore() {
    if (!this.canvas) return

    const ctx = this.canvas.getContext('2d')

    if (!ctx) return

    const fontSize = 28
    const text = `Score: ${this.score}`
    ctx.font = `${fontSize}px Arial`
    ctx.fillStyle = '#000'
    ctx.textAlign = 'center'
    const { width } = ctx.measureText(text)
    ctx.fillText(
      text,
      this.canvas.width - width / 2 - PADDING,
      fontSize + PADDING
    )
  }

  showResults() {
    if (!this.canvas) return

    const ctx = this.canvas.getContext('2d')

    if (!ctx) return

    this.clearFrame()

    let fontSize = 62
    const finalText = this.lose() ? 'Game Over :(' : 'You win! :D'
    ctx.font = `${fontSize}px Arial`
    ctx.fillStyle = '#000'
    ctx.textAlign = 'center'
    ctx.fillText(
      finalText,
      this.canvas.width / 2,
      (this.canvas.height - fontSize) / 2
    )

    fontSize = 32
    const text = `Final score: ${this.score}`
    ctx.font = `${fontSize}px Arial`
    ctx.fillStyle = '#000'
    ctx.textAlign = 'center'
    ctx.fillText(
      text,
      this.canvas.width / 2,
      (this.canvas.height + fontSize) / 2
    )
  }

  private setInitialPositions() {
    if (!this.canvas) return

    const { width: gameWidth, height: gameHeight } = this.canvas
    const { width: paddleWidth, height: paddleHeight } =
      this.paddle.getProperties()
    const { radius: ballRadius } = this.ball.getProperties()

    const initialPaddlePosition = {
      x: (gameWidth - paddleWidth) / 2,
      y: gameHeight - paddleHeight - PADDING,
    }
    const initialBallPosition = {
      x: gameWidth / 2,
      y: initialPaddlePosition.y - ballRadius,
    }

    this.paddle.setPosition(initialPaddlePosition.x, initialPaddlePosition.y)
    this.ball.setPosition(initialBallPosition.x, initialBallPosition.y)

    const columns = this.bricks[0].length
    const brickWidth = (gameWidth - (columns + 1) * PADDING) / columns
    const brickHeight = 24

    this.bricks.forEach((rowBricks, rowIndex) => {
      rowBricks.forEach((columnBrick, columnIndex) => {
        columnBrick.setDimensions(brickWidth, brickHeight)
        columnBrick.setPosition(
          columnIndex * brickWidth + (columnIndex + 1) * PADDING,
          rowIndex * brickHeight + (rowIndex + 4) * PADDING
        )
      })
    })
  }

  private resetStats(lifes: number) {
    this.lifes = lifes
    this.score = 0
  }

  private resetBricks() {
    this.bricks.forEach((rowBricks) => {
      rowBricks.forEach((columnBrick) => {
        columnBrick.reset()
      })
    })
  }

  display() {
    this.setInitialPositions()
    this.showLifes()
    this.showScore()
    this.drawPaddle()
    this.drawBall()
    this.drawBricks()
  }

  play() {
    // ! CLEAR LAST FRAME
    this.clearFrame()

    // ! MOVE ELEMENTS
    this.movePaddle()
    this.moveBall()

    // ! DRAW ELEMENTS
    this.showLifes()
    this.showScore()
    this.drawPaddle()
    this.drawBall()
    this.drawBricks()
  }

  restart(lifes: number) {
    this.setInitialPositions()
    this.paddle.resetMovement()
    this.ball.resetSpeed()
    this.resetBricks()
    this.resetStats(lifes)
  }
}
