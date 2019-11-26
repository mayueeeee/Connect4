import clone from 'clone'
import { calculateBoardScore, checkWinner } from './gameUtil'

const BOARD_SIZE = {
  x: 7,
  y: 6,
}

const BOARD_SYMBOL = {
  FREE: 0,
  HUMAN: 1,
  AI: 2,
}

class Stack {
  constructor() {
    this.items = []
  }

  push(element) {
    this.items.push(element)
  }

  pop() {
    if (this.items.length == 0) return 'Underflow'
    return this.items.pop()
  }

  peek() {
    return this.items[this.size() - 1]
  }

  isEmpty() {
    return this.items.length == 0
  }

  size() {
    return this.items.length
  }

  printStack() {
    let str = ''
    for (let i = 0; i < this.items.length; i++) str += this.items[i] + ' '
    return str
  }
}

class Node {
  constructor(value, depth = 0) {
    this.value = value
    this.children = []
    this.parent = null
    this.depth = depth
  }

  setParentNode(node) {
    this.parent = node
  }

  addChild(node) {
    node.setParentNode(this)
    this.children.push(node)
  }

  removeChildren() {
    this.children = []
  }
}

export class Board {
  constructor(
    boardState = new Array(BOARD_SIZE.y)
      .fill(0)
      .map(() => new Array(BOARD_SIZE.x).fill(0)),
    turn = BOARD_SYMBOL.HUMAN
  ) {
    this.boardState = boardState
    this.turn = turn
    this.action = -1
    this.score = calculateBoardScore(this.boardState)
  }

  changeTurn() {
    this.turn =
      this.turn === BOARD_SYMBOL.HUMAN ? BOARD_SYMBOL.AI : BOARD_SYMBOL.HUMAN
  }

  fillCoin(position) {
    if (position < 0 && position > BOARD_SIZE.x - 1) return 'Underflow'

    let row = BOARD_SIZE.y - 1

    if (this.boardState[0][position] !== BOARD_SYMBOL.FREE) {
      return 'Full'
    }

    while (row > 0 && this.boardState[row][position] != BOARD_SYMBOL.FREE) row--

    this.boardState[row][position] = this.turn
    this.score = calculateBoardScore(this.boardState)
    this.action = position
    return clone(this)
  }
}

export class Tree {
  constructor(board = new Board()) {
    this.rootNode = new Node(board)
    this.tempNode = clone(this.rootNode)
    this.maxStack = 0
  }

  clear() {
    this.rootNode = clone(this.tempNode)
    this.maxStack = 0
  }

  depthLimitSearch(limit, withoutHeuristic = false) {
    this.clear()

    const stack = new Stack()

    stack.push(this.rootNode)
    if (stack.size() > this.maxStack) this.maxStack = stack.size()
    let lastestFillCol = 0
    while (!stack.isEmpty()) {
      const depth = stack.peek().depth + 1
      const node = stack.pop()
      const parent = node.parent

      if (parent != null) parent.addChild(node)
      const _board = clone(node.value)
      _board.changeTurn()

      

      for (let x = BOARD_SIZE.x - 1; x >= 0; x--) {
        const newBoard = clone(_board).fillCoin(x)

        if (newBoard === 'Full') {
          continue
        }
        if (x > lastestFillCol) {
          lastestFillCol = x
        }

        const child = new Node(newBoard, depth)
        child.setParentNode(node)
        stack.push(child)
        if (stack.size() > this.maxStack) this.maxStack = stack.size()

        if (withoutHeuristic) {
          const winner = checkWinner(newBoard.boardState)
          if (winner === BOARD_SYMBOL.AI) {
            console.log('found win solution\nstop searching\naction:' + x)
            console.log(newBoard.boardState)
            return x
          }
        }

        // print children
        // console.log(
        //   'depth : ',
        //   stack.peek().depth,
        //   ' value : \n',
        //   stack.peek().value.boardState
        // )
      }
      // console.log('---------------------------------------')

      while (!stack.isEmpty() && stack.peek().depth === limit) {
        node.addChild(stack.pop())
      }
    }
    if (withoutHeuristic) {
      return lastestFillCol
    }
  }

  iterativeDeepeningSearch(limit, withoutHeuristic = false) {
    const storeMaxStack = new Stack()
    for (let l = 1; l <= limit; l++) {
      const stopSearch = this.depthLimitSearch(l, withoutHeuristic)
      storeMaxStack.push(this.maxStack)
      if (stopSearch) return
    }
    return -1
  }

  getNodeScore = node => {
    let currentScore = node.value.score
    currentScore = currentScore.aiScore - currentScore.humanScore

    let bestScore = 0

    for (let i = 0; i < node.children.length; i++) {
      let score = node.children[i].value.score
      score = score.aiScore - score.humanScore

      score += this.getNodeScore(node.children[i])

      if (score > bestScore) {
        bestScore = score
      }
    }

    return bestScore + currentScore
  }

  minimax = () => {
    const possibleNode = this.rootNode.children

    // No posible move
    if (possibleNode.length === 0) {
      return -1
    }

    let bestAction = -1
    let bestScore = Number.NEGATIVE_INFINITY

    for (let i = 0; i < possibleNode.length; i++) {
      const score = this.getNodeScore(possibleNode[i])

      if (score > bestScore) {
        bestScore = score
        bestAction = possibleNode[i].value.action
      }
    }

    return { bestAction, bestScore }
  }

  findAIWinnerAction = () => {
    const possibleNode = this.rootNode.children

    // No posible move
    if (possibleNode.length === 0) {
      return -1
    }

    return {
      bestAction: possibleNode[possibleNode.length - 1].value.action,
      bestScore: 0,
    }
  }

  // greedyBestFirst = () => {
  //   const possibleNode = this.rootNode.children

  //   // No posible move
  //   if (possibleNode.length === 0) {
  //     return -1
  //   }

  //   let bestAction = -1
  //   let bestScore = Number.NEGATIVE_INFINITY

  //   for (let i = 0; i < possibleNode.length; i++) {
  //     if (possibleNode[i].value.score > bestScore) {
  //       bestScore = possibleNode[i].value.score
  //       bestAction = possibleNode[i].value.action
  //     }
  //   }

  //   return { bestAction, bestScore }
  // }
}
