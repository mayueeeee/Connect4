import React, { Component } from 'react'
import Node from './Node'
import Tree from 'react-d3-tree';

const myTreeData = {
  name: "1",
  children: [
    {
      name: "2",
      yay: '66'
    },
    {
      name: "2",
      children: [
        {
          name: "2",
          yay: '66'
        },
        {
          name: "2",
          children: [
            {
              name: "2",
              yay: '66'
            },
            {
              name: "2",
              children: [
                {
                  name: "2",
                  yay: '66'
                },
                {
                  name: "2"
                }
              ]
            }
          ]
        }

      ]
    }
  ]
};

export default class TreeView extends Component {

  state = {
    translate: {
      x: 0,
      y: 50
    }
  }

  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect();
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: 50
      }
    });
  }

  render() {
    return (
      <div ref={tc => (this.treeContainer = tc)} style={{ height: '100vh' }}>
        <Tree
          data={myTreeData}
          translate={this.state.translate}
          orientation='vertical'
          allowForeignObjects
          nodeLabelComponent={{
            render: <Node />,
            foreignObjectWrapper: {
              y: -45,
              x: -55
            }
          }}
        />
      </div>
    );
  }
}
