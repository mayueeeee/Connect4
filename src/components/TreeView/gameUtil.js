const BOARD_SYMBOL = {
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

const BOARD_SIZE = {
  x: 7,
  y: 6,
}

const _calculatePoint = ({ board, x, y }) => {
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

      // if (connectedBlock >= 3) directionScore = 100

      return directionScore
    })
    .reduce((a, b) => a + b, 0)

  console.log(`x : ${x} y : ${y} player : ${player} score : ${score}`)

  return score
}

const calculateBoardScore = board => {
  let humanScore = 0
  let aiScore = 0

  for (let y = 0; y < BOARD_SIZE.y; y++) {
    for (let x = 0; x < BOARD_SIZE.x; x++) {
      const player = board[y][x]
      if (player !== BOARD_SYMBOL.FREE) {
        const score = _calculatePoint({ board, x, y })

        if (player === BOARD_SYMBOL.HUMAN) humanScore += score
        if (player === BOARD_SYMBOL.AI) aiScore += score
      }
    }
  }

  return { humanScore, aiScore }
}

const dummyBoard = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0],
  [0, 1, 2, 2, 2, 0, 0],
]

console.log(calculateBoardScore(dummyBoard))
