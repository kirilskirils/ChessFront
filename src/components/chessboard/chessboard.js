import React from "react";
import {useRef, useState, useEffect} from "react";
import Tile from "../tile/tile"
import {useSpring, animated} from '@react-spring/web'
import {useDrag} from '@use-gesture/react'
import './chessboard.css'
import Chess from "chess.js"
import Validator from "../validator/validator.js";

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

var initialState = [];
initialState.push({x: 2, y: 0, image: BishopWhiteImg, type: "B", color: "white"})
initialState.push({x: 5, y: 0, image: BishopWhiteImg, type: "B", color: "white"})
initialState.push({x: 2, y: 7, image: BishopBlackImg, type: "b", color: "black"})
initialState.push({x: 5, y: 7, image: BishopBlackImg, type: "b", color: "black"})

initialState.push({x: 0, y: 0, image: RookWhiteImg, type: "R", color: "white"})
initialState.push({x: 7, y: 0, image: RookWhiteImg, type: "R", color: "white"})
initialState.push({x: 7, y: 7, image: RookBlackImg, type: "r", color: "black"})
initialState.push({x: 0, y: 7, image: RookBlackImg, type: "r", color: "white"})

initialState.push({x: 1, y: 0, image: KnightWhiteImg, type: "N", color: "white"})
initialState.push({x: 6, y: 0, image: KnightWhiteImg, type: "N", color: "white"})
initialState.push({x: 1, y: 7, image: KnightBlackImg, type: "n", color: "black"})
initialState.push({x: 6, y: 7, image: KnightBlackImg, type: "n", color: "black"})

initialState.push({x: 3, y: 0, image: QueenWhiteImg, type: "Q", color: "white"})
initialState.push({x: 3, y: 7, image: QueenBlackImg, type: "q", color: "black"})

initialState.push({x: 4, y: 0, image: KingWhiteImg, type: "K", color: "white"})
initialState.push({x: 4, y: 7, image: KingBlackImg, type: "k", color: "black"})


for (let i = 0; i < 8; i++) {
    initialState.push({x: i, y: 6, image: PawnBlackImg, type: "p", color: "black"})
    initialState.push({x: i, y: 1, image: PawnWhiteImg, type: "P", color: "white"})
}


export default function Chessboard() {

    const validator = new Validator();

    // validator.printBoardASCII();

    const [activePiece, setActivePiece] = useState(null);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);

    const chessboardRef = useRef(null);
    let board = [];

    const [pieces, setPieces] = useState(initialState);

    useEffect(() => {

    }, [pieces])


    function grabPiece(e: React.MouseEvent) {

        const element = e.target;
        const chessboard = chessboardRef.current;

        if (element.classList.contains("chess-piece") && chessboard) {
            const gridX = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
            const gridY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));
            setGridX(gridX);
            setGridY(gridY);
            // console.log(e.target)
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            element.style.position = "absolute";
            element.style.left = `${x}px`
            element.style.top = `${y}px`
            setActivePiece(element);
        }
        e.stopPropagation();

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
        e.stopPropagation();
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

                //console.log("CURR " + currentPiece.x,currentPiece.y);
                // if(attackedPiece)
                // {
                //   //  console.log("ATT " + attackedPiece.x,attackedPiece.y);
                // }

                if (validMove) {
                    //UPDATES THE PIECE POSITION
                    //AND IF A PIECE IS ATTACKED, REMOVES IT
                  //  console.log(x,y);
                    const updatedPieces = pieces.reduce((results, piece) => {
                        //ACTIVE
                        if(attackedPiece && attackedPiece.x === piece.x && attackedPiece.y === piece.y)
                        {

                        }
                        else if (piece.x === currentPiece.x && piece.y === currentPiece.y) {

                            results.push(piece);
                            piece.x = x;
                            piece.y = y;
                        }
                        //OTHERS
                        else if (!(piece.x === x && piece.y === y)) {
                            results.push(piece);
                        }

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


    for (let i = verticalAxis.length - 1; i >= 0; i--) {
        for (let j = 0; j < horizontalAxis.length; j++) {
            var number = j + i;
            let img = undefined;

            pieces.forEach((piece) => {
                if ((piece.x === j && piece.y === i)) {
                    img = piece.image;
                }
            })
            board.push(<Tile number={number} image={img} key={`${i},${j}`}/>)
        }
    }

    return <div
        onMouseMove={(e) => movePiece(e)}
        onMouseDown={(e) => grabPiece(e)}
        onMouseUp={(e) => dropPiece(e)}
        id="chessboard"
        ref={chessboardRef}
    >
        {board}
    </div>
}