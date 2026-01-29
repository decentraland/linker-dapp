import { useEffect, useState } from 'react'
import IdentityPage from './IdentityPage'
import LinkerPage from './LinkerPage'
import ServerLogsPage from './ServerLogsPage'
import StoragePage from './StoragePage'
import { StorageAction } from '../modules/server/types'

type PageType = 'linker' | 'identity' | 'storage' | 'serverlogs'

const STORAGE_ACTIONS: StorageAction[] = ['get', 'set', 'delete', 'clear']

const Root = (props: any) => {
  const [pageType, setPageType] = useState<PageType | null>(null)
  const qs = new URLSearchParams(document.location.search)

  useEffect(() => {
    // Fetch info to determine page type
    const determinePageType = async () => {
      // Check query params first for legacy support
      if (qs.has('wearableId')) {
        setPageType('identity')
        return
      }

      // Fetch info to check the page type
      try {
        const response = await fetch('/api/info')
        const info = await response.json()

        if (STORAGE_ACTIONS.includes(info.action)) {
          setPageType('storage')
        } else if (info.action === 'view-logs') {
          setPageType('serverlogs')
        } else {
          setPageType('linker')
        }
      } catch {
        // Default to linker page on error
        setPageType('linker')
      }
    }

    determinePageType()
  }, [])

  // Show loading while determining page type
  if (pageType === null) {
    return null
  }

  if (pageType === 'identity') {
    return <IdentityPage {...props} />
  }

  if (pageType === 'storage') {
    return <StoragePage {...props} />
  }

  if (pageType === 'serverlogs') {
    return <ServerLogsPage {...props} />
  }

  return <LinkerPage {...props} />
}

export default Root
