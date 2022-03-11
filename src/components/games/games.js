import React from "react";
import Chessboard from "../chessboard/chessboard";
import MoveValidator from "../../moveValidator/moveValidator.js";
import Chess from "chess.js"
import ReactDOM from 'react-dom';

class Games extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            rep: new MoveValidator().getChess().board(),
            validator: new MoveValidator(),
            count: 0,
            board: Chessboard
        };
        this.changeBoard = this.changeBoard.bind(this);


    }

    changeBoard() {
        console.log("LOL");
        this.setState({rep: new MoveValidator().getChess().board()});
        this.setState({validator: new MoveValidator()});

    }


    render() {
        return (<div>
            <Chessboard pieceRep={this.state.rep} validator={this.state.validator}/>
            <h2> {this.state.count}</h2>
            <button onClick={this.changeBoard}> Add</button>
        </div>);
    }

}

export default Games;