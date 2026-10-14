import { getDeployToken, resetDeployToken } from './deployToken'

describe('when getting the deploy token', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/')
    resetDeployToken()
  })

  describe('and the page URL has a token', () => {
    beforeEach(() => {
      window.history.replaceState(null, '', '/?token=a-deploy-token')
    })

    it('should return the token', () => {
      expect(getDeployToken()).toBe('a-deploy-token')
    })

    describe('and the URL changes after the token was read', () => {
      beforeEach(() => {
        getDeployToken()
        window.history.replaceState(null, '', '/')
      })

      it('should keep returning the token', () => {
        expect(getDeployToken()).toBe('a-deploy-token')
      })
    })
  })

  describe('and the page URL has no token', () => {
    beforeEach(() => {
      window.history.replaceState(null, '', '/?other=value')
    })

    it('should return null', () => {
      expect(getDeployToken()).toBeNull()
    })
  })
})
