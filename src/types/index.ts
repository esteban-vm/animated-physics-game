import type Game from '@/game'

export interface GameObject {
  game: Game
  collisionX: number
  collisionY: number
  create(context: CanvasRenderingContext2D): void
  update(delta: number): void
}

export interface Sprite extends GameObject {
  collisionRadius: number
  image: HTMLImageElement
  spriteWidth: number
  spriteHeight: number
  width: number
  height: number
  spriteX: number
  spriteY: number
}

export interface SpriteSheet extends Sprite {
  frameX: number
  frameY: number
}

export type * from '@/models'
export type { default as Game } from '@/game'
