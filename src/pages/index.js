import React from 'react';
import Board from "../components/game/Board/Board";
export default class IndexPage extends React.Component{

    render() {
        return (
            <div className="columns">
                <div className="column">
                    <Board/>
                </div>
                <div className="column">
                    Second column
                </div>

            </div>
        )
    }

}

