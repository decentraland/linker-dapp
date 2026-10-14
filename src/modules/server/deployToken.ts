let deployToken: string | null | undefined

/**
 * Token the CLI adds to the linker URL (`?token=`) to authorize cancelling the
 * deployment. Null when the CLI doesn't provide one (older CLIs).
 */
export function getDeployToken(): string | null {
  if (deployToken === undefined) {
    deployToken =
      new URLSearchParams(window.location.search).get('token') || null
  }
  return deployToken
}

/** Forgets the cached token so it's read again from the URL (tests only). */
export function resetDeployToken(): void {
  deployToken = undefined
}
