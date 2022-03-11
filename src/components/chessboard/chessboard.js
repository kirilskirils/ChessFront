import React from "react";
import {useRef, useState, useEffect} from "react";
import Tile from "../tile/tile"
import {useSpring, animated} from '@react-spring/web'
import {useDrag} from '@use-gesture/react'
import './chessboard.css'
import Chess from "chess.js"
import MoveValidator from "../../moveValidator/moveValidator.js";
import GameService from "../../services/game.service.js"

import BishopBlackImg from "../../assets/bishop_black.png";
import BishopWhiteImg from "../../assets/bishop_white.png";
import PawnBlackImg from "../../assets/pawn_black.png";
import PawnWhiteImg from "../../assets/pawn_white.png";
import KingBlackImg from "../../assets/king_black.png";
import KingWhiteImg from "../../assets/king_white.png";
import QueenBlackImg from "../../assets/queen_black.png";
import QueenWhiteImg from "../../assets/queen_white.png";
import RookWhiteImg from "../../assets/rook_white.png";
import RookBlackImg from "../../assets/rook_black.png";
import KnightBlackImg from "../../assets/knight_black.png";
import KnightWhiteImg from "../../assets/knight_white.png";

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", 'c', 'd', 'e', 'f', 'g', 'h'];


// var customState = [];
// const fen = "r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1 b - c3 0 19"
// const chess = new Chess(fen);
// const validator = new Validator(fen);
// const chess = validator.getChess();
// const pieceRepresentation = chess.board();


//TODO: DRY
function setPieceLocations(pieceRepresentation) {
    let customState = [];
    for (let i = 0; i < pieceRepresentation.length; i++) {
        for (let j = 0; j < pieceRepresentation[i].length; j++) {
            //console.log(boardState[j][i]);
            if (pieceRepresentation[i][j]) {
                if (pieceRepresentation[i][j].color === 'w') {
                    switch (pieceRepresentation[i][j].type) {
                        case 'p':
                            customState.push({x: j, y: 7 - i, image: PawnWhiteImg, type: "p", color: "w"});
                            break;
                        case 'r':
                            customState.push({x: j, y: 7 - i, image: RookWhiteImg, type: "r", color: "w"});
                            break;
                        case 'b':
                            customState.push({x: j, y: 7 - i, image: BishopWhiteImg, type: "b", color: "w"});
                            break;
                        case 'q':
                            customState.push({x: j, y: 7 - i, image: QueenWhiteImg, type: "q", color: "w"});
                            break;
                        case 'k':
                            customState.push({x: j, y: 7 - i, image: KingWhiteImg, type: "k", color: "w"});
                            break;
                        case 'n':
                            customState.push({x: j, y: 7 - i, image: KnightWhiteImg, type: "n", color: "w"});
                            break;
                    }
                } else {
                    switch (pieceRepresentation[i][j].type) {
                        case 'p':
                            customState.push({x: j, y: 7 - i, image: PawnBlackImg, type: "p", color: "b"});
                            break;
                        case 'r':
                            customState.push({x: j, y: 7 - i, image: RookBlackImg, type: "r", color: "b"});
                            break;
                        case 'b':
                            customState.push({x: j, y: 7 - i, image: BishopBlackImg, type: "b", color: "b"});
                            break;
                        case 'q':
                            customState.push({x: j, y: 7 - i, image: QueenBlackImg, type: "q", color: "b"});
                            break;
                        case 'k':
                            customState.push({x: j, y: 7 - i, image: KingBlackImg, type: "k", color: "b"});
                            break;
                        case 'n':
                            customState.push({x: j, y: 7 - i, image: KnightBlackImg, type: "n", color: "b"});
                            break;
                    }
                }

            }
        }
    }
    return customState;
}

