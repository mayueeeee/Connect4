import React from 'react'
import lastIndexOf from 'lodash/lastIndexOf'
import Row from './Row'

export default class Board extends React.Component {

  onRowClick = rowNum => {
    this.props.onRowClick(rowNum)
  }

  render() {
    const { board } = this.props

    return (
      <div className="game-board">
        <div className="columns is-centered">
          {board.map((row, i) => (
            <Row key={i} data={row} onClick={e => this.onRowClick(i)} />
          ))}
        </div>
      </div>
    )
  }
}
