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

            validator: new MoveValidator(), board: Chessboard, gamesList: "INIT", number: 0

        };
        this.changeBoard = this.changeBoard.bind(this);
        this.getGame = this.getGame.bind(this);
        this.getOpenGames = this.getOpenGames.bind(this);

    }

    componentDidMount() {
        this.interval = setInterval(async () => {


            var rows = [];
            GameService.getOpenGames().then(result => {
                result.data.forEach(e => {
                    rows.push(<p>{e.gameState} key={e.firstPlayerId}</p>);
                })
                this.setState({gamesList: this.state.gamesList = rows})
            })
                .catch(error => {
                    console.error(error);
                    this.setState({gamesList: this.state.gamesList = "ERROR GETTING GAME LIST"})


                });

            this.setState({number: this.state.number = this.state.number + 1})
        }, 2000);

    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    changeBoard(fen) {
        if (fen) {
            this.setState({validator: new MoveValidator(fen)});
        } else {
            this.setState({validator: new MoveValidator()});
        }
    }

    async getOpenGames() {
        // console.log("OPEN");
        // var row = "START";
        // // rows.push(<p>asd</p>)
        // GameService.getOpenGames().then(result => {
        //     // console.log(result);
        //     return "CHANGE";
        // })
        //     .catch(error => {
        //         console.error(error);
        //         return "ERR";
        //
        //         // return Promise.reject(error);
        //     });

        // return row;

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
            <div className="row">
                <div className="col">
                    <Chessboard validator={this.state.validator}/>
                    <button onClick={() => this.changeBoard()}> RESET</button>
                    <button onClick={this.getGame}> GET GAME</button>
                </div>
                <div className="col">
                    {this.state.number}
                    {this.state.gamesList}
                </div>


            </div>
        </div>);
    }

}

export default Games;