
import LinkerPage from './LinkerPage'

// TODO: implement a router
const Root = (props: any) => {
  if (window.location.pathname === "/identity") {
    return <LinkerPage {...props}></LinkerPage>
  } else {
    return <LinkerPage {...props}></LinkerPage>
  }
}

export default Root
