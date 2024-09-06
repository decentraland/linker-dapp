import { config } from '../../config'

export function redirectToAuthDapp() {
  window.location.replace(
    `${config.get('AUTH_URL')}/login?redirectTo=${encodeURIComponent(
      window.location.href
    )}`
  )
}
