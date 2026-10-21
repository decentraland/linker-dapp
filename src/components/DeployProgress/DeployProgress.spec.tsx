import '@testing-library/jest-dom'
import { render, RenderResult } from '@testing-library/react'
import { DeployState } from '../../modules/server/types'
import DeployProgress from './DeployProgress'

describe('when rendering the deployment progress', () => {
  let state: DeployState
  let canCancel: boolean
  let isCancelling: boolean
  let cancelError: string | null
  let onCancel: jest.Mock
  let renderedComponent: RenderResult

  beforeEach(() => {
    state = { phase: 'uploading', upload: null, result: null, error: null }
    canCancel = true
    isCancelling = false
    cancelError = null
    onCancel = jest.fn()
  })

  const renderProgress = () =>
    render(
      <DeployProgress
        state={state}
        canCancel={canCancel}
        isCancelling={isCancelling}
        cancelError={cancelError}
        onCancel={onCancel}
      />,
    )

  describe('and the page can cancel the deployment', () => {
    beforeEach(() => {
      renderedComponent = renderProgress()
    })

    it('should render an enabled cancel button', () => {
      expect(
        renderedComponent.getByRole('button', { name: 'Cancel' }),
      ).toBeEnabled()
    })
  })

  describe('and the page has no deploy token', () => {
    beforeEach(() => {
      canCancel = false
      renderedComponent = renderProgress()
    })

    it('should not render the cancel button', () => {
      expect(renderedComponent.queryByRole('button')).toBeNull()
    })
  })

  describe('and the CLI reports that a cancellation was requested', () => {
    beforeEach(() => {
      state = { ...state, cancelRequested: true }
      renderedComponent = renderProgress()
    })

    it('should render a disabled cancelling button', () => {
      expect(
        renderedComponent.getByRole('button', { name: 'Cancelling...' }),
      ).toBeDisabled()
    })
  })

  describe('and the cancel request is in flight', () => {
    beforeEach(() => {
      isCancelling = true
      renderedComponent = renderProgress()
    })

    it('should render a disabled cancelling button', () => {
      expect(
        renderedComponent.getByRole('button', { name: 'Cancelling...' }),
      ).toBeDisabled()
    })
  })

  describe('and the deployment ended', () => {
    beforeEach(() => {
      state = {
        ...state,
        phase: 'cancelled',
        cancelRequested: true,
      }
      renderedComponent = renderProgress()
    })

    it('should render a disabled cancel button', () => {
      expect(
        renderedComponent.getByRole('button', { name: 'Cancel' }),
      ).toBeDisabled()
    })
  })

  describe('and the deployment was cancelled after the world scenes were removed', () => {
    let caveat: string

    beforeEach(() => {
      caveat =
        "The deployment was cancelled after the world's previous scenes were removed. Deploy again to restore the world."
      state = {
        ...state,
        phase: 'cancelled',
        cancelRequested: true,
        error: { code: 'DEPLOY_CANCELLED_AFTER_UNDEPLOY', message: caveat },
      }
      renderedComponent = renderProgress()
    })

    it('should render the caveat so the user knows the world is empty', () => {
      expect(renderedComponent.getByText(caveat)).toBeInTheDocument()
    })
  })

  describe('and cancelling failed', () => {
    beforeEach(() => {
      cancelError =
        "This page can't cancel the deployment; cancel it from the terminal (Ctrl+C)"
      renderedComponent = renderProgress()
    })

    it('should render the cancel error', () => {
      expect(renderedComponent.getByText(cancelError!)).toBeInTheDocument()
    })
  })
})
