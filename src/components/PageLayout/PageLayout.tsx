import cx from 'classnames'
import { Footer, Page } from 'decentraland-ui'
import { Navbar } from '../Navbar'

type PageLayoutProps = {
  className: string
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  className,
  children,
}) => (
  <div className={cx('Page-story-container', className)}>
    <Navbar />
    <Page>{children}</Page>
    <Footer />
  </div>
)
