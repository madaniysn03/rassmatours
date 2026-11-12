/**
 * Adresse de l'API (backend-api). VITE_API_URL = https://api.rassmatours.com en production (API sur son propre domaine) ;
 * vide = même origine que le site (développement avec le proxy Vite, ou API servie derrière le même domaine).
 */
export const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').trim().replace(/\/$/, '')

/** URL complète d'un chemin de l'API (« /api/... ») ; les autres adresses sont renvoyées telles quelles. */
export const apiUrl = (path: string) => (path.startsWith('/api/') ? `${API_BASE}${path}` : path)
