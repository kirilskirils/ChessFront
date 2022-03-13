import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/move/';

class MoveService {
    makeMove(gameId, fen) {
         return axios.post(API_URL + 'makemove', {gameId: gameId, fen: fen, headers: authHeader()});
    }

}

export default new MoveService();