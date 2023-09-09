import Game from '@/game'

window.addEventListener('load', function () {
  const canvas = this.document.querySelector('canvas')!
  const game = new Game(canvas)
  let lastTime = 0

  const animate: FrameRequestCallback = (time) => {
    const delta = time - lastTime
    lastTime = time
    game.render(delta)
    this.requestAnimationFrame(animate)
  }

  animate(0)
})
