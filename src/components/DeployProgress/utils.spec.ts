import { DeployState } from '../../modules/server/types'
import { getDeployProgressView } from './utils'

describe('when getting the deployment progress view', () => {
  let state: DeployState

  describe('and the CLI is removing the previous scenes', () => {
    beforeEach(() => {
      state = { phase: 'undeploying', upload: null, result: null, error: null }
    })

    it('should return an indeterminate progress with the removing label', () => {
      expect(getDeployProgressView(state)).toEqual({
        label: 'Removing previous scenes...',
        percent: undefined,
        bytes: undefined,
        batches: undefined,
      })
    })
  })

  describe('and the CLI is checking which files to upload', () => {
    beforeEach(() => {
      state = {
        phase: 'uploading',
        upload: {
          stage: 'checking',
          sentBytes: 0,
          totalBytes: 0,
          completedBatches: null,
          totalBatches: null,
        },
        result: null,
        error: null,
      }
    })

    it('should return an indeterminate progress with the checking label', () => {
      expect(getDeployProgressView(state)).toEqual({
        label: 'Checking files...',
        percent: undefined,
        bytes: undefined,
        batches: undefined,
      })
    })
  })

  describe('and the CLI is uploading the files in a single request', () => {
    beforeEach(() => {
      state = {
        phase: 'uploading',
        upload: {
          stage: 'uploading',
          sentBytes: 2_500_000,
          totalBytes: 10_000_000,
          completedBatches: null,
          totalBatches: null,
        },
        result: null,
        error: null,
      }
    })

    it('should return the uploaded percentage and sizes without batches', () => {
      expect(getDeployProgressView(state)).toEqual({
        label: 'Uploading...',
        percent: 25,
        bytes: '2.50 MB / 10.00 MB',
        batches: undefined,
      })
    })
  })

  describe('and the CLI is uploading the files in batches', () => {
    beforeEach(() => {
      state = {
        phase: 'uploading',
        upload: {
          stage: 'uploading',
          sentBytes: 7_500_000,
          totalBytes: 10_000_000,
          completedBatches: 2,
          totalBatches: 3,
        },
        result: null,
        error: null,
      }
    })

    it('should return the uploaded percentage, sizes and batches', () => {
      expect(getDeployProgressView(state)).toEqual({
        label: 'Uploading...',
        percent: 75,
        bytes: '7.50 MB / 10.00 MB',
        batches: 'batch 2/3',
      })
    })
  })

  describe('and every byte was sent and the server is publishing', () => {
    beforeEach(() => {
      state = {
        phase: 'uploading',
        upload: {
          stage: 'processing',
          sentBytes: 10_000_000,
          totalBytes: 10_000_000,
          completedBatches: null,
          totalBatches: null,
        },
        result: null,
        error: null,
      }
    })

    it('should return a full progress with the publishing label', () => {
      expect(getDeployProgressView(state)).toEqual({
        label: 'Publishing...',
        percent: 100,
        bytes: '10.00 MB / 10.00 MB',
        batches: undefined,
      })
    })
  })

  describe('and the deployment was cancelled before uploading', () => {
    beforeEach(() => {
      state = { phase: 'cancelled', upload: null, result: null, error: null }
    })

    it('should return an empty progress with the cancelled label', () => {
      expect(getDeployProgressView(state)).toEqual({
        label: 'Deployment cancelled',
        percent: 0,
        bytes: undefined,
        batches: undefined,
      })
    })
  })

  describe('and the deployment ended deployed', () => {
    beforeEach(() => {
      state = {
        phase: 'deployed',
        upload: null,
        result: { entityId: 'bafy' },
        error: null,
      }
    })

    it('should return a full progress with the deployed label', () => {
      expect(getDeployProgressView(state)).toEqual({
        label: 'Deployed',
        percent: 100,
        bytes: undefined,
        batches: undefined,
      })
    })
  })
})
