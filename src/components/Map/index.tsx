import React, { useCallback, useMemo, useState } from 'react'
import {
  Atlas,
  Container,
  Coord,
  Layer,
  Pagination,
  Section,
  Table,
} from 'decentraland-ui'
import { Authorization } from '../../modules/authorization/types'
import { Props } from './types'
import './style.css'

const formatCoord = (coord: Coord) => `${coord.x},${coord.y}`

const ITEMS_PER_PAGE = 1000

function LinkScenePage({
  authorizations,
  parcels,
  baseParcel,
  showAtlas = false,
}: Props) {
  const [page, setPage] = useState(1)

  const parcelsSet = useMemo(() => new Set(parcels.map(formatCoord)), [parcels])
  const authorizationsMap = useMemo(
    () => new Map(authorizations.map((auth) => [formatCoord(auth), auth])),
    [authorizations],
  )

  const totalPages = Math.max(1, Math.ceil(parcels.length / ITEMS_PER_PAGE))

  const pageParcels = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return parcels
      .slice(start, start + ITEMS_PER_PAGE)
      .map((coords, index) => ({ coords, index: start + index + 1 }))
  }, [parcels, page])

  const findAuthorization = useCallback(
    (x: number, y: number): Authorization | undefined => {
      return authorizationsMap.get(formatCoord({ x, y }))
    },
    [authorizationsMap],
  )

  const hasParcel = useCallback(
    (x: number, y: number): boolean => parcelsSet.has(formatCoord({ x, y })),
    [parcelsSet],
  )

  const selectedFillLayer: Layer = useCallback(
    (x: number, y: number) => {
      return hasParcel(x, y) ? { color: '#ff99', scale: 1.2 } : null
    },
    [hasParcel],
  )

  const selectedStroke: Layer = useCallback(
    (x: number, y: number) => {
      return hasParcel(x, y) ? { color: '#ff0044', scale: 1.4 } : null
    },
    [hasParcel],
  )

  return (
    <Container>
      {!!parcels.length && (
        <Section size="large">
          <div className="map-table">
            <Table basic="very">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Coordinates</Table.HeaderCell>
                  <Table.HeaderCell>Permissions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {pageParcels.map(({ coords, index }) => {
                  const isAuthorized = !!findAuthorization(coords.x, coords.y)
                    ?.isUpdateAuthorized
                  return (
                    <Table.Row key={index}>
                      <Table.Cell>Parcel {index}</Table.Cell>
                      <Table.Cell>
                        {coords.x}, {coords.y}
                      </Table.Cell>
                      <Table.Cell
                        className={
                          !isAuthorized ? 'permission-not-granted' : ''
                        }
                      >
                        {authorizations.length
                          ? isAuthorized
                            ? 'Granted'
                            : 'Not granted'
                          : ''}
                      </Table.Cell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="map-table-pagination">
              <Pagination
                activePage={page}
                totalPages={totalPages}
                onPageChange={(_, data) => setPage(Number(data.activePage))}
                firstItem={null}
                lastItem={null}
              />
            </div>
          )}
        </Section>
      )}
      {showAtlas && (
        <Container>
          <Section size="large" className="map-canvas">
            <Atlas
              height={300}
              x={baseParcel.x}
              y={baseParcel.y}
              isDraggable={false}
              layers={[selectedStroke, selectedFillLayer]}
            />
          </Section>
        </Container>
      )}
    </Container>
  )
}

export default React.memo(LinkScenePage)
