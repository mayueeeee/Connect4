import React from 'react';
import Board from "../components/game/Board/Board";
import TreeView from '../components/TreeView/TreeView'
export default class IndexPage extends React.Component {

  render() {
    return (
      <div className="columns">
        <div className="column">
          <Board />
        </div>
        <div className="column">
          <TreeView />
        </div>
      </div>
    )
  }

}

