const STORAGE_KEY = 'dcl-linker-deploy-token'

let deployToken: string | null | undefined

function readStoredToken(): string | null {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function storeToken(token: string): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, token)
  } catch {
    // Without storage the token only lasts until the page reloads
  }
}

/**
 * Token the CLI adds to the linker URL (`?token=`) to authorize cancelling the
 * deployment. Null when the CLI doesn't provide one (older CLIs).
 *
 * It's moved to session storage and removed from the URL, so it never reaches
 * pages the URL is sent to (e.g. the auth dapp's `redirectTo`) and survives the
 * sign-in redirect back to this page.
 */
export function getDeployToken(): string | null {
  if (deployToken === undefined) {
    const url = new URL(window.location.href)
    const fromUrl = url.searchParams.get('token')
    if (fromUrl) {
      storeToken(fromUrl)
      url.searchParams.delete('token')
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
    }
    deployToken = fromUrl || readStoredToken()
  }
  return deployToken
}

/** Forgets the cached token, and the stored one unless `keepStored` (tests only). */
export function resetDeployToken(options: { keepStored?: boolean } = {}): void {
  deployToken = undefined
  if (!options.keepStored) {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // Nothing stored
    }
  }
}
