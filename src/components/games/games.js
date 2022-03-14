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
            currentUser: undefined,
            allowedColor: undefined
        };
        // this.setActiveGame = this.setActiveGame.bind(this);
        this.updateBoard = this.updateBoard.bind(this); //
        this.changeBoard = this.changeBoard.bind(this);
        this.createGameList = this.createGameList.bind(this);
        this.createGameEvent = this.createGameEvent.bind(this); //
    }

    componentDidMount() {

        const user = AuthService.getCurrentUser();

        // IF PLAYER HAS ACTIVE GAME CHANGE STATE TO THAT GAME
        if (user) {
            this.setState({
                currentUser: user,
            });
            this.setActiveGame(user.id);
        }
        this.createGameList();

        this.interval = setInterval(async () => {
            this.updateBoard(this.state.currentBoard);
            this.createGameList();
        }, 1000);

    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    /**
     * Gets game list from database
     */
    createGameList() {
        let rows = [];

        GameService.getOpenGames().then(response => {
            response.data.forEach(game => {
                this.hasCreatedGame(game);
                if (game.firstPlayer !== this.state.currentUser.username) {
                    rows.push(<GameRow number={game.id} firstPlayer={game.firstPlayer} secondPlayer={game.opponentPlayer}
                                       gameStatus={game.gameStatus} joinEvent={() => {
                        this.joinButtonEvent(game);
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

    /**
     * Actions that happen when Join Game is pressed
     * @param game game object
     */
    joinButtonEvent(game) {
        this.changeBoard(game.id);
        GameService.deleteGame(this.state.currentUser.id);
        GameService.joinGame(this.state.currentUser.id, game.id);
    }

    /**
     * Checks if current user has created a game
     * @param game game object
     */
    hasCreatedGame(game) {
        if (game.firstPlayer === this.state.currentUser.username) {
            this.setState({createdGame: true})
        }
    }

    /**
     * Sets current board state from database
     * @param id id of game
     */
    updateBoard(id) {
        GameService.getGame(id).then(result => {
            this.setState({validator: new MoveValidator(result.data.gameState, result.data.gameId)});
        })
            .catch(error => {
                console.error(error);
            });
    }

    /**
     * Sets current users active game
     * Used when page refreshes or user logs in
     * @param playerId
     */
    setActiveGame(playerId) {
        GameService.getActiveGame(playerId).then(result => {
            this.setState({activeGame: result.data.gameId})
            this.changeBoard(result.data.gameId);
        })
            .catch(error => {
                this.setState({activeGame: undefined})
                console.error(error);

            });
    }

    /**
     * Changes current board to that of an id
     * @param id board id
     */
    changeBoard(id) {
        this.setState({currentBoard: id});
        this.setState({activeGame: id});
        this.updateBoard(id);
    }

    /**
     * functions that are used when new game is created
     * @returns {(function(): void)|*} button onClick function
     */
    createGameEvent() {
        return () => {
            GameService.createGame(this.state.currentUser.id).then(response => {
                this.setState({activeGame: response.data.gameId})
                this.setActiveGame(this.state.currentUser.id);
                this.changeBoard(response.data.gameId);
            }).catch(error => {
                return null;
            })
        }

    }

    render() {
        return (<div>
            <div className="row">
                <div className="col" align="center">
                    {this.state.activeGame == undefined ? <div className="blur">
                        <div className="container-fluid">
                            <Chessboard validator={this.state.validator}/>
                            {this.state.validator.getChess().turn() === 'w' ? <p>WHITE TURN</p> : <p>BLACK TURN</p>}
                        </div>
                    </div> : <div>
                        <div className="container-fluid">
                            <Chessboard validator={this.state.validator} allowedColor={this.state.allowedColor}/>
                            {this.state.validator.getChess().turn() === 'w' ? <p>WHITE TURN</p> : <p>BLACK TURN</p>}
                        </div>
                    </div>}

                    {this.state.activeGame === undefined ? <button
                            className="btn btn-success"
                            onClick={this.createGameEvent()}>CREATE GAME</button> :
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
                    {/*<h2>{this.state.number}</h2>*/}
                </div>


            </div>
        </div>);
    }


}

export default Games;