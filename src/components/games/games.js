import React from "react";
import Chessboard from "../chessboard/chessboard";
import MoveValidator from "../../moveValidator/moveValidator.js";
import Chess from "chess.js"
import ReactDOM from 'react-dom';
import GameService from "../../services/game.service";

class Games extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // rep: new MoveValidator().getChess().board(),
            validator: new MoveValidator(),
            // count: 0,
            board: Chessboard
        };
        this.changeBoard = this.changeBoard.bind(this);
        this.getGame = this.getGame.bind(this);


    }

    changeBoard(fen) {
        if(fen)
        {
            // console.log(fen);
            this.setState({validator: new MoveValidator(fen)});
        }
        else
        {
            this.setState({validator: new MoveValidator()});
        }
        // console.log("LOL");
        // this.setState({rep: new MoveValidator().getChess().board()});


    }

    getGame() {
        GameService.getGame(1).then(result => {
             console.log(result);
            // console.log(result.data.gameState);
            this.changeBoard(result.data.gameState);
        })
            .catch(error => {
                console.error(error);
            });
    }


    render() {
        return (<div>
            {/*<Chessboard pieceRep={this.state.rep} validator={this.state.validator}/>*/}
            <Chessboard validator={this.state.validator}/>
            <button onClick={() => this.changeBoard()}> RESET</button>
            <button onClick={this.getGame}> GET GAME</button>
        </div>);
    }

}

export default Games;