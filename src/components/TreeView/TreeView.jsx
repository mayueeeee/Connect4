import React, { Component } from 'react'
import Node from './Node'
import Tree from 'react-d3-tree'
// import { createRoot, collapseTree, create2DArray } from './treeUtil'
// import { NavDropdown, Navbar, Form, InputGroup, Button } from 'react-bootstrap'

import {
  searchTree,
  deptLimitSearch,
  iterativeDeepeningSearch,
  BOARD_SYMBOL,
  chooseBestAction,
  fillCoin,
  delay,
} from './gameUtil'

const SEARCH_OPTIONS = [{ label: 'DLS', value: 0 }, { label: 'ITDS', value: 1 }]

const SEARCH_FUCNTION = [deptLimitSearch, iterativeDeepeningSearch]

const VISUAL_OPTIONS = [
  { label: 'Solution', value: 0 },
  { label: 'All tree', value: 1 },
]

export default class TreeView extends Component {
  state = {
    translate: {
      x: 0,
      y: 90,
    },
    boardState: createRoot(create2DArray()),
    searchOption: 0,
    visualOption: 0,
    isShowStep: false,
    searchLimit: 7,
  }

  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect()
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: 90,
      },
    })
  }


  render() {
    const { boardState } = this.state

    const { searchOption, visualOption, searchLimit } = this.state

    return (
      <div ref={tc => (this.treeContainer = tc)}>
        <div style={{ height: 48 }}>
          <Navbar bg="dark">
            <div style={{ fontSize: '11', color: 'white' }}>Search : </div>
            <NavDropdown title={SEARCH_OPTIONS[searchOption].label}>
              {SEARCH_OPTIONS.map((option, index) => {
                return (
                  <NavDropdown.Item
                    key={`search_${index}`}
                    onClick={() =>
                      this.handleChange('searchOption', option.value)
                    }
                  >
                    {option.label}
                  </NavDropdown.Item>
                )
              })}
            </NavDropdown>
            {searchOption === 0 && (
              <>
                <div style={{ fontSize: '11', color: 'white' }}>Limit : </div>
                <NavDropdown title={searchLimit}>
                  {this.renderSearchLimit()}
                </NavDropdown>
              </>
            )}

            <div style={{ fontSize: '11', color: 'white' }}>Visual : </div>
            <NavDropdown title={VISUAL_OPTIONS[visualOption].label}>
              {VISUAL_OPTIONS.map((option, index) => {
                return (
                  <NavDropdown.Item
                    key={`visual_${index}`}
                    onClick={() =>
                      this.handleChange('visualOption', option.value)
                    }
                  >
                    {option.label}
                  </NavDropdown.Item>
                )
              })}
            </NavDropdown>
            <Form inline>
              <InputGroup>
                <Form.Check
                  type="checkbox"
                  value={this.state.isShowStep}
                  onChange={e =>
                    this.handleChange('isShowStep', e.target.checked)
                  }
                />
                <div style={{ fontSize: '11', color: 'white' }}>
                  Show search step
                </div>
              </InputGroup>
            </Form>
            <Button
              onClick={this.runSearch}
              style={{ marginLeft: 'auto' }}
              size="sm"
            >
              Search{' '}
            </Button>
          </Navbar>
        </div>
        <div style={{ height: 'calc(100vh - 56px)' }}>
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
      </div>
    )
  }
}
