import './style.css'
import { Atlas, Container, Coord, Layer, Section, Table } from 'decentraland-ui'
import { Props } from './types'
import { getConfig } from '../../config'

export default function LinkScenePage({ authorizations }: Props) {
  const parcels = getConfig('parcels')
  const baseParcel = getConfig('baseParcel')

  const isSelected = (coords: Coord[]) => (x: number, y: number) =>
    coords.some(s => s.x === x && s.y === y)

  const selectedFillLayer: Layer = (x: number, y: number) => {
    return isSelected(parcels)(x, y) ? { color: '#ff99', scale: 1.2 } : null
  }

  const selectedStroke: Layer = (x: number, y: number) => {
    return isSelected(parcels)(x, y) ? { color: '#ff0044', scale: 1.4 } : null
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
                <Table.HeaderCell>Owner</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {parcels.map((coords, index) => (
                <Table.Row key={index}>
                  <Table.Cell>Parcel {index}</Table.Cell>
                  <Table.Cell>
                    {coords.x}, {coords.y}
                  </Table.Cell>
                  <Table.Cell>
                    {authorizations.length
                      ? isSelected(authorizations)(coords.x, coords.y)
                        ? 'Yes'
                        : 'No'
                      : ''}
                  </Table.Cell>
                </Table.Row>
              ))}
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
