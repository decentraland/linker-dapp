import './style.css'
import { Atlas, Container, Coord, Layer, Section, Table } from 'decentraland-ui'
import { Props } from './types'

export default function LinkScenePage({
  authorizations,
  parcels,
  baseParcel
}: Props) {
  const find = <T extends Coord>(coords: T[]) => (
    x: number,
    y: number
  ): T | undefined => coords.find(s => s.x === x && s.y === y)

  const selectedFillLayer: Layer = (x: number, y: number) => {
    return find(parcels)(x, y) ? { color: '#ff99', scale: 1.2 } : null
  }

  const selectedStroke: Layer = (x: number, y: number) => {
    return find(parcels)(x, y) ? { color: '#ff0044', scale: 1.4 } : null
  }

  return (
    <Container>
      {!!parcels.length && (
        <Section size="large" className="map-table">
          <Table basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Coordinates</Table.HeaderCell>
                <Table.HeaderCell>Permissions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {parcels.map((coords, index) => {
                const isAuthorized = !!find(authorizations || [])(
                  coords.x,
                  coords.y
                )?.isUpdateAuthorized
                return (
                  <Table.Row key={index}>
                    <Table.Cell>Parcel {index}</Table.Cell>
                    <Table.Cell>
                      {coords.x}, {coords.y}
                    </Table.Cell>
                    <Table.Cell
                      className={!isAuthorized ? 'permission-not-granted' : ''}
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
        </Section>
      )}
      <Container>
        <Section size="large">
          <Atlas
            height={300}
            x={baseParcel.x}
            y={baseParcel.y}
            isDraggable={false}
            layers={[selectedStroke, selectedFillLayer]}
          />
        </Section>
      </Container>
    </Container>
  )
}
