import './App.css';
import Chessboard from "./components/chessboard/chessboard";
import React, {Component} from "react";
import {Switch, Route, Link} from "react-router-dom";
import AuthService from "./services/auth.service.js";
import Login from "./components/login.js"
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {

    constructor(props) {
        super(props);


        this.state = {
            currentUser: undefined,
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user,
            });
        }
    }


    render() {
        const {currentUser} = this.state;
        return (
            <div>
                <nav className="navbar navbar-expand navbar-dark bg-dark">
                    <div className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to={"/game"} className="nav-link">
                                Game
                            </Link>
                        </li>
                    </div>

                    {currentUser ? (<div className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link to={"/profile"} className="nav-link">
                                {currentUser.username}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <a href="/login" className="nav-link" onClick={this.logOut}>
                                LogOut
                            </a>
                        </li>
                    </div>) : (<div className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link to={"/login"} className="nav-link">
                                Login
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={"/register"} className="nav-link">
                                Sign Up
                            </Link>
                        </li>
                    </div>)}
                </nav>

                <div className="container mt-3">
                    <Switch>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/game" component={Chessboard}/>
                    </Switch>
                </div>
            </div>);
        return (<div id="app">

            <Chessboard/>

        </div>)
    }
}

export default App;
