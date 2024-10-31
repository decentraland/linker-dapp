import * as React from 'react'
import classNames from 'classnames'
import { Icon } from 'decentraland-ui'

import { Props } from './DeployWarning.types'

import './styles.css'

const DeployWarning = ({ variant }: Props) => {
  return (
    <div className={classNames("DeployWarning", variant)}>
      <h3><Icon name="warning sign" />PLEASE KEEP IN MIND:</h3>
      <ul>
        <li>After deployment, your scene will undergo processing before becoming available.</li>
        <li>This process may take 15 minutes on average.</li>
        <li>During this time, your scene will appear empty until it has been updated on the client.</li>
      </ul>
    </div>
  );
}

DeployWarning.defaultProps = {
  variant: 'filled',
};

export default React.memo(DeployWarning)
