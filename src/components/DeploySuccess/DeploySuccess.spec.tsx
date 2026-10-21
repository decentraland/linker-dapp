import '@testing-library/jest-dom'
import { act, render } from '@testing-library/react'
import { Info } from '../../modules/server/reducer'
import { DeployState } from '../../modules/server/types'
import DeploySuccess from './DeploySuccess'
import { Props } from './types'

const genesisCityInfo: Info = {
  rootCID: 'bafkreiexample',
  debug: false,
  baseParcel: { x: 0, y: 0 },
  parcels: [{ x: 0, y: 0 }],
  isPortableExperience: false,
  isWorld: false,
}

describe('when rendering the deployment result for a Genesis City scene', () => {
  let props: Props
  let onFetchCatalyst: jest.Mock

  beforeEach(() => {
    jest.useFakeTimers()
    onFetchCatalyst = jest.fn()
    props = {
      onFetchCatalyst,
      onCancel: jest.fn(),
      catalysts: [],
      info: genesisCityInfo,
      deploySuccess: false,
      apiError: null,
      deployState: null,
      deployOutcomeMessage: null,
    }
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const renderAndWait = () => {
    render(<DeploySuccess {...props} />)
    act(() => {
      jest.advanceTimersByTime(10_000)
    })
  }

  const uploading: DeployState = {
    phase: 'uploading',
    upload: { stage: 'uploading', sentBytes: 1, totalBytes: 10, completedBatches: 1, totalBatches: 2 },
    result: null,
    error: null,
  }

  describe('and the CLI does not report the deployment state', () => {
    beforeEach(() => {
      renderAndWait()
    })

    it('should check the catalysts every 5 seconds', () => {
      expect(onFetchCatalyst).toHaveBeenCalledTimes(2)
    })
  })

  describe('and the deployment is still being uploaded', () => {
    beforeEach(() => {
      props.deployState = uploading
      renderAndWait()
    })

    it('should not check the catalysts, which cannot have it yet', () => {
      expect(onFetchCatalyst).not.toHaveBeenCalled()
    })
  })

  describe('and the deployment succeeded', () => {
    beforeEach(() => {
      props.deployState = { ...uploading, phase: 'deployed', upload: null }
      props.deploySuccess = true
      renderAndWait()
    })

    it('should check the catalysts until every one has it', () => {
      expect(onFetchCatalyst).toHaveBeenCalledTimes(2)
    })
  })

  describe('and the connection to the CLI was lost mid-deployment', () => {
    beforeEach(() => {
      props.deployState = uploading
      props.deployOutcomeMessage = 'Lost connection to the CLI. Check the terminal for the deployment result.'
      renderAndWait()
    })

    it('should check the catalysts, the only way left to see whether it landed', () => {
      expect(onFetchCatalyst).toHaveBeenCalledTimes(2)
    })
  })
})
