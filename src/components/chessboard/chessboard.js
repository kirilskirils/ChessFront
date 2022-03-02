import React from "react";
import Tile from "../tile/tile"
import './chessboard.css'

const verticalAxis = ["1","2","3","4","5","6","7","8"];
const horizontalAxis = ["a","b",'c','d','e','f','g','h'];

export default function Chessboard() {
    let board = [];
    for (let i = verticalAxis.length-1 ; i >= 0; i--) {
        for (let j = 0 ; j < horizontalAxis.length ; j++) {
            var diff = i + j;
            board.push(<Tile number = {diff}/>)
        }

    }
    console.log(board);
    return <div id = "chessboard">{board}</div>
}