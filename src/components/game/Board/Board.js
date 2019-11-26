import React from 'react'
import Row from './Row'

export default class Board extends React.Component {
  onRowClick = rowNum => {
    this.props.onRowClick(rowNum)
  }

  render() {
    const { board } = this.props
    const yay = board[0].map((col, i) => board.map(row => row[i]))

    return (
      <div className="game-board">
        <div className="columns is-centered">
          {yay.map((row, i) => (
            <Row key={i} data={row} onClick={e => this.onRowClick(i)} />
          ))}
        </div>
      </div>
    )
  }
}
