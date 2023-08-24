import type { Game, SpriteSheet } from '@/types'

export default class Player implements SpriteSheet {
  public game
  public collisionRadius
  public collisionX
  public collisionY
  public image
  public spriteWidth
  public spriteHeight
  public width
  public height
  public spriteX!: number
  public spriteY!: number
  public frameX
  public frameY
  private speedX
  private speedY
  private distanceX
  private distanceY
  private speedModifier

  constructor(game: Game) {
    this.game = game
    this.collisionRadius = 30
    this.collisionX = this.game.width * 0.5
    this.collisionY = this.game.height * 0.5
    this.image = document.getElementById('bull') as HTMLImageElement
    this.spriteWidth = 255
    this.spriteHeight = 256
    this.width = this.spriteWidth
    this.height = this.spriteHeight
    this.frameX = 0
    this.frameY = 5
    this.speedX = 0
    this.speedY = 0
    this.distanceX = 0
    this.distanceY = 0
    this.speedModifier = 3
  }

  public create(context: CanvasRenderingContext2D) {
    const {
      game,
      image,
      spriteWidth,
      spriteHeight,
      spriteX,
      spriteY,
      frameX,
      frameY,
      collisionX,
      collisionY,
      collisionRadius,
      width,
      height,
    } = this
    const sourceX = frameX * spriteWidth
    const sourceY = frameY * spriteHeight
    context.drawImage(image, sourceX, sourceY, spriteWidth, spriteHeight, spriteX, spriteY, width, height)
    if (game.debug) {
      context.beginPath()
      context.arc(collisionX, collisionY, collisionRadius, 0, Math.PI * 2)
      context.save()
      context.globalAlpha = 0.5
      context.fill()
      context.restore()
      context.stroke()
      context.beginPath()
      context.moveTo(collisionX, collisionY)
      context.lineTo(game.pointer.x, game.pointer.y)
      context.stroke()
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
    this.spriteX = this.collisionX - this.width * 0.5
    this.spriteY = this.collisionY - this.height * 0.5 - 100
    this.setBoundaries()
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

  public restart() {
    this.collisionX = this.game.width * 0.5
    this.collisionY = this.game.height * 0.5
    this.spriteX = this.collisionX - this.width * 0.5
    this.spriteY = this.collisionY - this.height * 0.5 - 100
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
  }

  private setBoundaries() {
    const { game, collisionRadius, collisionX, collisionY } = this
    if (collisionX < collisionRadius) this.collisionX = collisionRadius
    else if (collisionX > game.width - collisionRadius) this.collisionX = game.width - collisionRadius
    if (collisionY < game.topMargin + collisionRadius) this.collisionY = game.topMargin + collisionRadius
    else if (collisionY > game.height - collisionRadius) this.collisionY = game.height - collisionRadius
  }
}
