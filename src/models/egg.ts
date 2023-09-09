import type { Game, Sprite, Removable } from '@/types'
import Larva from '@/larva'

export default class Egg implements Removable<Sprite> {
  public game
  public collisionX
  public collisionY
  public collisionRadius
  public image
  public width
  public height
  public x!: number
  public y!: number
  public markedForDeletion
  private hatchTimer
  private hatchInterval

  constructor(game: Game) {
    this.game = game
    this.collisionX = 80 + Math.random() * (this.game.width - 160)
    this.collisionY = this.game.topMargin + Math.random() * (this.game.height - this.game.topMargin - 80)
    this.collisionRadius = 40
    this.image = <HTMLImageElement>document.getElementById('egg')
    this.width = 110
    this.height = 135
    this.markedForDeletion = false
    this.hatchTimer = 0
    this.hatchInterval = 10_000
  }

  public create() {
    const { game, image, x, y, collisionX, collisionY, collisionRadius, hatchTimer } = this
    game.context.drawImage(image, x, y)
    if (game.debug) {
      game.context.beginPath()
      game.context.arc(collisionX, collisionY, collisionRadius, 0, Math.PI * 2)
      game.context.save()
      game.context.globalAlpha = 0.5
      game.context.fill()
      game.context.restore()
      game.context.stroke()
      const displayTimer = (hatchTimer * 0.001).toFixed(0)
      game.context.fillText(displayTimer, collisionX, collisionY - collisionRadius * 2.5)
    }
  }

  public update(...args: [delta: number]) {
    this.x = this.collisionX - this.width * 0.5
    this.y = this.collisionY - this.height * 0.5 - 30
    this.handleCollisions()
    this.handleHatching(...args)
  }

  private handleCollisions() {
    const { player, obstacles, enemies, hatchlings, isOver } = this.game
    const objects = [player, ...obstacles, ...enemies, ...hatchlings]
    objects.forEach((object) => {
      const { collides, d, sum, dx, dy } = this.game.checkCollision(this, object)
      if (collides && !isOver) {
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
