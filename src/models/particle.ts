import type { Game, GameObject } from '@/types'

export default abstract class Particle implements GameObject {
  public game
  public collisionX
  public collisionY
  public collisionRadius
  private color
  protected speedX
  protected speedY
  protected angle
  protected va
  public markedForDeletion

  constructor(game: Game, x: number, y: number, color: string) {
    this.game = game
    this.collisionX = x
    this.collisionY = y
    this.collisionRadius = Math.floor(Math.random() * 10 + 5)
    this.color = color
    this.speedX = Math.random() * 6 - 3
    this.speedY = Math.random() * 2 + 0.5
    this.angle = 0
    this.va = Math.random() * 0.1 + 0.01
    this.markedForDeletion = false
  }

  public create() {
    const { context } = this.game
    context.save()
    context.fillStyle = this.color
    context.beginPath()
    context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2)
    context.fill()
    context.stroke()
    context.restore()
  }

  public abstract update(): void
}

export class Firefly extends Particle {
  public update() {
    this.angle += this.va
    this.collisionX += Math.cos(this.angle) * this.speedX
    this.collisionY -= this.speedY
    if (this.collisionY < 0 - this.collisionRadius) {
      this.markedForDeletion = true
      this.game.removeObjects()
    }
  }
}

export class Spark extends Particle {
  public update() {
    this.angle += this.va * 0.5
    this.collisionX -= Math.cos(this.angle) * this.speedX
    this.collisionY -= Math.sin(this.angle) * this.speedY
    if (this.collisionRadius > 0.1) this.collisionRadius -= 0.05
    if (this.collisionRadius < 0.2) {
      this.markedForDeletion = true
      this.game.removeObjects()
    }
  }
}
