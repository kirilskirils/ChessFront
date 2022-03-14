import "./tile.css"
import React from "react";

/**
 * Board tile element
 * @param number x+y coordinate number sum, if sum equal tile is black, otherwise white
 * @param image image to put on piece
 */
export default function Tile({number, image}) {

    if (number % 2 === 0) {
        return (
            <div className="tile black-tile">
                {image && <div style={{backgroundImage: `url(${image})`}} className="chess-piece"></div>}
            </div>
        );

    } else {

        return (
            <div className="tile white-tile">
                {image && <div style={{backgroundImage: `url(${image})`}} className="chess-piece"></div>}
            </div>
        );
    }
}