export default function Chessboard(props) {


    const pieceRep = props.validator.getChess().board();
    let customState = setPieceLocations(pieceRep);


    const [validator, setValidator] = useState(props.validator);
    const [activePiece, setActivePiece] = useState(null);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);

    const chessboardRef = useRef(null);

    const [pieces, setPieces] = useState(customState);
    var board = drawPieces(pieces);


    useEffect(() => {
         setPieces(customState);
         console.log(validator.getChess().ascii());
    }, [props])
    //
    // useEffect(() => {
    //     console.log("BONK");
    //     setPieces(customState);
    // }, [])

    return <div
        onMouseMove={(e) => movePiece(e)}
        onMouseDown={(e) => grabPiece(e)}
        onMouseUp={(e) => dropPiece(e)}

        id="chessboard"
        ref={chessboardRef}>
        {board}
    </div>

//TODO: HARD CODED
    function grabPiece(e: React.MouseEvent) {

        const element = e.target;
        const chessboard = chessboardRef.current;


        if (element.classList.contains("chess-piece") && chessboard) {
            const gridX = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
            const gridY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));
            const currentPiece = pieces.find((p) => p.x === gridX && p.y === gridY);
            console.log(currentPiece.color)

            // if(currentPiece.color === "b")
            // {
                setGridX(gridX);
                setGridY(gridY);
                // console.log(e.target)
                const x = e.clientX - 50;
                const y = e.clientY - 50;
                element.style.position = "absolute";
                element.style.left = `${x}px`
                element.style.top = `${y}px`
                setActivePiece(element);
            // }

        }
    }

    function movePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        const element = e.target;
        if (activePiece && chessboard) {

            const minX = chessboard.offsetLeft - 25;
            const minY = chessboard.offsetTop - 25;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            activePiece.style.position = "absolute";

            //If x is smaller than minimum amount
            if (x < minX) {
                activePiece.style.left = `${minX}px`;
            }
            //If x is bigger than maximum amount
            else if (x > maxX) {
                activePiece.style.left = `${maxX}px`;
            }
            //If x is in the constraints
            else {
                activePiece.style.left = `${x}px`;
            }

            //If y is smaller than minimum amount
            if (y < minY) {
                activePiece.style.top = `${minY}px`;
            }
            //If y is bigger than maximum amount
            else if (y > maxY) {
                activePiece.style.top = `${maxY}px`;
            }
            //If y is in the constraints
            else {
                activePiece.style.top = `${y}px`;
            }
        }
        // e.stopPropagation();
    }

    function dropPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));

            const currentPiece = pieces.find((p) => p.x === gridX && p.y === gridY);
            const attackedPiece = pieces.find((p) => p.x === x && p.y === y);

            if (currentPiece) {
                const validMove = validator.isValidMove(gridX, gridY, x, y, currentPiece.type);

                if (validMove) {

                    const updatedPieces = pieces.reduce((results, piece) => {

                        // ATTACKED
                        if ((attackedPiece && attackedPiece.x === piece.x && attackedPiece.y === piece.y) || validator.is) {

                        }
                        // MOVED
                        else if (piece.x === currentPiece.x && piece.y === currentPiece.y) {

                            results.push(piece);
                            piece.x = x;
                            piece.y = y;
                        }
                        // OTHERS
                        else if (!(piece.x === x && piece.y === y)) {
                            results.push(piece);
                        }

                        // console.log(results);
                        return results;
                    }, []);

                    setPieces(updatedPieces);

                } else {
                    //RESETS THE PIECE POSITION
                    activePiece.style.position = "relative";
                    activePiece.style.removeProperty("top");
                    activePiece.style.removeProperty("left");
                }
            }
            setActivePiece(null);
        }
    }

    function drawPieces(pieces) {
        var tempBoard = [];
        for (let i = verticalAxis.length - 1; i >= 0; i--) {
            for (let j = 0; j < horizontalAxis.length; j++) {

                var number = j + i;
                let img = undefined;

                pieces.forEach((piece) => {
                    if ((piece.x === j && piece.y === i)) {
                        img = piece.image;
                    }
                })
                tempBoard.push(<Tile number={number} image={img} key={`${i},${j}`}/>)
            }
        }
        return tempBoard;
    }
}