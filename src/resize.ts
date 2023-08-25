export default (canvas: HTMLCanvasElement) => {
  const { innerWidth: windowWidth, innerHeight: windowHeight } = window
  const { width: canvasWidth, height: canvasHeight } = canvas
  const windowRatio = windowWidth / windowHeight
  const canvasRatio = canvasWidth / canvasHeight
  const isFullWidth = windowRatio < canvasRatio
  const margin = 150
  canvas.style.width = `${isFullWidth ? windowWidth - margin : windowHeight * canvasRatio - margin}px`
  canvas.style.height = `${isFullWidth ? windowWidth / canvasRatio - margin : windowHeight - margin}px`
}
