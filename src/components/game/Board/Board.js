import React from 'react'
import lastIndexOf from 'lodash/lastIndexOf'
import Row from './Row'
import Dot from '../Dot'

export default class Board extends React.Component {
    state = {
        board: Array(7)
            .fill(0)
            .map(x => Array(6).fill('blank')),

        turn: 0,
    }

    yay = () => {
        console.log('yay')
        let bibi = this.state.board
        bibi[0][1] = 'green'
        this.setState({ board: bibi })
    }


    onRowClick = (rowNum, color) => {

        console.log('Row ', rowNum, ' Color ', color)
        const yay = lastIndexOf(this.state.board[rowNum],"blank")
        let bibi = this.state.board
        bibi[rowNum][yay] = 'green'
        this.setState({ board: bibi })




        if(this.state.turn=0){
            console.log("ai jaa")
        }

        else{
            console.log("human jaa")
        }
        this.setState({ turn: Math.abs(this.state.turn - 1) },()=>console.log("turn ",this.state.turn))


    }


    render() {
        // console.log(this.state.board)
        return (
            <div className="game-board">
                <div className="columns is-centered">
                    {this.state.board.map((row, i) => (
                        <Row key={i} data={row} onClick={e => this.onRowClick(i, 'green')}/>
                    ))}
                </div>
            </div>
        )
    }
}
