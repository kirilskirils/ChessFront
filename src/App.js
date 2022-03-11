import './App.css';
import React, {Component} from "react";
import {Switch, Route, Link} from "react-router-dom";
import AuthService from "./services/auth.service.js";
import GameService from "./services/game.service.js";
import Games from "./components/games/games";
import Login from "./components/login/login.js"
import Register from "./components/register/register.js"
import "bootstrap/dist/css/bootstrap.min.css";


class App extends Component {


    constructor(props) {
        super(props);

        this.logOut = this.logOut.bind(this);

        this.state = {
            currentUser: undefined,
        };
    }

    logOut() {
        AuthService.logout();
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
        return (<div>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to={"/games"} className="nav-link">
                            Chess
                        </Link>
                    </li>
                </div>

                {currentUser ? (<div className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <Link className="nav-link disabled">
                            {currentUser.username}
                        </Link>
                    </li>

                    <li className="nav-item">
                        <a href="/login" className="nav-link" onClick={this.logOut}>
                            Logout
                        </a>
                    </li>
                </div>) : (<div className="navbar-nav ms-auto">
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
                <div>
                    <Switch>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/register" component={Register}/>
                        <Route exact path="/games" component={Games}/>
                    </Switch>
                </div>
            </div>
        </div>);

    }
}

export default App;
