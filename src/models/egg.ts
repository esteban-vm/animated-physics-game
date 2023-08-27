import type { Game, Sprite } from '@/types'
import Larva from '@/larva'

export default class Egg implements Sprite {
  public game
  public collisionX
  public collisionY
  public collisionRadius
  public image
  public width
  public height
  public x!: number
  public y!: number
  private hatchTimer
  private hatchInterval
  public markedForDeletion

  constructor(game: Game) {
    this.game = game
    this.collisionX = 80 + Math.random() * (this.game.width - 160)
    this.collisionY = this.game.topMargin + Math.random() * (this.game.height - this.game.topMargin - 80)
    this.collisionRadius = 40
    this.image = document.getElementById('egg') as HTMLImageElement
    this.width = 110
    this.height = 135
    this.hatchTimer = 0
    this.hatchInterval = 10_000
    this.markedForDeletion = false
  }

  public create(context: CanvasRenderingContext2D) {
    context.drawImage(this.image, this.x, this.y)
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

  public update(...args: [delta: number]) {
    this.x = this.collisionX - this.width * 0.5
    this.y = this.collisionY - this.height * 0.5 - 30
    this.handleCollisions()
    this.handleHatching(...args)
  }

  private handleCollisions() {
    const { player, obstacles, enemies, hatchlings, gameOver } = this.game
    const objects = [player, ...obstacles, ...enemies, ...hatchlings]
    objects.forEach((object) => {
      const { collides, d, sum, dx, dy } = this.game.checkCollision(this, object)
      if (collides && !gameOver) {
        const unitX = dx / d
        const unitY = dy / d
        const margin = sum + 1
        this.collisionX = object.collisionX + margin * unitX
        this.collisionY = object.collisionY + margin * unitY
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
