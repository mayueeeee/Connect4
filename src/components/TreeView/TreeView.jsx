import React, { Component } from 'react'
import Node from './Node'
import Tree from 'react-d3-tree'
import { createRoot, INIT_GAME_STATE } from './treeUtil'
import {
  deptLimitSearch,
  MAX_VISUALIZE_DEPTH,
  BOARD_SYMBOL,
  delay,
} from './gameUtil'

// Maybe pass this from Context API?
const gameState = createRoot(INIT_GAME_STATE)

export default class TreeView extends Component {
  state = {
    translate: {
      x: 0,
      y: 50,
    },
  }

  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect()
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: 50,
      },
    })

    setTimeout(async () => {
      const search = deptLimitSearch({
        root: gameState[0],
        limit: MAX_VISUALIZE_DEPTH,
        turn: BOARD_SYMBOL.PLAYER,
      })

      console.time('time used')

      let next = search.next()
      let data = next.value

      let i = 1

      while (!next.done) {
        next = search.next()
        if (next.value) {
          i++
          data = next.value
          this.tree.setState({ data: data })
          await delay(50)
        }
      }

      console.log(`Searched ${i} possible ways`)
      console.timeEnd('time used')
    }, 50)
  }

  render() {
    return (
      <div ref={tc => (this.treeContainer = tc)} style={{ height: '100vh' }}>
        <Tree
          ref={e => (this.tree = e)}
          pathFunc="elbow"
          zoom={0.5}
          data={gameState}
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
