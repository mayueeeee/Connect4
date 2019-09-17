import uuid from 'uuidv4'
import clone from 'clone'
import { BOARD_SYMBOL, BOARD_SIZE } from './gameUtil'

export const create2DArray = (fill = BOARD_SYMBOL.FREE) => {
  const arr = new Array(BOARD_SIZE.y)

  for (let y = 0; y < BOARD_SIZE.y; y++) {
    arr[y] = new Array(BOARD_SIZE.x)
    for (let x = 0; x < BOARD_SIZE.x; x++) {
      arr[y][x] = fill
    }
  }
  return arr
}

export const INIT_GAME_STATE = create2DArray()

export const createRoot = boardState => {
  return [
    {
      id: uuid(),
      boardState: clone(boardState),
      _children: [],
    },
  ]
}

export const createNode = ({ boardState, depth, action }) => {
  const id = uuid()
  return { id, boardState, _depth: depth, _action: action }
}

export const appendNode = ({ root, node, childIndexs }) => {
  let parentNode = root
  console.log(childIndexs)
  const _childIndexs = clone(childIndexs)

  // pop root index because root has just one path
  _childIndexs.shift()

  if (typeof parentNode._children === 'undefined') {
    parentNode._children = []
  }

  for (let i = 0; i < _childIndexs.length; i++) {
    parentNode = parentNode._children[_childIndexs[i]]
  }

  if (!parentNode._children) {
    parentNode._children = []
  }
  parentNode._children.push(node)

  return [root]
}

export const collapseTree = root => {
  if (!root._children) return
  const childLength = root._children.length

  if (childLength === 1) {
    root._collapsed = false
  }

  if (childLength > 1) {
    for (let i = 0; i < childLength - 1; i++) {
      root._children[i]._collapsed = true
    }
    root._children[childLength - 1]._collapsed = false
  }
  for (let i = 0; i < childLength; i++) {
    collapseTree(root._children[i])
  }
}
