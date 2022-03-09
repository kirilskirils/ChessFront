// 'n' - a non-capture
// 'b' - a pawn push of two squares
// 'e' - an en passant capture
// 'c' - a standard capture
// 'p' - a promotion
// 'k' - kingside castling
// 'q' - queenside castling

import Chess from "chess.js"

var chess;
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", 'c', 'd', 'e', 'f', 'g', 'h'];
var lastMove = null;

export default class validator {

    constructor(fen) {
        this.fen = fen;
        chess = new Chess(fen);
    }


    getChess() {
        if (chess) {
            return chess
        }
    }

    printBoard() {
        //console.log(chess.board());
    }

    printBoardASCIIprintBoardASCII() {
        console.log(chess.ascii());
    }

    isEnPassant() {
        if (lastMove.flags == "e") {
            console.log("isEnPassant");
            return true;
        } else {
            return false;
        }

    }


    isValidMove(px, py, x, y, type) {
        var move = chess.move(horizontalAxis[px] + verticalAxis[py] + horizontalAxis[x] + verticalAxis[y], {sloppy: true});


        //     if(chess)
        if (move != null) {
            console.log(chess.ascii());
            if (chess.game_over()) {
                console.log("GG");
            }
            lastMove = move;
            return true
        }
        return false;
    }
}