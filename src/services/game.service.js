import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/game/';

class GameService {
    createGame(username) {
        console.log(authHeader());
        return axios.post(API_URL + 'create', {playerName: username, headers: authHeader()});
    }
}

export default new GameService();