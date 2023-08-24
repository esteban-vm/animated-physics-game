import Game from '@/game'

window.addEventListener('load', function () {
  const canvas = this.document.querySelector('canvas')!
  canvas.width = 1_280
  canvas.height = 720

  const context = canvas.getContext('2d')!
  context.fillStyle = 'aliceblue'
  context.strokeStyle = 'black'
  context.lineWidth = 3
  context.font = '40px Bangers'
  context.textAlign = 'center'

  const game = new Game(canvas)
  let lastTime = 0

  const animate: FrameRequestCallback = (time) => {
    const delta = time - lastTime
    lastTime = time
    game.render(context, delta)
    this.requestAnimationFrame(animate)
  }

  animate(0)
})
