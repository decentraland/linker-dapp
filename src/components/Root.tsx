import IdentityPage from './IdentityPage'
import LinkerPage from './LinkerPage'

const Root = (props: any) => {
  const qs = new URLSearchParams(document.location.search)

  // TODO: I think we are not using this.
  if (qs.has('wearableId')) {
    return <IdentityPage {...props} />
  }

  return <LinkerPage {...props} />
}

export default Root
