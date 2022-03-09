import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/game/';

export default class GameService {
    createGame(username) {
        return axios.post(API_URL + 'create', {player_name: username, headers: authHeader()});
    }
}