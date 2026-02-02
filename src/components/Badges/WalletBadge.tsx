import { Address, Blockie } from 'decentraland-ui'

type WalletBadgeProps = {
  address: string
}

export const WalletBadge = ({ address }: WalletBadgeProps) => (
  <div className="address-header">
    <Blockie scale={3} seed={address}>
      <Address tooltip strong value={address} />
    </Blockie>
  </div>
)
