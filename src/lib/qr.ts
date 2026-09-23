import { toCanvas } from 'qrcode'

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('logo'))
    image.src = src
  })
}

export async function paintQr(canvas: HTMLCanvasElement, value: string, logoSrc: string) {
  await toCanvas(canvas, value, {
    width: 280,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: { dark: '#7A1218', light: '#F3F0EA' },
  })

  const context = canvas.getContext('2d')
  if (!context) return

  let logo: HTMLImageElement
  try {
    logo = await loadImage(logoSrc)
  } catch {
    return
  }

  const size = canvas.width
  const plate = Math.round(size * 0.28)
  const origin = Math.round((size - plate) / 2)
  context.fillStyle = '#F3F0EA'
  context.fillRect(origin, origin, plate, plate)
  context.strokeStyle = '#BC0000'
  context.lineWidth = 1.5
  context.strokeRect(origin + 0.5, origin + 0.5, plate - 1, plate - 1)

  const pad = plate * 0.12
  const box = plate - pad * 2
  const scale = Math.min(box / logo.width, box / logo.height)
  const width = logo.width * scale
  const height = logo.height * scale
  context.drawImage(logo, origin + (plate - width) / 2, origin + (plate - height) / 2, width, height)
}
