import type { Enemy, GameObject, Larva, Particle } from '@/types'
import { Egg, Obstacle, Player, BarkSkin, ToadSkin } from '@/models'

export default class Game {
  private canvas
  public context
  public width
  public height
  public player
  public debug
  public topMargin
  public fps
  public timer
  public eggTimer
  public interval
  public eggInterval
  public winningScore
  public objects: GameObject[]
  public obstacles!: Obstacle[]
  public eggs!: Egg[]
  public enemies!: Enemy[]
  public hatchlings!: Larva[]
  public particles!: Particle[]
  public pointer!: { x: number; y: number; pressed: boolean }
  public score!: number
  public lostHatchings!: number
  public gameOver!: boolean
  private background
  private overlay
  private numberOfObstacles
  private numberOfEggs
  private numberOfEnemies

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.context = this.canvas.getContext('2d')!
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.player = new Player(this)
    this.debug = import.meta.env.DEV
    this.topMargin = 260
    this.fps = 70
    this.timer = 0
    this.eggTimer = 0
    this.interval = 1_000 / this.fps
    this.eggInterval = 500
    this.winningScore = 30
    this.background = document.getElementById('background') as HTMLImageElement
    this.overlay = document.getElementById('overlay') as HTMLImageElement
    this.numberOfObstacles = 10
    this.numberOfEggs = 5
    this.numberOfEnemies = 5
    this.objects = []
    this.setStyles()
    this.init()
    this.setListeners()
  }

  public render(delta: number) {
    const { context } = this
    if (this.timer > this.interval) {
      // context.clearRect(0, 0, this.width, this.height)
      context.drawImage(this.background, 0, 0)
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
        sprite.create()
        sprite.update(delta)
      })
      context.drawImage(this.overlay, 0, 0)
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
    this.displayMessage()
  }

  public removeObjects() {
    this.eggs = this.eggs.filter((egg) => !egg.markedForDeletion)
    this.hatchlings = this.hatchlings.filter((hatchling) => !hatchling.markedForDeletion)
    this.particles = this.particles.filter((particle) => !particle.markedForDeletion)
  }

  public checkCollision(object1: GameObject, object2: GameObject) {
    const distanceX = object1.collisionX - object2.collisionX
    const distanceY = object1.collisionY - object2.collisionY
    const distance = Math.hypot(distanceY, distanceX)
    const sumOfRadii = object1.collisionRadius + object2.collisionRadius
    return { collides: distance < sumOfRadii, d: distance, sum: sumOfRadii, dx: distanceX, dy: distanceY }
  }

  private setStyles() {
    this.context.fillStyle = 'aliceblue'
    this.context.strokeStyle = 'black'
    this.context.lineWidth = 3
    this.context.font = '40px Bangers'
    this.context.textAlign = 'center'
  }

  private init() {
    this.obstacles = []
    this.eggs = []
    this.enemies = []
    this.hatchlings = []
    this.particles = []
    this.pointer = { x: this.player.collisionX, y: this.player.collisionY, pressed: false }
    this.score = 0
    this.lostHatchings = 0
    this.gameOver = false
    for (let index = 1; index <= this.numberOfEnemies; index++) this.addEnemy()
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
      const { x: sx, width: ow, collisionY: cy, collisionRadius: cr } = testObstacle
      const { width: gw, height: gh, topMargin: tm } = this
      const margin = cr * 3
      if (!overlap && sx > 0 && sx < gw - ow && cy > margin + tm && cy < gh - margin) {
        this.obstacles.push(testObstacle)
      }
      attempts++
    }
  }

  private setListeners() {
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
      else if (event.key === 'r') this.restart()
      else if (event.key === 'f') this.toggleFullscreen()
    })
  }

  private addEgg() {
    this.eggs.push(new Egg(this))
  }

  private addEnemy() {
    if (Math.random() < 0.5) this.enemies.push(new ToadSkin(this))
    else this.enemies.push(new BarkSkin(this))
  }

  private restart() {
    this.player.restart()
    this.init()
  }

  private toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen()
    else document.exitFullscreen()
  }

  private displayMessage() {
    if (this.score >= this.winningScore) {
      const { context } = this
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
        message2 = `You lost ${this.lostHatchings} hatchlings, don't be a pushover!`
      }
      context.font = '130px Bangers'
      context.fillText(message1, x, y - 30)
      context.font = '40px Bangers'
      context.fillText(message2, x, y + 30)
      context.fillText(`Final score: ${this.score}. Press "R" to butt heads again!`, x, y + 80)
      context.restore()
    }
  }
}
