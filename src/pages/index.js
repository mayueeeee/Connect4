import React from 'react'
import Board from '../components/game/Board/Board'
import TreeView from '../components/TreeView/TreeView'

import { create2DArray, createRoot } from '../components/TreeView/treeUtil'
import { fillCoin, BOARD_SYMBOL } from '../components/TreeView/gameUtil'

export default class IndexPage extends React.Component {
  state = {
    boardState: create2DArray(),
    turn: BOARD_SYMBOL.HUMAN,
  }

  onRowClick = rowNum => {
    const { boardState, turn } = this.state

    if (turn === BOARD_SYMBOL.HUMAN) {
      const newState = fillCoin({ boardState, nColumn: rowNum, symbol: turn })
      if (newState.isFilled) {
        this.setState({
          boardState: newState.boardState,
          turn: BOARD_SYMBOL.AI,
        })
      }
    }
  }

  handleAIAction = action => {

  }

  componentDidMount() {
    this.tree.runSearch({ boardState: this.state.boardState })
  }

  render() {
    const { boardState } = this.state
    console.log(boardState)

    return (
      <div className="columns">
        <div className="column">
          <Board board={boardState} onRowClick={this.onRowClick} />
        </div>
        <div className="column">
          <div style={{ backgroundColor: '#fafafa' }}>
            <TreeView ref={e => (this.tree = e)} />
          </div>
        </div>
      </div>
    )
  }
}
