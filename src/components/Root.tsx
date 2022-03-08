import IdentityPage from './IdentityPage'
import LinkerPage from './LinkerPage'

// TODO: implement a router
const Root = (props: any) => {
  const qs = new URLSearchParams(document.location.search)

  if (qs.has('wearableId')) {
    return <IdentityPage {...props} />
  }

  return <LinkerPage {...props} />
}

export default Root
