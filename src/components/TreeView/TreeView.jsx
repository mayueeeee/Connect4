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
import { Navbar, NavDropdown, Form, InputGroup } from 'react-bootstrap';

// Maybe pass this from Context API?
const gameState = createRoot([[0,0,0,0,0,1,2],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]])

const SEARCH_OPTIONS = [
  { label: 'Depth limit search', value: 0 },
  { label: 'Iterative deepening search', value: 1 }
]

const VISUAL_OPTIONS = [
  {label: 'Solution', value: 0},
  {label: 'All tree', value: 1}
]


export default class TreeView extends Component {
  state = {
    visualOption: 1,
    translate: {
      x: 0,
      y: 50,
    },
    searchOption: 0
  }

  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect()
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: 90,
      },
    })

    // setTimeout(async () => {
    //   const search = deptLimitSearch({
    //     root: gameState[0],
    //     limit: MAX_VISUALIZE_DEPTH,
    //     turn: BOARD_SYMBOL.PLAYER,
    //   })

    //   console.time('time used')

    //   let next = search.next()
    //   let data = next.value

    //   let i = 1

    //   while (!next.done) {
    //     next = search.next()
    //     if (next.value) {
    //       i++
    //       data = next.value
    //       this.tree.setState({ data: data })
    //       await delay(50)
    //     }
    //   }

    //   console.log(`Searched ${i} possible ways`)
    //   console.timeEnd('time used')
    // }, 50)
  }

  handleChangeSearch = (value) => {
    this.setState({
      searchOption: value
    })
  }

  handleChangeVisual=(value)=> {
    this.setState({
      visualOption: value
    })
  }

  render() {
    const { searchOption,visualOption} = this.state

    return (

      <div ref={tc => (this.treeContainer = tc)} style={{ height: '100vh' }}>
        <div>
        <Navbar bg="dark">  
          <text style={{ fontSize: '11'  ,color:'white'}}>Search : </text>
          <NavDropdown title={SEARCH_OPTIONS[searchOption].label}>
            {SEARCH_OPTIONS.map((option, index) => {
              return (
                <NavDropdown.Item key={`search_${index}`} onClick={() => this.handleChangeSearch(option.value)}>
                  {option.label}
                </NavDropdown.Item>
              )

            })}
          </NavDropdown>

          <text style={{ fontSize: '11' ,color:'white'}}>Visual : </text>
          <NavDropdown title={VISUAL_OPTIONS[visualOption].label}>
            {VISUAL_OPTIONS.map((option, index) => {
              return (
                <NavDropdown.Item key={`visual_${index}`} onClick={() => this.handleChangeVisual(option.value)}>
                  {option.label}
                </NavDropdown.Item>
              )

            })}
          </NavDropdown>
          <Form inline >
            <InputGroup>
              <Form.Check type="checkbox" style={{marginTop:5}}/>
              <text style={{ fontSize: '11'  ,color:'white'}}>Show search step</text>
            </InputGroup>
          </Form>

        </Navbar>
        </div>
        <div>
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
      </div >
    )
  }
}
