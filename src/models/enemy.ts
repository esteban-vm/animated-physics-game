import type { Game, SpriteSheet } from '@/types'

export default abstract class Enemy implements SpriteSheet {
  public game
  public abstract collisionX: number
  public collisionY
  public collisionRadius
  public abstract image: HTMLImageElement
  public abstract width: number
  public abstract height: number
  public x!: number
  public abstract y: number
  public frameX
  public frameY
  private maxFrame
  private speedX

  constructor(game: Game) {
    this.game = game
    this.collisionY = this.game.topMargin + Math.random() * (this.game.height - this.game.topMargin)
    this.collisionRadius = 30
    this.frameX = 0
    this.frameY = Math.floor(Math.random() * 4)
    this.maxFrame = 38
    this.speedX = Math.random() * 3 + 0.5
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
    }
  }

  public update() {
    if (this.frameX < this.maxFrame) this.frameX++
    else this.frameX = 0
    this.x = this.collisionX - this.width * 0.5
    this.collisionX -= this.speedX
    if (this.x + this.width < 0 && !this.game.gameOver) {
      this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5
      this.collisionY = this.game.topMargin + Math.random() * (this.game.height - this.game.topMargin)
      this.frameY = Math.floor(Math.random() * 4)
    }
    this.handleCollisions()
  }

  private handleCollisions() {
    const objects = [this.game.player, ...this.game.obstacles]
    objects.forEach((object) => {
      const { collides, d, sum, dx, dy } = this.game.checkCollision(this, object)
      if (collides) {
        const unitX = dx / d
        const unitY = dy / d
        const margin = sum + 1
        this.collisionX = object.collisionX + margin * unitX
        this.collisionY = object.collisionY + margin * unitY
      }
    })
  }
}

export class ToadSkin extends Enemy {
  public collisionX
  public image
  public width
  public height
  public y!: number

  constructor(game: Game) {
    super(game)
    this.image = document.getElementById('toad') as HTMLImageElement
    this.width = 154
    this.height = 238
    this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5
  }

  public update() {
    super.update()
    this.y = this.collisionY - this.height * 0.5 - 90
  }
}

export class BarkSkin extends Enemy {
  public collisionX
  public image
  public width
  public height
  public y!: number

  constructor(game: Game) {
    super(game)
    this.image = document.getElementById('bark') as HTMLImageElement
    this.width = 183
    this.height = 280
    this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5
  }

  public update() {
    super.update()
    this.y = this.collisionY - this.height * 0.5 - 100
  }
}
