import React from 'react'
import Board from '../components/game/Board/Board'
import { Navbar, NavDropdown, Row, Col } from 'react-bootstrap'

import {
  BOARD_SYMBOL,
  canFill,
  checkWinner,
} from '../components/TreeView/gameUtil'
import { Tree, Board as GameBoard } from '../components/TreeView/stack'
import StackTable from '../components/StackTable/StackTable'

const WINNER_TEXT = ['', 'HUMAN', 'AI']

const SEARCH_OPTIONS = [
  { label: 'DLS', value: 'depthLimitSearch' },
  { label: 'MINIMAX', value: 'minimax' },
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
    stackTrace: [],
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
    const searchOption = this.state.searchOption

    if (searchOption === 'minimax') {
      tree.depthLimitSearch(4, false)
      tree.minimax()
      var { bestAction, bestScore } = tree.minimax()
      console.log(bestAction, bestScore)
    }

    if (searchOption === 'depthLimitSearch') {
      var bestAction = tree.depthLimitSearch(4, true)
      console.log(bestAction)
    }

    if (bestAction !== -1) {
      newGameState.changeTurn()
      const _newGameState = newGameState.fillCoin(bestAction)
      if (_newGameState !== 'Full') {
        _newGameState.changeTurn()
        newGameState = _newGameState
      }
      winner = checkWinner(newGameState.boardState)
      if (winner !== null) {
        const stackFrame = {
          maxStack: tree.maxStack,
          timeUsed: Date.now() - startTime,
        }
        let stackTrace = this.state.stackTrace
        stackTrace.push(stackFrame)
        this.setState({
          winner,
          gameState: newGameState,
          maxStack: stackFrame.maxStack,
          timeUsed: stackFrame.timeUsed,
          stackTrace: stackTrace,
        })
        return
      }
    }
    const stackFrame = {
      maxStack: tree.maxStack,
      timeUsed: Date.now() - startTime,
    }
    let stackTrace = this.state.stackTrace
    stackTrace.push(stackFrame)
    this.setState({
      gameState: newGameState,
      maxStack: stackFrame.maxStack,
      timeUsed: stackFrame.timeUsed,
      stackTrace: stackTrace,
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
              <div style={{ fontSize: '11', color: 'white' }}>
                Max Stack : {this.state.maxStack}
              </div>
              <div style={{ fontSize: '11', color: 'white', marginLeft: 5 }}>
                Time Used : {this.state.timeUsed} ms
              </div>
            </Navbar>
          </div>
          <Row>
            <Col xs={8}>
              <Board
                board={this.state.gameState.boardState}
                onRowClick={this.onRowClick}
              />
              <div style={{ width: '100%', textAlign: 'center' }}>
                {winner !== null && <h1>Winner : {WINNER_TEXT[winner]}</h1>}
              </div>
            </Col>
            <Col xs={3} className="stack-col">
              <StackTable
                trace={this.state.stackTrace}
                winner={this.state.winner}
              />
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
