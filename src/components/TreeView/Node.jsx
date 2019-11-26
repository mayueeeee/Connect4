import React, { Component } from 'react'

export const BOARD_SYMBOL = {
  FREE: 0,
  HUMAN: 1,
  AI: 2,
}

export default class Node extends Component {
  statusToIcon = status => {
    switch (status) {
      case BOARD_SYMBOL.FREE:
        return <i className="far fa-circle blank"></i>
      case BOARD_SYMBOL.AI:
        return <i className="fas fa-desktop red"></i>
      case BOARD_SYMBOL.HUMAN:
        return <i className="fas fa-user green"></i>
      default:
        return <i className="fas fa-times-circle"></i>
    }
  }
  renderTable = boardState => {
    let table = []

    for (let y = 0; y < 6; y++) {
      let children = []
      for (let x = 0; x < 7; x++) {
        children.push(
          <td key={`td_${y}_${x}`}>{this.statusToIcon(boardState[y][x])}</td>
        )
      }
      table.push(<tr key={`tr_${y}`}>{children}</tr>)
    }

    return table
  }

  render() {
    const { nodeData } = this.props
    return (
      <>
        <table className="node-board" style={{ height: 200 }}>
          <tbody>{this.renderTable(nodeData.boardState)}</tbody>
        </table>
        <div
          style={{
            backgroundColor: '#fff',
            textAlign: 'center',
            width: 200,
          }}
        >
          {nodeData.depth === 0
            ? 'ROOT'
            : `Depth : ${nodeData._depth + 1} Action : ${nodeData._action}`}
        </div>
      </>
    )
  }
}
