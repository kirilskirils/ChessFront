import "./tile.css"
import React from "react";
import BishopBlackImg from "../../assets/bishop_black.png";

export default function Tile({number,image})
{
    console.log(number)
    if(number % 2 === 0)
    {
        return <div className="tile black-tile"><img src={image}/></div>
    }
    else
    {
        return <div className="tile white-tile"><img src={image}/></div>
    }
}