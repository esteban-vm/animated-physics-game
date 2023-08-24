import type { GameObject, Larva, Particle, Sprite } from '@/types'
import { Egg, Enemy, Player, Obstacle } from '@/models'

export default class Game {
  public canvas
  public width
  public height
  public player
  public pointer
  public objects: GameObject[]
  public obstacles: Obstacle[]
  public eggs: Egg[]
  public enemies: Enemy[]
  public hatchlings: Larva[]
  public particles: Particle[]
  public lostHatchings
  public debug
  public topMargin
  public fps
  public timer
  public eggTimer
  public interval
  public eggInterval
  public score
  public winningScore
  public gameOver
  private numberOfObstacles
  private numberOfEggs

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.player = new Player(this)
    this.pointer = { x: this.player.collisionX, y: this.player.collisionY, pressed: false }
    this.objects = []
    this.obstacles = []
    this.eggs = []
    this.enemies = []
    this.hatchlings = []
    this.particles = []
    this.lostHatchings = 0
    this.debug = import.meta.env.DEV
    this.topMargin = 260
    this.fps = 70
    this.timer = 0
    this.eggTimer = 0
    this.interval = 1_000 / this.fps
    this.eggInterval = 500
    this.score = 0
    this.winningScore = 5
    this.gameOver = false
    this.numberOfObstacles = 10
    this.numberOfEggs = 5
    this.init()
    this.addListeners()
  }

  public render(context: CanvasRenderingContext2D, delta: number) {
    if (this.timer > this.interval) {
      context.clearRect(0, 0, this.width, this.height)
      this.objects = [
        this.player,
        ...this.eggs,
        ...this.obstacles,
        ...this.enemies,
        ...this.hatchlings,
        ...this.particles,
      ]
      this.objects.sort((a, b) => a.collisionY - b.collisionY)
      this.objects.forEach((sprite) => {
        sprite.create(context)
        sprite.update(delta)
      })
      this.timer = 0
    }
    this.timer += delta
    if (this.eggTimer > this.eggInterval && this.eggs.length < this.numberOfEggs && !this.gameOver) {
      this.addEgg()
      this.eggTimer = 0
    } else {
      this.eggTimer += delta
    }
    context.save()
    context.textAlign = 'left'
    context.fillText(`Score: ${this.score}`, 25, 50)
    if (this.debug) {
      context.fillText(`Lost: ${this.lostHatchings}`, 25, 100)
    }
    context.restore()
    if (this.score >= this.winningScore) {
      this.gameOver = true
      context.save()
      context.fillStyle = 'rgba(0, 0, 0, 0.5)'
      context.fillRect(0, 0, this.width, this.height)
      context.fillStyle = 'white'
      context.textAlign = 'center'
      context.shadowOffsetX = 4
      context.shadowOffsetY = 4
      context.shadowColor = 'black'
      let message1: string
      let message2: string
      const x = this.width * 0.5
      const y = this.height * 0.5
      if (this.lostHatchings <= 5) {
        message1 = 'Bullseye!!!'
        message2 = 'You bullied the bullies'
      } else {
        message1 = 'Bullocks!'
        message2 = `You lost ${this.hatchlings} hatchlings, don't be a pushover!`
      }
      context.font = '130px Bangers'
      context.fillText(message1, x, y - 30)
      context.font = '40px Bangers'
      context.fillText(message2, x, y + 30)
      context.fillText(`Final score: ${this.score}. Press "R" to butt heads again!`, x, y + 80)
      context.restore()
    }
  }

  private init() {
    for (let index = 1; index <= 5; index++) this.addEnemy()
    let attempts = 0
    while (this.obstacles.length < this.numberOfObstacles && attempts < 500) {
      const testObstacle = new Obstacle(this)
      let overlap = false
      this.obstacles.forEach((obstacle) => {
        const distanceX = testObstacle.collisionX - obstacle.collisionX
        const distanceY = testObstacle.collisionY - obstacle.collisionY
        const distance = Math.hypot(distanceY, distanceX)
        const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius + 150
        if (distance < sumOfRadii) overlap = true
      })
      const { spriteX: sx, width: ow, collisionY: cy, collisionRadius: cr } = testObstacle
      const { width: gw, height: gh, topMargin: tm } = this
      const margin = cr * 3
      if (!overlap && sx > 0 && sx < gw - ow && cy > margin + tm && cy < gh - margin) {
        this.obstacles.push(testObstacle)
      }
      attempts++
    }
  }

  private addListeners() {
    this.canvas.addEventListener('pointerdown', (event) => {
      this.pointer.x = event.offsetX
      this.pointer.y = event.offsetY
      this.pointer.pressed = true
    })

    this.canvas.addEventListener('pointerup', (event) => {
      this.pointer.x = event.offsetX
      this.pointer.y = event.offsetY
      this.pointer.pressed = false
    })

    this.canvas.addEventListener('pointermove', (event) => {
      if (this.pointer.pressed) {
        this.pointer.x = event.offsetX
        this.pointer.y = event.offsetY
      }
    })

    window.addEventListener('keydown', (event) => {
      if (event.key === 'd') this.debug = !this.debug
    })
  }

  private addEgg() {
    this.eggs.push(new Egg(this))
  }

  private addEnemy() {
    this.enemies.push(new Enemy(this))
  }

  public checkCollision(sprite1: Sprite, sprite2: Sprite) {
    const distanceX = sprite1.collisionX - sprite2.collisionX
    const distanceY = sprite1.collisionY - sprite2.collisionY
    const distance = Math.hypot(distanceY, distanceX)
    const sumOfRadii = sprite1.collisionRadius + sprite2.collisionRadius
    return { collides: distance < sumOfRadii, d: distance, sum: sumOfRadii, dx: distanceX, dy: distanceY }
  }

  public removeObjects() {
    this.eggs = this.eggs.filter((egg) => !egg.markedForDeletion)
    this.hatchlings = this.hatchlings.filter((hatchling) => !hatchling.markedForDeletion)
    this.particles = this.particles.filter((particle) => !particle.markedForDeletion)
  }
}
