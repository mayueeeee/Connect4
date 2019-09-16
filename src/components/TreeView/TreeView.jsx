import React, { Component } from 'react'
import Node from './Node'
import Tree from 'react-d3-tree'
import { createRoot, collapseTree, create2DArray } from './treeUtil'
import {
  searchTree,
  deptLimitSearch,
  iterativeDeepeningSearch,
  BOARD_SYMBOL,
  chooseBestAction,
  fillCoin,
  delay,
} from './gameUtil'

export default class TreeView extends Component {
  state = {
    translate: {
      x: 0,
      y: 90,
    },
    boardState: createRoot(create2DArray()),
  }

  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect()
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: 90,
      },
    })
    this.runSearch({
      boardState: this.state.boardState[0].boardState,
      turn: BOARD_SYMBOL.AI,
    })
  }

  runSearch = async ({ boardState, turn }) => {
    const search = searchTree({
      root: createRoot(boardState)[0],
      limit: 7,
      turn: turn,
      searchFunction: deptLimitSearch,
    })

    console.time('time used')

    let next = search.next()
    let data = next.value

    let i = 1

    while (!next.done && i < 10000) {
      next = search.next()
      if (next.value) {
        i++
        data = next.value
      }
    }

    console.log(`Searched ${i} possible ways`)
    console.timeEnd('time used')

    const root = data[0]

    collapseTree(root)

    this.tree.setState({ data: data })

    const action = chooseBestAction(root)

    const newState = fillCoin({
      boardState: root.boardState,
      nColumn: action,
      symbol: this.state.turn,
    })

    return newState
  }

  render() {
    const { boardState } = this.state

    return (
      <div ref={tc => (this.treeContainer = tc)} style={{ height: '100vh' }}>
        <Tree
          ref={e => (this.tree = e)}
          pathFunc="elbow"
          zoom={0.5}
          data={boardState}
          translate={this.state.translate}
          orientation="vertical"
          useCollapseData
          allowForeignObjects
          nodeSize={{
            x: 240,
            y: 260,
          }}
          transitionDuration={0}
          nodeLabelComponent={{
            render: <Node width={200} height={200} />,
            foreignObjectWrapper: {
              x: -100,
              y: -110,
            },
          }}
        />
      </div>
    )
  }
}
