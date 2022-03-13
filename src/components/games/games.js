import React from "react";
import Chessboard from "../chessboard/chessboard";
import MoveValidator from "../../moveValidator/moveValidator.js";
import Chess from "chess.js"
import ReactDOM from 'react-dom';
import GameService from "../../services/game.service";
import GameRow from "../gameRow/gameRow";
import {renderToStaticMarkup} from "react-dom/server";

class Games extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentBoard : null,
            validator: new MoveValidator(), gamesList: null, number: 1

        };
        this.updateBoard = this.updateBoard.bind(this);
        this.changeCurrentBoardId = this.changeCurrentBoardId.bind(this);
        // this.getGame = this.getGame.bind(this);
        // this.getOpenGames = this.getOpenGames.bind(this);

    }

    componentDidMount() {
        this.getGamesList();


        this.interval = setInterval(async () => {
            this.updateBoard(this.state.currentBoard);
            this.getGamesList();
            this.setState({number: this.state.number = this.state.number + 1})
        }, 500);

    }

    getGamesList() {
        let rows = [];

        GameService.getOpenGames().then(result => {
            // console.log(result.data);
            result.data.forEach(e => {
                rows.push(<GameRow number={e.id} firstPlayer={e.firstPlayer} secondPlayer={e.opponentPlayer}
                                   gameStatus={e.gameStatus} joinEvent= {this.changeCurrentBoardId}/>);
            })
            this.setState({gamesList: this.state.gamesList = rows})
        })
            .catch(error => {
                console.error(error);
                this.setState({gamesList: this.state.gamesList = "ERROR GETTING GAME LIST"})
            });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    updateBoard(id) {
        GameService.getGame(id).then(result => {
            this.setState({validator: new MoveValidator(result.data.gameState,result.data.gameId)});
        })
            .catch(error => {
                console.error(error);
            });
    }


    getGame(id) {
        GameService.getGame(id).then(result => {
             console.log(result.data);

            return result.data
            // this.changeBoard(result.data.gameState);
        })
            .catch(error => {

                console.error(error);
                return null;
            });
    }
    createGame()
    {
        GameService.createGame("username");
    }
    changeCurrentBoardId(id)
    {
        this.setState({currentBoard: id});
        this.updateBoard(id);
    }


    render() {
        return (<div>
            <div className="row">
                <div className="col">
                    <Chessboard validator={this.state.validator} gameId="3"/>
                    {this.state.validator.getChess().turn() === 'w' ? <p>WHITE TURN</p> : <p>BLACK TURN</p>}

                    <button onClick={() => this.changeCurrentBoardId(1)}> CHANGE 1</button>
                    <button onClick={() => this.changeCurrentBoardId(2)}> CHANGE 2</button>
                    <button onClick={() => this.changeCurrentBoardId(99)}> CHANGE 99</button>


                    <button onClick={() => this.getGame(3)}> GET GAME</button>
                    <button onClick={() => this.createGame()}> CREATE GAME</button>
                </div>
                <div className="col">

                    <table>
                        <tr>
                            <th>Game ID</th>
                            <th>Player Name</th>
                            <th>Player Name</th>
                            <th>Game Status</th>
                        </tr>
                        <tbody>{this.state.gamesList}</tbody>
                    </table>
                    <h2>{this.state.number}</h2>
                </div>


            </div>
        </div>);
    }

}

export default Games;