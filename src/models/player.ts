import type { Game, SpriteSheet } from '@/types'

export default class Player implements SpriteSheet {
  public game
  public collisionX
  public collisionY
  public collisionRadius
  public image
  public width
  public height
  public x!: number
  public y!: number
  public frameX
  public frameY
  private maxFrame
  private speedX
  private speedY
  private distanceX
  private distanceY
  private speedModifier

  constructor(game: Game) {
    this.game = game
    this.collisionX = this.game.width * 0.5
    this.collisionY = this.game.height * 0.5
    this.collisionRadius = 30
    this.image = <HTMLImageElement>document.getElementById('bull')
    this.width = 255
    this.height = 256
    this.frameX = 0
    this.frameY = 5
    this.maxFrame = 58
    this.speedX = 0
    this.speedY = 0
    this.distanceX = 0
    this.distanceY = 0
    this.speedModifier = 3
  }

  public create() {
    const { game, image, x, y, frameX, frameY, collisionX, collisionY, collisionRadius, width, height } = this
    const sourceX = frameX * width
    const sourceY = frameY * height
    game.context.drawImage(image, sourceX, sourceY, width, height, x, y, width, height)
    if (game.debug) {
      game.context.beginPath()
      game.context.arc(collisionX, collisionY, collisionRadius, 0, Math.PI * 2)
      game.context.save()
      game.context.globalAlpha = 0.5
      game.context.fill()
      game.context.restore()
      game.context.stroke()
      game.context.beginPath()
      game.context.moveTo(collisionX, collisionY)
      game.context.lineTo(game.pointer.x, game.pointer.y)
      game.context.stroke()
    }
  }

  public update() {
    this.distanceX = this.game.pointer.x - this.collisionX
    this.distanceY = this.game.pointer.y - this.collisionY
    this.rotate()
    const distance = Math.hypot(this.distanceY, this.distanceX)
    if (distance > this.speedModifier) {
      this.speedX = this.distanceX / distance
      this.speedY = this.distanceY / distance
    } else {
      this.speedX = 0
      this.speedY = 0
    }
    this.collisionX += this.speedX * this.speedModifier
    this.collisionY += this.speedY * this.speedModifier
    this.x = this.collisionX - this.width * 0.5
    this.y = this.collisionY - this.height * 0.5 - 100
    this.setBoundaries()
    this.handleCollisions()
  }

  public restart() {
    this.collisionX = this.game.width * 0.5
    this.collisionY = this.game.height * 0.5
    this.x = this.collisionX - this.width * 0.5
    this.y = this.collisionY - this.height * 0.5 - 100
  }

  private rotate() {
    const angle = Math.atan2(this.distanceY, this.distanceX)
    if (angle < -2.74 || angle > 2.74) this.frameY = 6
    else if (angle < -1.96) this.frameY = 7
    else if (angle < -1.17) this.frameY = 0
    else if (angle < -0.39) this.frameY = 1
    else if (angle < 0.39) this.frameY = 2
    else if (angle < 1.17) this.frameY = 3
    else if (angle < 1.96) this.frameY = 4
    else if (angle < 2.74) this.frameY = 5
    if (this.frameX < this.maxFrame) this.frameX++
    else this.frameX = 0
  }

  private setBoundaries() {
    const { game, collisionRadius, collisionX, collisionY } = this
    if (collisionX < collisionRadius) this.collisionX = collisionRadius
    else if (collisionX > game.width - collisionRadius) this.collisionX = game.width - collisionRadius
    if (collisionY < game.topMargin + collisionRadius) this.collisionY = game.topMargin + collisionRadius
    else if (collisionY > game.height - collisionRadius) this.collisionY = game.height - collisionRadius
  }

  private handleCollisions() {
    this.game.obstacles.forEach((obstacle) => {
      const { collides, d, sum, dx, dy } = this.game.checkCollision(this, obstacle)
      if (collides) {
        const unitX = dx / d
        const unitY = dy / d
        const margin = sum + 1
        this.collisionX = obstacle.collisionX + margin * unitX
        this.collisionY = obstacle.collisionY + margin * unitY
      }
    })
  }
}
