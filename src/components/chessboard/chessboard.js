import React from "react";
import './chessboard.css'

const horizontalAxis = ["a","b",'c','d','e','f','g','h'];
const verticalAxis = ["1","2","3","4","5","6","7","8"];

export default function Chessboard() {
    let board = [];
    for (let i = 0 ; i < horizontalAxis.length ; i++) {
        for (let j = 0 ; j < verticalAxis.length ; j++) {
            board.push(<div className="tile">[{horizontalAxis[i]}{verticalAxis[j]}] </div>)
        }

    }
    return <div id = "chessboard">{board}</div>
}