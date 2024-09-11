import React, { useCallback } from 'react'
import { Button, Container, Logo } from 'decentraland-ui'
import { redirectToAuthDapp } from '../../modules/wallet/utils'
import { Props } from './Navbar.types'

import './styles.css'

export const Navbar: React.FC<Props> = React.memo((props) => {
  const handleSignIn = useCallback(() => {
    redirectToAuthDapp()
  }, [])

  const handleSignOut = useCallback(() => {
    props.onSignOut()
  }, [props.onSignOut])

  return (
    <Container className="dui-navbar-container">
      <a className="dui-navbar-logo" href="https://decentraland.org">
        <Logo />
      </a>
      <div className="dui-navbar-actions">
        <Button
          inverted
          disabled={props.isSigningIn}
          loading={props.isSigningIn}
          onClick={props.isSignedIn ? handleSignOut : handleSignIn}
        >
          {props.isSignedIn ? 'Sign out' : 'Sign in'}
        </Button>
      </div>
    </Container>
  )
})
