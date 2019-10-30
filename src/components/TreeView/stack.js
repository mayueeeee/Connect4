const clone = require('clone')
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

class Board {
  constructor(
    boardState = new Array(BOARD_SIZE.y)
      .fill(0)
      .map(() => new Array(BOARD_SIZE.x).fill(0)),
    turn = BOARD_SYMBOL.FREE,
    score = 0
  ) {
    this.boardState = boardState
    this.turn = turn
    this.score = score
  }
  changeTurn() {
    this.turn =
      this.turn === BOARD_SYMBOL.FREE
        ? BOARD_SYMBOL.HUMAN
        : this.turn === BOARD_SYMBOL.HUMAN
        ? BOARD_SYMBOL.AI
        : BOARD_SYMBOL.HUMAN
  }
  fillCoin(position) {
    if (position < 0 && position > BOARD_SIZE.x - 1) return 'Underflow'

    let row = BOARD_SIZE.y - 1

    while (row > 0 && this.boardState[row][position] != BOARD_SYMBOL.FREE) row--

    this.boardState[row][position] = this.turn

    return clone(this)
  }
}

class Tree {
  constructor(board = new Board(), rootNode = new Node(board)) {
    this.tempNode = clone(rootNode)
    this.rootNode = rootNode
    this.maxStack = 0
  }
  clear() {
    this.rootNode = clone(this.tempNode)
    this.maxStack = 0
  }
  depthLimitSearch(limit) {
    this.clear()

    const stack = new Stack()
    let count = 0

    stack.push(this.rootNode)
    if (stack.size() > this.maxStack) this.maxStack = stack.size()

    while (!stack.isEmpty()) {
      const depth = stack.peek().depth + 1
      const node = stack.pop()
      const parent = node.parent
      if (parent != null) parent.addChild(node)
      const _board = clone(node.value)
      _board.changeTurn()

      for (let x = BOARD_SIZE.x - 1; x >= 0; x--) {
        const child = new Node(clone(_board).fillCoin(x), depth)
        child.setParentNode(node)
        stack.push(child)
        if (stack.size() > this.maxStack) this.maxStack = stack.size()

        count++
        // // print children
        // console.log(
        //   'depth : ',
        //   stack.peek().depth,
        //   ' value : ',
        //   stack.peek().value.boardState
        // )
      }
      // console.log('---------------------------------------')

      while (!stack.isEmpty() && stack.peek().depth === limit) {
        node.addChild(stack.pop())
      }

      // Total number of nodes But not including the root node
      console.log('count', count)
    }
    // // print children
    // const r = rootNode.children[0].children[0]
    // for (let c = 0; c < r.children.length; c++) {
    //   console.log('c : ', c, 'child', r.children[c].value.boardState)
    // }
  }

  iterativeDeepeningSearch(limit) {
    const storeMaxStack = new Stack()
    for (let l = 1; l <= limit; l++) {
      this.depthLimitSearch(l)
      storeMaxStack.push(this.maxStack)
    }
    console.log('storeMaxStack', storeMaxStack)
  }
}

const t = new Tree()
t.iterativeDeepeningSearch((limit = 5))
// console.log('max', t.maxStack)
console.log('max', t.rootNode)
