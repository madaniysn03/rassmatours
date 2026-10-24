import { useEffect } from 'react'

/** Bloque le défilement de la page tant que `locked` est vrai (menu mobile ouvert). */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [locked])
}
