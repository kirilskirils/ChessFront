import "./tile.css"
import React from "react";

interface Props
{
    number: number;
}

export default function Tile({number})
{
    if(number % 2 === 0)
    {
        return <div className="tile black-tile"></div>
    }
    else
    {
        return <div className="tile white-tile"></div>

    }
}