import axios from 'axios';
import authHeader from './auth-header';
import authService from "./auth.service";

const API_URL = 'http://localhost:8080/api/game/';

class GameService {
    createGame(username) {
        return axios.post(API_URL + 'create', {playerName: username, headers: authHeader()});
    }

    getGame(id) {
        return axios.get(API_URL + 'get/'+id, {headers: authHeader()});
    }

    getOpenGames() {
        return axios.get(API_URL + 'getall', {headers: authHeader()});
    }
}

export default new GameService();