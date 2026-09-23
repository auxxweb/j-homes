import { useState } from 'react'

export function useWebGL() {
  const [supported] = useState(() => {
    if (typeof document === 'undefined') return false
    try {
      const canvas = document.createElement('canvas')
      return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
    } catch {
      return false
    }
  })
  return supported
}
