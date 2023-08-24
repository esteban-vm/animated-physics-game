import type { Game, SpriteSheet } from '@/types'
import { Firefly, Spark } from '@/particle'

export default class Larva implements SpriteSheet {
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
  private speedY
  public markedForDeletion

  constructor(game: Game, x: number, y: number) {
    this.game = game
    this.collisionRadius = 30
    this.collisionX = x
    this.collisionY = y
    this.image = document.getElementById('larva') as HTMLImageElement
    this.spriteWidth = 150
    this.spriteHeight = 150
    this.width = this.spriteWidth
    this.height = this.spriteHeight
    this.frameX = 0
    this.frameY = Math.floor(Math.random() * 2)
    this.speedY = 1 + Math.random()
    this.markedForDeletion = false
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
    this.collisionY -= this.speedY
    this.spriteX = this.collisionX - this.width * 0.5
    this.spriteY = this.collisionY - this.height * 0.5 - 50
    if (this.collisionY < this.game.topMargin) {
      this.markedForDeletion = true
      this.game.removeObjects()
      this.game.score++
      for (let index = 1; index <= 3; index++) {
        this.game.particles.push(new Firefly(this.game, this.collisionX, this.collisionY, 'yellow'))
      }
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
    this.game.enemies.forEach((enemy) => {
      const { collides } = this.game.checkCollision(this, enemy)
      if (collides) {
        this.markedForDeletion = true
        this.game.removeObjects()
        this.game.lostHatchings++
        for (let index = 1; index <= 5; index++) {
          this.game.particles.push(new Spark(this.game, this.collisionX, this.collisionY, 'blue'))
        }
      }
    })
  }
}
