import { gsap } from '../../lib/gsap'
import {
  BUILD_DURATION,
  DETAIL_DURATION,
  EXIT_DURATION,
  FOUNDATION_DURATION,
  STAGE,
  STRUCTURE_DURATION,
} from './loaderData'

export function preparePathForDrawing(root: ParentNode) {
  const nodes = root.querySelectorAll<SVGGeometryElement>('[data-draw]')
  nodes.forEach((node) => {
    if (typeof node.getTotalLength !== 'function') return
    let length = 0
    try {
      length = node.getTotalLength()
    } catch {
      return
    }
    if (!length) return
    node.style.strokeDasharray = `${length}`
    node.style.strokeDashoffset = `${length}`
  })
}

export function prepareConstruction(root: ParentNode) {
  preparePathForDrawing(root)
  gsap.set(root.querySelectorAll('[data-build]'), { opacity: 0 })
  gsap.set(root.querySelectorAll('[data-rise]'), { clipPath: 'inset(100% 0% 0% 0%)' })
  gsap.set(root.querySelectorAll('[data-wipe]'), { clipPath: 'inset(0% 100% 0% 0%)' })
  gsap.set(root.querySelectorAll('[data-wipe-right]'), { clipPath: 'inset(0% 0% 0% 100%)' })
  gsap.set(root.querySelectorAll('[data-drop]'), { clipPath: 'inset(0% 0% 100% 0%)' })
}

function list(root: ParentNode, selector: string) {
  return root.querySelectorAll(selector)
}

function draw(tl: gsap.core.Timeline, root: ParentNode, selector: string, duration: number, position: string | number, stagger = 0) {
  const nodes = [...list(root, selector)].filter((node) => {
    const element = node as SVGGeometryElement
    return Boolean(element.style?.strokeDasharray)
  })
  if (!nodes.length) return
  tl.to(nodes, { strokeDashoffset: 0, duration, ease: 'power2.inOut', stagger }, position)
}

function reveal(tl: gsap.core.Timeline, root: ParentNode, selector: string, duration: number, position: string | number, stagger = 0) {
  const nodes = list(root, selector)
  if (!nodes.length) return
  tl.to(
    nodes,
    { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration, ease: 'power2.out', stagger },
    position,
  )
}

function fade(tl: gsap.core.Timeline, root: ParentNode, selector: string, duration: number, position: string | number, stagger = 0) {
  const nodes = list(root, selector)
  if (!nodes.length) return
  tl.to(nodes, { opacity: 1, duration, ease: 'power1.out', stagger }, position)
}

