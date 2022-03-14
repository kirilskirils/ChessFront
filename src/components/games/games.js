import React from "react";
import Chessboard from "../chessboard/chessboard";
import MoveValidator from "../../moveValidator/moveValidator.js";
import Chess from "chess.js"
import ReactDOM from 'react-dom';
import AuthService from "../../services/auth.service";
import GameService from "../../services/game.service";
import GameRow from "../gameRow/gameRow";
import "./games.css";
import {renderToStaticMarkup} from "react-dom/server";

class Games extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            currentBoard: undefined,
            activeGame: undefined,
            validator: new MoveValidator(),
            gameRowsList: undefined,
            gameList: undefined,
            turn: 'w',
            number: 1,
            currentUser: undefined,
            createdGame: true

        };

        this.hasCreatedGame = this.hasCreatedGame.bind(this);
        this.updateBoard = this.updateBoard.bind(this);
        this.changeCurrentBoardId = this.changeCurrentBoardId.bind(this);
        this.getGamesList = this.getGamesList.bind(this);

    }

    componentDidMount() {

        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user,

            });
            this.setActiveGame(user.id);
        }
        this.getGamesList();


        this.interval = setInterval(async () => {
            this.updateBoard(this.state.currentBoard);
            this.getGamesList();
            this.setState({number: this.state.number = this.state.number + 1})
        }, 1000);

    }

    getGamesList() {
        let rows = [];

        GameService.getOpenGames().then(result => {
            // console.log(result.data);
            result.data.forEach(e => {
                // console.log(e.firstPlayer);
                // console.log(this.state.currentUser.username + "DDD");
                this.hasCreatedGame(e);
                if(e.firstPlayer !== this.state.currentUser.username)
                {
                    rows.push(<GameRow number={e.id} firstPlayer={e.firstPlayer} secondPlayer={e.opponentPlayer}
                                       gameStatus={e.gameStatus} joinEvent={() => {
                        this.changeCurrentBoardId(e.id);
                        GameService.deleteGame(this.state.currentUser.id);
                        GameService.joinGame(this.state.currentUser.username,e.id);
                    }}/>);
                }

            })
            this.setState({gamesList: this.state.gamesList = rows})
        })
            .catch(error => {
                console.error(error);
                this.setState({gamesList: this.state.gamesList = "ERROR GETTING GAME LIST"})
            });
    }

    hasCreatedGame(e) {
        // console.log(e.firstPlayer);
        // console.log(this.state.currentUser.username);
        if (e.firstPlayer === this.state.currentUser.username) {
            // console.log("TES");
            this.setState({createdGame: false})
        }
        else {

            this.setState({createdGame: true})
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }


    updateBoard(id) {
        GameService.getGame(id).then(result => {
            this.setState({validator: new MoveValidator(result.data.gameState, result.data.gameId)});
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

    setActiveGame(playerId) {
        GameService.getActiveGame(playerId).then(result => {
            // console.log(result);
        this.setState({activeGame: result.data.gameId})
            this.changeCurrentBoardId(result.data.gameId);
        })
            .catch(error => {

                console.error(error);

            });
    }





    changeCurrentBoardId(id) {
        this.setState({currentBoard: id});
        this.updateBoard(id);
    }


    render() {
        return (<div>
            <div className="row">
                <div className="col" align="center">
                    {/*<div className="blur">*/}
                        <div className="container-fluid">
                            <Chessboard validator={this.state.validator}/>
                        </div>
                    {/*</div>*/}

                    {this.state.validator.getChess().turn() === 'w' ? <p>WHITE TURN</p> : <p>BLACK TURN</p>}

                    {/*<button onClick={() => this.changeCurrentBoardId(1)}> CHANGE 1</button>*/}
                    {/*<button onClick={() => this.changeCurrentBoardId(2)}> CHANGE 2</button>*/}
                    {/*<button onClick={() => this.changeCurrentBoardId(99)}> CHANGE 99</button>*/}
                    {/*<button onClick={() => this.getGame(3)}> GET GAME</button>*/}

                    {this.state.createdGame === true ?
                        <button className="btn btn-success"
                                onClick={this.createGameEvent()
                                }>CREATE GAME</button> :
                        <p>GAME CREATED WAITING FOR OPPONENT TO JOIN</p>}
                </div>
                <div className="col" align="center">

                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>Game ID</th>
                            <th>Player</th>
                            <th>Opponent</th>
                            <th>Game Status</th>
                        </tr>
                        </thead>
                        <tbody>{this.state.gamesList}</tbody>
                    </table>
                    <h2>{this.state.number}</h2>
                </div>


            </div>
        </div>);
    }

    createGameEvent() {
        return () =>{
            GameService.createGame(this.state.currentUser.username).then(response => {
                // this.getGamesList();
                this.changeCurrentBoardId(response.data.gameId);
            }).catch(error => {
                return null;
            })
        }

    }
}

export default Games;