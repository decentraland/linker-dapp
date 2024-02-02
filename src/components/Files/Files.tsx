import './style.css'
import { Container, Dropdown, Table } from 'decentraland-ui'
import { Props } from './types'
import { useMemo, useState } from 'react'
import { FileSize } from '../../modules/server/reducer'

enum Filter {
  Size = 'Size',
  Name = 'Name'
}

export default function FilesPage({ files }: Props) {
  const [filter, setFilter] = useState<Filter>(Filter.Size)

  const totalFileSize = useMemo(
    () => files.reduce((acc, file) => acc + Number(file.size), 0),
    [files]
  )

  const value = useMemo<FileSize[]>(
    () =>
      files.sort((a, b) => {
        if (filter === Filter.Size) {
          return b.size < a.size ? -1 : 1
        }
        return a.name < b.name ? -1 : 1
      }),
    [files, filter]
  )

  return (
    <Container className="FilesPage">
      <div className="total-file-size">
        <span>Total Size</span>
        <b>{bytesToMB(totalFileSize)} MB</b>
      </div>
      <Table basic="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>File Name</Table.HeaderCell>
            <Table.HeaderCell>Size</Table.HeaderCell>
            <Table.HeaderCell>
              <Dropdown text={filter} direction="right">
                <Dropdown.Menu>
                  {Object.values(Filter).map(f => (
                    <Dropdown.Item key={f} onClick={() => setFilter(f)} text={f} />
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {value.map(({ name, size }, index) => (
            <Table.Row key={index}>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>{bytesToMB(size)} MB </Table.Cell>
              <Table.Cell />
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  )
}

function bytesToMB(size: string | number) {
  return (Number(size) * 1e-6).toFixed(2)
}
