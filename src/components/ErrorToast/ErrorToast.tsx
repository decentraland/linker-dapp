import { Toast, ToastType } from 'decentraland-ui'

type ErrorToastProps = {
  error: string | null
}

export const ErrorToast = ({ error }: ErrorToastProps) => {
  if (!error) return null

  return (
    <div className="toast-full-width">
      <Toast
        type={ToastType.ERROR}
        title="Operation Failed"
        body={error ?? 'Look at the terminal for more info'}
      />
    </div>
  )
}
