import React from 'react'
import AuthService from "../services/auth.service";
import {Redirect, Route} from 'react-router-dom'
import Games from "../components/games/games";

/**
 * Route for when unauthenticated user tres to access game board
 * @returns {JSX.Element} Chess board if user is authenticated
 */
const PrivateRoute = () => {

    const user = AuthService.getCurrentUser();
    console.log(user);

    return (
        <Route
            render={() => {
                console.log(user);
                if (!user) {
                    return <Redirect to={'/register'}/>;
                } else {
                    return <Games></Games>
                }
            }

            }
        />
    )
}

export default PrivateRoute