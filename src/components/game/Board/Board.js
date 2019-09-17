import React from 'react'
import lastIndexOf from 'lodash/lastIndexOf'
import Row from './Row'

export default class Board extends React.Component {
    state = {
        board: Array(7)
            .fill(0)
            .map(x => Array(6).fill('blank')),
        turn: 0,
    }

    onRowClick = (rowNum) => {
        const color = this.state.turn === 0 ? 'red' : 'green'
        console.log('Row ', rowNum, ' Color ', color)
        const lastBlank = lastIndexOf(this.state.board[rowNum], 'blank')
        let tmp = this.state.board
        tmp[rowNum][lastBlank] = color
        this.setState({ board: tmp, turn: Math.abs(this.state.turn - 1) })
    }


    render() {
        return (
            <div className="game-board">
                <div className="columns is-centered">
                    {this.state.board.map((row, i) => (
                        <Row key={i} data={row} onClick={e => this.onRowClick(i)}/>
                    ))}
                </div>
            </div>
        )
    }
}
