import React from 'react'
import Board from '../components/game/Board/Board'
import { Navbar, NavDropdown } from 'react-bootstrap'

import {
  BOARD_SYMBOL,
  canFill,
  checkWinner,
} from '../components/TreeView/gameUtil'
import { Tree, Board as GameBoard } from '../components/TreeView/stack'

const WINNER_TEXT = ['', 'HUMAN', 'AI']
const HEURICTIC_SEARCH = [
  { label: 'MINIMAX', value: 'minimax' },
  { label: 'GBFS', value: 'greedyBestFirst' },
]
const SEARCH_OPTIONS = [
  { label: 'DLS', value: 'depthLimitSearch' },
  { label: 'ITDS', value: 'iterativeDeepeningSearch' },
]

export default class IndexPage extends React.Component {
  state = {
    gameState: new GameBoard(),
    turn: BOARD_SYMBOL.HUMAN,
    winner: null,
    searchOption: 'depthLimitSearch',
    heuricticOption: 'minimax',
    limit: 4,
    maxStack: 0,
    timeUsed: 0,
  }

  handleChange = (field, value) => {
    const state = this.state
    state[field] = value
    this.setState({ ...state })
  }

  onRowClick = rowNum => {
    if (this.state.winner !== null) return

    if (!canFill(this.state.gameState.boardState, rowNum)) {
      return
    }
    let newGameState = this.state.gameState.fillCoin(rowNum)

    let winner = checkWinner(newGameState.boardState)
    if (winner !== null) {
      this.setState({
        winner,
        gameState: newGameState,
        maxStack: 0,
      })
      return
    }

    const startTime = Date.now()

    const tree = new Tree(newGameState)
    const heuricticSearch = this.state.heuricticOption
    tree[heuricticSearch](this.state.limit)

    tree.iterativeDeepeningSearch(4)

    const { bestAction, bestScore } = tree.minimax()
    console.log(bestAction, bestScore)
    if (bestAction !== -1) {
      newGameState.changeTurn()
      const _newGameState = newGameState.fillCoin(bestAction)
      if (_newGameState !== 'Full') {
        _newGameState.changeTurn()
        newGameState = _newGameState
      }
      winner = checkWinner(newGameState.boardState)
      if (winner !== null) {   
        this.setState({
          winner,
          gameState: newGameState,
          maxStack: tree.maxStack,
          timeUsed: Date.now() - startTime,
        })
        return
      }
    }
    this.setState({
      gameState: newGameState,
      maxStack: tree.maxStack,
      timeUsed: Date.now() - startTime,
    })

    window.tree = tree
  }

  render() {
    const { winner } = this.state

    return (
      <div className="columns">
        <div className="column">
          <div style={{ height: 48 }}>
            <Navbar bg="dark">
              <div style={{ fontSize: '11', color: 'white' }}>Search : </div>
              <NavDropdown title={this.state.searchOption}>
                {SEARCH_OPTIONS.map((option, index) => {
                  return (
                    <NavDropdown.Item
                      key={`search_${index}`}
                      onClick={() =>
                        this.handleChange('searchOption', option.value)
                      }
                    >
                      {option.label}
                    </NavDropdown.Item>
                  )
                })}
              </NavDropdown>
              <div style={{ fontSize: '11', color: 'white' }}>Heurictic : </div>
              <NavDropdown title={this.state.heuricticOption}>
                {HEURICTIC_SEARCH.map((option, index) => {
                  return (
                    <NavDropdown.Item
                      key={`heu_${index}`}
                      onClick={() =>
                        this.handleChange('heuricticOption', option.value)
                      }
                    >
                      {option.label}
                    </NavDropdown.Item>
                  )
                })}
              </NavDropdown>
              <div style={{ fontSize: '11', color: 'white' }}>
                Max Stack : {this.state.maxStack}
              </div>
              <div style={{ fontSize: '11', color: 'white', marginLeft: 5 }}>
                Time Used : {this.state.timeUsed} ms
              </div>
            </Navbar>
          </div>
          <Board
            board={this.state.gameState.boardState}
            onRowClick={this.onRowClick}
          />
          <div style={{ width: '100%', textAlign: 'center' }}>
            {winner !== null && <h1>Winner : {WINNER_TEXT[winner]}</h1>}
          </div>
        </div>
      </div>
    )
  }
}
