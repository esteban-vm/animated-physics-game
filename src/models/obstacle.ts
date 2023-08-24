import type { Game, SpriteSheet } from '@/types'

export default class Obstacle implements SpriteSheet {
  public game
  public collisionRadius
  public collisionX
  public collisionY
  public image
  public spriteWidth
  public spriteHeight
  public width
  public height
  public spriteX
  public spriteY
  public frameX
  public frameY

  constructor(game: Game) {
    this.game = game
    this.collisionRadius = 60
    this.collisionX = Math.random() * this.game.width
    this.collisionY = Math.random() * this.game.height
    this.image = document.getElementById('obstacles') as HTMLImageElement
    this.spriteWidth = 250
    this.spriteHeight = 250
    this.width = this.spriteWidth
    this.height = this.spriteHeight
    this.spriteX = this.collisionX - this.width * 0.5
    this.spriteY = this.collisionY - this.height * 0.5 - 70
    this.frameX = Math.floor(Math.random() * 4)
    this.frameY = Math.floor(Math.random() * 3)
  }

  public create(context: CanvasRenderingContext2D) {
    const { game, image, spriteWidth, spriteHeight, spriteX, spriteY, frameX, frameY, width, height } = this
    const sourceX = frameX * spriteWidth
    const sourceY = frameY * spriteHeight
    context.drawImage(image, sourceX, sourceY, spriteWidth, spriteHeight, spriteX, spriteY, width, height)
    if (game.debug) {
      context.beginPath()
      context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2)
      context.save()
      context.globalAlpha = 0.5
      context.fill()
      context.restore()
      context.stroke()
    }
  }

  public update() {}
}
