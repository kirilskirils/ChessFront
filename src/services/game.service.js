import axios from 'axios';
import authHeader from './auth-header';
import authService from "./auth.service";

const API_URL = 'http://localhost:8080/api/game/';

class GameService {
    createGame(userId) {
        return axios.post(API_URL + 'create', {userId: userId, headers: authHeader()});
    }

    getGame(id) {
        return axios.get(API_URL + 'get/'+id, {headers: authHeader()});
    }

    getOpenGames() {
        return axios.get(API_URL + 'getall', {headers: authHeader()});
    }
    joinGame(userId,gameId) {
        return axios.post(API_URL + 'join', {gameId: gameId,userId: userId, headers: authHeader()});
    }
    deleteGame(playerId) {
        return axios.post(API_URL + 'delete', {playerId: playerId, headers: authHeader()});
    }
    getActiveGame(playerId) {
        const params = {
            playerId: { toJSON: () => playerId }
        };
        return axios.get(API_URL + 'getActive', {params, headers: authHeader()});
    }
}

export default new GameService();