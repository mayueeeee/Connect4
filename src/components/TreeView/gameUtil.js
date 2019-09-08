import clone from 'clone'
import { appendNode, createNode } from './treeUtil'

// Max depth for AI to search
export const MAX_DEPTH = 5

// Max depth for tree visualize
// If more than this browser will go crazy
export const MAX_VISUALIZE_DEPTH = 2

export const BOARD_SIZE = {
  x: 7,
  y: 6
}

export const BOARD_SYMBOL = {
  FREE: 0,
  PLAYER: 1,
  AI: 2,
}

// TODO : Implement
// This function will receive boardState
// Calulate score for both player
// Check if there's winner?
// If not winner = null else follow BOARD_SYMBOL
// return scorePlayer, scoreAI, winner
export const miniMax = (boardState) => {

}

export const fillCoin = ({ boardState, nColumn, symbol }) => {

  let _boardState = clone(boardState)

  for (let y = BOARD_SIZE.y - 1; y >= 0; y--) {

    const boardRow = _boardState[y]
    if (boardRow[nColumn] === BOARD_SYMBOL.FREE) {
      boardRow[nColumn] = symbol
      return _boardState
    }
  }

  return boardState

}

export const _deptLimitSearch = function* ({ boardState, limit, turn, currentDepth = 0 }) {
  if (currentDepth === limit)
    return


  for (let x = 0; x < BOARD_SIZE.x; x++) {
    const newState = fillCoin({ boardState, nColumn: x, symbol: turn })

    yield { boardState: newState, action: x, depth: currentDepth }

    // TODO : Check if newState has a winner? 
    // TODO : Calculate miniMax score here
    // If there's winner return here. 
    // We don't need to continue searching if there's a winner.


    yield* _deptLimitSearch({
      boardState: newState,
      limit,
      turn: turn === BOARD_SYMBOL.PLAYER ? BOARD_SYMBOL.AI : BOARD_SYMBOL.PLAYER,
      currentDepth: currentDepth + 1
    })
  }

}

export const deptLimitSearch = function* ({ root, limit, turn }) {

  const childIndexs = []

  const searchGenerator = _deptLimitSearch({ boardState: root.boardState, turn, limit: limit })

  let next = searchGenerator.next()

  let prevDepth = -1
  let rootAction = 0

  while (!next.done) {

    const { boardState, action, depth } = next.value
    if (depth > prevDepth) {
      childIndexs.push(rootAction)
    } else if (depth < prevDepth) {
      childIndexs.pop()
      rootAction = action
    }
    yield appendNode({ root, node: createNode({ boardState, depth, action }), childIndexs })

    prevDepth = depth

    next = searchGenerator.next()

  }

}

export const delay = (ms) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}