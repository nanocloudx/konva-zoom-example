import Konva from 'konva'

type Size = {
  width: number
  height: number
}
type Position = {
  x: number
  y: number
}

let _container: HTMLDivElement
let _stage: Konva.Stage
let _layer: Konva.Layer
let _image: Konva.Image

export async function render(container: HTMLDivElement, imageUrl: string) {
  // loading image
  const img = await loadImage(imageUrl)

  // initialize konva
  _container = container
  _stage = new Konva.Stage({
    container,
    width: container.clientWidth,
    height: container.clientHeight
  })
  _layer = new Konva.Layer()
  _image = new Konva.Image({
    image: img
  })
  _layer.add(_image)
  _stage.add(_layer)

  // ready
  window.addEventListener('resize', refresh)
  _stage.on('wheel', onWheel)
  refresh()
}

function refresh() {
  // set stage size
  _stage.width(_container.clientWidth)
  _stage.height(_container.clientHeight)

  // set contain scale
  const containScale = getContainScale(
    _layer.getSize(),
    _image.getSize()
  )
  _layer.scale({x: containScale, y: containScale})

  // set center position
  const centerPosition = getCenterPosition(
    _layer.getSize(),
    _image.getSize(),
    containScale
  )
  _layer.position(centerPosition)

  // render
  _stage.batchDraw()
}

function onWheel(e: any) {
  // stop event bubble
  e.evt.preventDefault()

  // calc scale ratio
  const isZoom = e.evt.deltaY > 0
  const scaleRatio = getScaleRatio(isZoom)

  // set scale
  const currentScale = _layer.scaleX()
  const containScale = getContainScale(
    _layer.getSize(),
    _image.getSize()
  )
  const nextScale = currentScale * scaleRatio
  _layer.scale({ x: nextScale, y: nextScale })

  // set position
  const pointerPosition = _stage.getPointerPosition()!
  const diffPosition = {
    x: (pointerPosition.x - _layer.x()) * scaleRatio,
    y: (pointerPosition.y - _layer.y()) * scaleRatio
  }
  const nextPosition = {
    x: pointerPosition.x - diffPosition.x, // 拡縮でズレた位置を相殺している
    y: pointerPosition.y - diffPosition.y,
  }
  _layer.position(nextPosition)

  // if minimum scale, reset default scale
  if (containScale >= nextScale) {
    refresh()
    return
  }

  // render
  _stage.batchDraw()
}

async function loadImage(imageUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = imageUrl
  })
}

function getScaleRatio(isZoom: boolean) {
  const scaleBy = 1.2
  return isZoom ? scaleBy : 1 / scaleBy
}

function getContainScale(base: Size, image: Size): number {
  const scaleW = base.width / image.width
  const scaleH = base.height / image.height
  return Math.min(scaleW, scaleH)
}

function getCenterPosition(base: Size, image: Size, imageScale: number): Position {
  const imgWidth = image.width * imageScale
  const imgHeight = image.height * imageScale

  const diffWidth = base.width - imgWidth
  const diffHeight = base.height - imgHeight
  const hasHorizontalMargins = diffHeight < diffWidth

  if (hasHorizontalMargins) {
    return {x: (base.width - imgWidth) / 2, y: 0}
  } else {
    return {x: 0, y: (base.height - imgHeight) / 2}
  }
}
