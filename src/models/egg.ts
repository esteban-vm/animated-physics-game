import type { Game, Sprite } from '@/types'
import Larva from '@/larva'

export default class Egg implements Sprite {
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
  private hatchTimer
  private hatchInterval
  public markedForDeletion

  constructor(game: Game) {
    this.game = game
    this.collisionRadius = 40
    const margin = this.collisionRadius * 2
    this.collisionX = margin + Math.random() * (this.game.width - margin * 2)
    this.collisionY = this.game.topMargin + Math.random() * (this.game.height - this.game.topMargin - margin)
    this.image = document.getElementById('egg') as HTMLImageElement
    this.spriteWidth = 110
    this.spriteHeight = 135
    this.width = this.spriteWidth
    this.height = this.spriteHeight
    this.hatchTimer = 0
    this.hatchInterval = 10_000
    this.markedForDeletion = false
  }

  public create(context: CanvasRenderingContext2D) {
    context.drawImage(this.image, this.spriteX, this.spriteY)
    if (this.game.debug) {
      context.beginPath()
      const { collisionRadius, collisionX, collisionY } = this
      context.arc(collisionX, collisionY, collisionRadius, 0, Math.PI * 2)
      context.save()
      context.globalAlpha = 0.5
      context.fill()
      context.restore()
      context.stroke()
      const displayTimer = (this.hatchTimer * 0.001).toFixed(0)
      context.fillText(displayTimer, collisionX, collisionY - collisionRadius * 2.5)
    }
  }

  public update(delta: number) {
    this.spriteX = this.collisionX - this.width * 0.5
    this.spriteY = this.collisionY - this.height * 0.5 - 30
    this.handleCollisions()
    this.handleHatching(delta)
  }

  private handleCollisions() {
    const collisionSprites = [this.game.player, ...this.game.obstacles, ...this.game.enemies, ...this.game.hatchlings]
    collisionSprites.forEach((sprite) => {
      const { collides, d, sum, dx, dy } = this.game.checkCollision(this, sprite)
      if (collides && !this.game.gameOver) {
        const unitX = dx / d
        const unitY = dy / d
        const margin = sum + 1
        this.collisionX = sprite.collisionX + margin * unitX
        this.collisionY = sprite.collisionY + margin * unitY
      }
    })
  }

  private handleHatching(delta: number) {
    if (this.hatchTimer > this.hatchInterval || this.collisionY < this.game.topMargin) {
      this.game.hatchlings.push(new Larva(this.game, this.collisionX, this.collisionY))
      this.markedForDeletion = true
      this.game.removeObjects()
    } else {
      this.hatchTimer += delta
    }
  }
}
