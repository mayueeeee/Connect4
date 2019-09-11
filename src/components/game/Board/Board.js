import React from 'react'
import Row from './Row'
import Dot from '../Dot'

export default class Board extends React.Component {
    state = {
        board: Array(7)
            .fill(0)
            .map(x => Array(6).fill('blank')),
    }

    yay = () => {
        console.log('yay')
        let bibi = this.state.board
        bibi[0][1] = 'green'
        this.setState({ board: bibi })
    }
    render() {
        return (
            <div className="game-board">
                <div className="columns is-centered">
                    {this.state.board.map((row, i) => (
                        <Row key={i} data={row} hover={this.yay}/>
                    ))}
                </div>
            </div>
        )
    }
}
