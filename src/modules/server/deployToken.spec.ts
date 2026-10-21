import { getDeployToken, resetDeployToken } from './deployToken'

describe('when getting the deploy token', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/')
    resetDeployToken()
  })

  describe('and the page URL has the token in the fragment', () => {
    beforeEach(() => {
      window.history.replaceState(null, '', '/?other=value#token=a-deploy-token&view=progress')
    })

    it('should return the token', () => {
      expect(getDeployToken()).toBe('a-deploy-token')
    })

    describe('and the token was read', () => {
      beforeEach(() => {
        getDeployToken()
      })

      it('should remove it from the URL so it is not sent anywhere else, keeping the rest', () => {
        expect({ search: window.location.search, hash: window.location.hash }).toEqual({
          search: '?other=value',
          hash: '#view=progress'
        })
      })

      describe('and the page reloads without it, as after the sign-in redirect', () => {
        beforeEach(() => {
          resetDeployToken({ keepStored: true })
        })

        it('should still return the token', () => {
          expect(getDeployToken()).toBe('a-deploy-token')
        })
      })
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

  describe('and the page URL has a token only in the query string', () => {
    beforeEach(() => {
      window.history.replaceState(null, '', '/?token=a-deploy-token&other=value')
    })

    it('should ignore it, as the CLI only passes it in the fragment', () => {
      expect(getDeployToken()).toBeNull()
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
