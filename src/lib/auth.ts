const PREVIEW_AUTH_STORAGE_KEY = 'atelier-preview-authenticated'

export function markPreviewAuthenticated() {
  window.sessionStorage.setItem(PREVIEW_AUTH_STORAGE_KEY, 'true')
}

export function clearPreviewAuthenticated() {
  window.sessionStorage.removeItem(PREVIEW_AUTH_STORAGE_KEY)
}

export function hasPreviewAuthentication() {
  return window.sessionStorage.getItem(PREVIEW_AUTH_STORAGE_KEY) === 'true'
}
