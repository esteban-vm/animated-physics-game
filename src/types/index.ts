import type Game from '@/game'

export interface GameObject {
  game: Game
  collisionX: number
  collisionY: number
  collisionRadius: number
  create(): void
  update(delta: number): void
}

export interface Sprite extends GameObject {
  image: HTMLImageElement
  width: number
  height: number
  x: number
  y: number
}

export interface SpriteSheet extends Sprite {
  frameX: number
  frameY: number
}

export type { Game }
export type * from '@/models'
export type Removable<T = unknown> = T & { markedForDeletion: boolean }
