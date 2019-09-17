import React, { Component } from 'react'

export default class Node extends Component {
  renderTable = boardState => {
    let table = []

    for (let y = 0; y < 6; y++) {
      let children = []
      for (let x = 0; x < 7; x++) {
        children.push(<td key={`td_${y}_${x}`}>{boardState[y][x]}</td>)
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
