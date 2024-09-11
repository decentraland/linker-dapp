import { NavbarProps } from 'decentraland-ui/dist/components/Navbar/Navbar.types'

export type Props = Partial<NavbarProps> & {
  address?: string
  onSignOut: () => void
}

export type MapStateProps = Pick<
  Props,
  'isSignedIn' | 'isSigningIn' | 'address'
>
export type MapDispatchProps = Pick<Props, 'onSignOut'>
