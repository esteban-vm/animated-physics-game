import type { Game, SpriteSheet } from '@/types'

export default class Obstacle implements SpriteSheet {
  public game
  public collisionX
  public collisionY
  public collisionRadius
  public image
  public width
  public height
  public x
  public y
  public frameX
  public frameY

  constructor(game: Game) {
    this.game = game
    this.collisionX = Math.random() * this.game.width
    this.collisionY = Math.random() * this.game.height
    this.collisionRadius = 60
    this.image = document.getElementById('obstacle') as HTMLImageElement
    this.width = 250
    this.height = 250
    this.x = this.collisionX - this.width * 0.5
    this.y = this.collisionY - this.height * 0.5 - 70
    this.frameX = Math.floor(Math.random() * 4)
    this.frameY = Math.floor(Math.random() * 3)
  }

  public create() {
    const { game, image, x, y, frameX, frameY, width, height } = this
    const sourceX = frameX * width
    const sourceY = frameY * height
    game.context.drawImage(image, sourceX, sourceY, width, height, x, y, width, height)
    if (game.debug) {
      game.context.beginPath()
      game.context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2)
      game.context.save()
      game.context.globalAlpha = 0.5
      game.context.fill()
      game.context.restore()
      game.context.stroke()
    }
  }

  public update() {}
}