export function createConstructionTimeline(
  root: ParentNode,
  options: { compact: boolean; onStage: (label: string) => void },
) {
  const { compact, onStage } = options
  const tl = gsap.timeline({ paused: true })
  const stage = (label: string, position: string | number) => {
    tl.call(() => onStage(label), undefined, position)
  }

  tl.fromTo('[data-loader="grid"]', { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power1.out' }, 0)
  tl.fromTo(
    '[data-loader="intro"]',
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
    0.08,
  )

  stage(STAGE.site, 0.32)
  draw(tl, root, '[data-part="ground"]', 0.4, 0.36)
  draw(tl, root, '[data-part="site-tick"]', 0.3, 0.5, 0.02)
  fade(tl, root, '[data-part="site-label"]', 0.3, 0.55)

  draw(tl, root, '[data-part="guide"]', 0.35, 0.66)
  stage(STAGE.foundation, 0.78)
  draw(tl, root, '[data-part="foundation-line"]', FOUNDATION_DURATION, 0.8, 0.04)
  reveal(tl, root, '[data-part="foundation"]', FOUNDATION_DURATION, 0.98)
  fade(tl, root, '[data-part="ground-shadow"]', 0.35, 1.05)

  stage(STAGE.structure, 1.22)
  reveal(tl, root, '[data-part="column"]', STRUCTURE_DURATION, 1.22, 0.06)
  reveal(tl, root, '[data-part="slab"]', 0.4, 1.58)
  reveal(tl, root, '[data-part="column-upper"]', STRUCTURE_DURATION * 0.9, 1.68, 0.05)
  reveal(tl, root, '[data-part="slab-upper"]', 0.36, 1.88)

  stage(STAGE.design, 2.02)
  reveal(tl, root, '[data-part="wall-left"]', 0.32, 2.02)
  reveal(tl, root, '[data-part="wall-main"]', 0.34, 2.14)
  reveal(tl, root, '[data-part="wall-right"]', 0.32, 2.26)
  reveal(tl, root, '[data-part="wall-front"]', 0.34, 2.36)
  const guides = list(root, '[data-part="guide"]')
  if (guides.length) tl.to(guides, { opacity: 0, duration: 0.35 }, 2.2)

  draw(tl, root, '[data-part="window"] [data-draw]', 0.32, 2.48, 0.03)
  fade(tl, root, '[data-part="glass"]', 0.28, 2.68, 0.03)
  draw(tl, root, '[data-part="door"] [data-draw]', 0.28, 2.78, 0.04)
  fade(tl, root, '[data-part="door-fill"]', 0.25, 2.92)

  draw(tl, root, '[data-part="roof-line"]', 0.38, 3.02)
  reveal(tl, root, '[data-part="roof"]', 0.36, 3.18)
  draw(tl, root, '[data-part="roof-edge"]', 0.28, 3.38)

  reveal(tl, root, '[data-part="balcony"]', DETAIL_DURATION, 3.52)
  draw(tl, root, '[data-part="balcony-rail"]', DETAIL_DURATION, 3.56, 0.03)
  draw(tl, root, '[data-part="stairs"]', 0.28, 3.62, 0.05)
  fade(tl, root, '[data-part="boundary"]', DETAIL_DURATION, 3.68, 0.04)
  draw(tl, root, '[data-part="gate"]', 0.28, 3.74)
  reveal(tl, root, '[data-part="drive"]', 0.32, 3.78)
  fade(tl, root, '[data-part="fixture"]', 0.25, 3.86, 0.05)

  stage(STAGE.finish, 3.9)
  reveal(tl, root, '[data-part="grass"]', 0.32, 3.92)
  reveal(tl, root, '[data-part="plant"]', 0.35, 4.02, 0.05)
  reveal(tl, root, '[data-part="tree"]', 0.5, 4.08, 0.08)

  tl.to('[data-loader="grid"]', { opacity: 0.4, duration: 0.5 }, 4.28)
  tl.to('[data-loader="evening"]', { opacity: 1, duration: 0.55, ease: 'power1.out' }, 4.28)
  tl.to('[data-part="glow"]', { opacity: 0.74, duration: 0.55, ease: 'power1.out' }, 4.34)
  tl.to('[data-loader="intro"]', { opacity: 0, y: -8, duration: 0.3 }, 4.22)
  tl.to('[data-loader="phase"]', { opacity: 0, duration: 0.25 }, 4.28)

  stage(STAGE.finale, 4.55)
  tl.fromTo(
    '[data-loader="finale"]',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
    4.58,
  )
  tl.fromTo('[data-loader="finale-rule"]', { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: 'power2.out' }, 4.7)

  const ending = tl.duration()
  if (ending < BUILD_DURATION) {
    tl.to('[data-loader="scene"]', { duration: BUILD_DURATION - ending }, ending)
  }

  if (compact) tl.timeScale(BUILD_DURATION / 3.5)

  return tl
}

export function playLoaderExit(root: HTMLElement, done: () => void, fast = false) {
  const navLogo = document.querySelector<HTMLElement>('[aria-label="J Homes, home"]')
  const mark = root.querySelector<HTMLElement>('[data-loader="logo"]')
  const scene = root.querySelector('[data-loader="scene"]')
  const copy = root.querySelectorAll('[data-loader="finale-copy"]')
  const duration = fast ? 0.42 : EXIT_DURATION
  const grid = root.querySelector('[data-loader="grid"]')
  const evening = root.querySelector('[data-loader="evening"]')
  const skip = root.querySelector('button')

  if (navLogo) gsap.set(navLogo, { autoAlpha: 0 })

  const tl = gsap.timeline({
    onComplete: () => {
      root.classList.add('is-gone')
      if (navLogo) gsap.set(navLogo, { clearProps: 'opacity,visibility' })
      done()
    },
  })

  tl.to(scene, { scale: 0.96, y: -20, opacity: 0, duration: duration * 0.55, ease: 'power2.inOut', transformOrigin: '50% 42%' }, 0)
  tl.to(copy, { opacity: 0, y: -6, duration: duration * 0.35 }, 0)
  if (grid) tl.to(grid, { opacity: 0, duration: duration * 0.4 }, 0)
  if (evening) tl.to(evening, { opacity: 0, duration: duration * 0.35 }, 0)
  if (skip) tl.to(skip, { opacity: 0, duration: 0.2 }, 0)

  if (mark && navLogo) {
    const from = mark.getBoundingClientRect()
    const to = navLogo.getBoundingClientRect()
    const dx = to.left + to.width / 2 - (from.left + from.width / 2)
    const dy = to.top + to.height / 2 - (from.top + from.height / 2)
    const scale = Math.min(1, to.height / Math.max(from.height, 1))
    tl.to(mark, { x: dx, y: dy, scale, duration, ease: 'power3.inOut', transformOrigin: '50% 50%' }, 0)
  } else if (mark) {
    tl.to(mark, { opacity: 0, y: -16, duration: duration * 0.5 }, 0)
  }

  tl.to(root, { clipPath: 'inset(0% 0% 100% 0%)', duration: duration * 0.72, ease: 'power3.inOut' }, duration * 0.48)

  return tl
}
