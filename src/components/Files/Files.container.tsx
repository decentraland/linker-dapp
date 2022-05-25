import { connect } from 'react-redux'
import { RootState } from '../../types'
import { MapStateProps } from './types'

import FilesPage from './Files'
import { getFiles } from '../../modules/server/selectors'

const mapState = (state: RootState): MapStateProps => {
  return { files: getFiles(state) }
}

export default connect(mapState)(FilesPage)
