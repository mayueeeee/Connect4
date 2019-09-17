import clone from 'clone'
import { appendNode, createNode } from './treeUtil'

// Max depth for AI to search
export const MAX_DEPTH = 7

// Max depth for tree visualize
export const MAX_VISUALIZE_DEPTH = 3

export const BOARD_SIZE = {
  x: 7,
  y: 6,
}

export const BOARD_SYMBOL = {
  FREE: 0,
  HUMAN: 1,
  AI: 2,
}

const DIRECTION = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
  UPRIGHT: { x: 1, y: -1 },
  UPLEFT: { x: -1, y: -1 },
  DOWNRIGHT: { x: 1, y: 1 },
  DOWNLEFT: { x: -1, y: 1 },
}

const CHECK_DIRECTION = {
  VERTICAL: [DIRECTION.UP, DIRECTION.DOWN],
  HORIZONTAL: [DIRECTION.LEFT, DIRECTION.RIGHT],
  DIAGONAL_LEFT: [DIRECTION.UPLEFT, DIRECTION.DOWNRIGHT],
  DIAGONAL_RIGHT: [DIRECTION.UPRIGHT, DIRECTION.DOWNLEFT],
}

const countConnect = ({ boardState, x, y, direction }) => {
  const player = boardState[y][x]

  const nextX = x + direction.x
  const nextY = y + direction.y

  if (nextX >= BOARD_SIZE.x || nextY >= BOARD_SIZE.y) return 0
  if (nextX < 0 || nextY < 0) return 0

  const nextCellPlayer = boardState[nextY][nextX]

  if (nextCellPlayer === player) {
    const sumDirectionCount = countConnect({
      boardState,
      x: nextX,
      y: nextY,
      direction,
    })
    return sumDirectionCount + 1
  } else {
    return 0
  }
}

// return winner player
// if there're no winner return null
export const checkWinner = boardState => {
  const directions = Object.keys(CHECK_DIRECTION)

  for (let y = 0; y < BOARD_SIZE.y; y++) {
    for (let x = 0; x < BOARD_SIZE.x; x++) {
      if (boardState[y][x] !== BOARD_SYMBOL.FREE) {
        for (let i = 0; i < directions.length; i++) {
          let sumConnectCount = 1

          const directionToCheck = CHECK_DIRECTION[directions[i]]

          sumConnectCount += directionToCheck
            .map(direction => {
              return countConnect({ boardState, x, y, direction })
            })
            .reduce((a, b) => a + b, 0)
          if (sumConnectCount >= 4) return boardState[y][x]
        }
      }
    }
  }
  return null
}

// TODO : Implement
// For now just select most right
export const chooseBestAction = winPath => {
  if(winPath.length === 1){
    return winPath[0]
  }
  return winPath[1]
}

export const fillCoin = ({ boardState, nColumn, symbol }) => {
  let _boardState = clone(boardState)

  for (let y = BOARD_SIZE.y - 1; y >= 0; y--) {
    const boardRow = _boardState[y]
    if (boardRow[nColumn] === BOARD_SYMBOL.FREE) {
      boardRow[nColumn] = symbol
      return { boardState: _boardState, isFilled: true }
    }
  }

  return { boardState: _boardState, isFilled: false }
}

export const deptLimitSearch = function*({
  boardState,
  limit,
  turn,
  currentDepth = 0,
  childIndexs = [0],
}) {
  if (currentDepth === limit) return

  for (let x = 0; x < BOARD_SIZE.x; x++) {
    const newState = fillCoin({ boardState, nColumn: x, symbol: turn })

    if (newState.isFilled) {
      const _childIndexs = clone(childIndexs)

      const winner = checkWinner(newState.boardState)
      yield {
        boardState: newState.boardState,
        action: x,
        depth: currentDepth,
        winner,
        childIndexs: _childIndexs,
      }

      // if there're winner stop searching
      if (winner) {
        return
      }

      _childIndexs.push(x)

      yield* deptLimitSearch({
        boardState: newState.boardState,
        limit,
        turn:
          turn === BOARD_SYMBOL.HUMAN ? BOARD_SYMBOL.AI : BOARD_SYMBOL.HUMAN,
        currentDepth: currentDepth + 1,
        prevAction: x,
        childIndexs: _childIndexs,
      })
    } else {
      yield {
        boardState: boardState,
        action: x,
        depth: currentDepth,
        winner: null,
        childIndexs: childIndexs,
        skip: true,
      }
      continue
    }
  }
}

export const iterativeDeepeningSearch = function*({ boardState, turn }) {
  let newStates = [{ boardState, action: 0, childIndexs: [0] }]

  let currentDepth = 0
  let currentLimit = 1

  while (true) {
    const newInnerState = []

    for (let x = 0; x < newStates.length; x++) {
      let cIndexs = newStates[x].childIndexs
      if (currentDepth === 0) {
        cIndexs = [x]
      }

      const DLS = deptLimitSearch({
        boardState: newStates[x].boardState,
        turn,
        prevAction: newStates[x].action,
        currentDepth: currentDepth,
        limit: currentLimit,
        childIndexs: cIndexs,
      })

      let next = DLS.next()
      while (!next.done) {
        const { value } = next
        newInnerState.push(value)

        if (value.winner) {
          return
        }

        next = DLS.next()
      }
    }

    if (newInnerState.length === 0) {
      return
    }
    newStates = newInnerState

    currentLimit += 1
    currentDepth += 1
    turn = turn === BOARD_SYMBOL.HUMAN ? BOARD_SYMBOL.AI : BOARD_SYMBOL.HUMAN
  }
}

export const searchTree = function*({ root, limit, turn, searchFunction }) {
  const searchGenerator = searchFunction({
    boardState: root.boardState,
    turn,
    limit: limit,
  })

  let next = searchGenerator.next()

  while (!next.done) {
    const { boardState, action, depth, winner, childIndexs } = next.value

    const newTree = appendNode({
      root,
      node: createNode({ boardState, depth, action }),
      childIndexs,
      winner,
    })

    if (winner === BOARD_SYMBOL.AI) {
      newTree.winPath = childIndexs
      return newTree
    }

    yield newTree

    next = searchGenerator.next()
  }
}

export const delay = ms => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}
