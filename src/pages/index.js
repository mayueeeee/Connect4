import React from 'react'
import Board from '../components/game/Board/Board'
import TreeView from '../components/TreeView/TreeView'

import { create2DArray, createRoot } from '../components/TreeView/treeUtil'
import {
  fillCoin,
  BOARD_SYMBOL,
  checkWinner,
} from '../components/TreeView/gameUtil'

const WINNER_TEXT = ['', 'HUMAN', 'AI']

export default class IndexPage extends React.Component {
  state = {
    boardState: create2DArray(),
    turn: BOARD_SYMBOL.HUMAN,
    winner: null,
  }

  onRowClick = rowNum => {
    const { boardState, turn, winner } = this.state
    if (winner !== null) return
    if (turn === BOARD_SYMBOL.HUMAN) {
      const newState = fillCoin({ boardState, nColumn: rowNum, symbol: turn })
      if (newState.isFilled) {
        let winner = checkWinner(newState.boardState)

        this.setState(
          {
            boardState: newState.boardState,
            turn: BOARD_SYMBOL.AI,
            winner,
          },
          async () => {
            if (winner) {
              return
            }
            const newAIState = await this.tree.runSearch({
              boardState: newState.boardState,
            })
            winner = checkWinner(newAIState.boardState)
            console.log(winner)
            this.setState({
              boardState: newAIState.boardState,
              turn: BOARD_SYMBOL.HUMAN,
              winner,
            })
          }
        )
      }
    }
  }

  componentDidMount() {
    ;(async () => {
      const newAIState = await this.tree.runSearch({
        boardState: this.state.boardState,
      })
      this.setState({
        boardState: newAIState.boardState,
        turn: BOARD_SYMBOL.HUMAN,
      })
    })()
  }

  render() {
    const { boardState, winner } = this.state

    return (
      <div className="columns">
        <div className="column">
          <Board board={boardState} onRowClick={this.onRowClick} />
          <div style={{ width: '100%', textAlign: 'center' }}>
            {winner !== null && <h1>Winner : {WINNER_TEXT[winner]}</h1>}
          </div>
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
