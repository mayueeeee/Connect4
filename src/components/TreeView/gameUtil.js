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
  UPLEFT: { x: -1, y: -1 },
  UPRIGHT: { x: 1, y: -1 },
  DOWNLEFT: { x: -1, y: 1 },
  DOWNRIGHT: { x: 1, y: 1 },
}

export const BOARD_SIZE = {
  x: 7,
  y: 6,
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

const _calculateScore = ({ board, x, y }) => {
  const player = board[y][x]

  const score = Object.keys(DIRECTION)
    .map(_direction => {
      const direction = DIRECTION[_direction]

      let _x = x + direction.x
      let _y = y + direction.y
      let directionScore = 0
      let scanedBlock = 0
      let connectedBlock = 0
      let isCountScore = true

      while (_x < BOARD_SIZE.x && _y < BOARD_SIZE.y && _x > -1 && _y > -1) {
        if (board[_y][_x] === player) {
          directionScore++
          connectedBlock++
        } else if (board[_y][_x] === BOARD_SYMBOL.FREE) {
          if (isCountScore) {
            directionScore += 0.5
            isCountScore = false
          }
        } else {
          break
        }

        _x += direction.x
        _y += direction.y
        scanedBlock++
      }

      if (scanedBlock < 3) directionScore = 0

      if (connectedBlock >= 3) directionScore = 100

      return directionScore
    })
    .reduce((a, b) => a + b, 0)

  // console.log(`x : ${x} y : ${y} player : ${player} score : ${score}`)

  return score
}

export const calculateBoardScore = board => {
  let humanScore = 0
  let aiScore = 0

  for (let y = 0; y < BOARD_SIZE.y; y++) {
    for (let x = 0; x < BOARD_SIZE.x; x++) {
      const player = board[y][x]
      if (player !== BOARD_SYMBOL.FREE) {
        const score = _calculateScore({ board, x, y })

        if (player === BOARD_SYMBOL.HUMAN) humanScore += score
        if (player === BOARD_SYMBOL.AI) aiScore += score
      }
    }
  }

  return { humanScore, aiScore }
}

export const canFill = (boardState, col) => {
  return boardState[0][col] === BOARD_SYMBOL.FREE
}
