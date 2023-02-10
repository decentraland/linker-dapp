import { coordsToString } from './utils'

describe('land utils', () => {
  describe('when using util coordsToString', () => {
    it('should return the string concatenating both coords with a comma', () => {
      expect(coordsToString({ x: 9, y: 12 })).toEqual('9,12')
    })
  })
})
