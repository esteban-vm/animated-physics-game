import type { Game, SpriteSheet } from '@/types'

export default abstract class Enemy implements SpriteSheet {
  public game
  public collisionRadius
  public abstract collisionX: number
  public collisionY
  public abstract image: HTMLImageElement
  public abstract spriteWidth: number
  public abstract spriteHeight: number
  public abstract width: number
  public abstract height: number
  public spriteX!: number
  public abstract spriteY: number
  public frameX
  public frameY
  private maxFrame
  private speedX

  constructor(game: Game) {
    this.game = game
    this.collisionRadius = 30
    this.collisionY = this.game.topMargin + Math.random() * (this.game.height - this.game.topMargin)
    this.frameX = 0
    this.frameY = Math.floor(Math.random() * 4)
    this.maxFrame = 38
    this.speedX = Math.random() * 3 + 0.5
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
    }
  }

  public update() {
    if (this.frameX < this.maxFrame) this.frameX++
    else this.frameX = 0
    this.spriteX = this.collisionX - this.width * 0.5
    this.collisionX -= this.speedX
    if (this.spriteX + this.width < 0 && !this.game.gameOver) {
      this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5
      this.collisionY = this.game.topMargin + Math.random() * (this.game.height - this.game.topMargin)
      this.frameY = Math.floor(Math.random() * 4)
    }
    this.handleCollisions()
  }

  private handleCollisions() {
    const collisionSprites = [this.game.player, ...this.game.obstacles]
    collisionSprites.forEach((sprite) => {
      const { collides, d, sum, dx, dy } = this.game.checkCollision(this, sprite)
      if (collides) {
        const unitX = dx / d
        const unitY = dy / d
        const margin = sum + 1
        this.collisionX = sprite.collisionX + margin * unitX
        this.collisionY = sprite.collisionY + margin * unitY
      }
    })
  }
}

export class ToadSkin extends Enemy {
  public collisionX
  public image
  public spriteWidth
  public spriteHeight
  public width
  public height
  public spriteY!: number

  constructor(game: Game) {
    super(game)
    this.image = document.getElementById('toad_sprite') as HTMLImageElement
    this.spriteWidth = 154
    this.spriteHeight = 238
    this.width = this.spriteWidth
    this.height = this.spriteHeight
    this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5
  }

  public update() {
    super.update()
    this.spriteY = this.collisionY - this.height * 0.5 - 90
  }
}

export class BarkSkin extends Enemy {
  public collisionX
  public image
  public spriteWidth
  public spriteHeight
  public width
  public height
  public spriteY!: number

  constructor(game: Game) {
    super(game)
    this.image = document.getElementById('bark_sprite') as HTMLImageElement
    this.spriteWidth = 183
    this.spriteHeight = 280
    this.width = this.spriteWidth
    this.height = this.spriteHeight
    this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5
  }

  public update() {
    super.update()
    this.spriteY = this.collisionY - this.height * 0.5 - 100
  }
}
