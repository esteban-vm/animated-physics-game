import type { Game, SpriteSheet } from '@/types'
import { Firefly, Spark } from '@/particle'

export default class Larva implements SpriteSheet {
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
  private speedY
  public markedForDeletion

  constructor(game: Game, x: number, y: number) {
    this.game = game
    this.collisionX = x
    this.collisionY = y
    this.collisionRadius = 30
    this.image = document.getElementById('larva') as HTMLImageElement
    this.width = 150
    this.height = 150
    this.frameX = 0
    this.frameY = Math.floor(Math.random() * 2)
    this.maxFrame = 38
    this.speedY = 1 + Math.random()
    this.markedForDeletion = false
  }

  public create(context: CanvasRenderingContext2D) {
    const { game, image, x, y, frameX, frameY, collisionX, collisionY, collisionRadius, width, height } = this
    const sourceX = frameX * width
    const sourceY = frameY * height
    context.drawImage(image, sourceX, sourceY, width, height, x, y, width, height)
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
    this.x = this.collisionX - this.width * 0.5
    this.y = this.collisionY - this.height * 0.5 - 40
    if (this.collisionY < this.game.topMargin) {
      this.markedForDeletion = true
      this.game.removeObjects()
      if (!this.game.gameOver) this.game.score++
      for (let index = 1; index <= 3; index++) {
        this.game.particles.push(new Firefly(this.game, this.collisionX, this.collisionY, 'yellow'))
      }
    }
    if (this.frameX < this.maxFrame) this.frameX++
    else this.frameX = 0
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
