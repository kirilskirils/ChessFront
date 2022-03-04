import Chess from "chess.js"


const chess = new Chess()
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", 'c', 'd', 'e', 'f', 'g', 'h'];

export default class validator
{

    printBoard()
    {
        //console.log(chess.board());
    }
    printBoardASCIIprintBoardASCII()
    {
        console.log(chess.ascii());
    }


    isValidMove(px,py,x,y,type)
    {
        var move = chess.move(horizontalAxis[px]+verticalAxis[py]+horizontalAxis[x]+verticalAxis[y], { sloppy: true });
        // console.log("FROM",horizontalAxis[px]+verticalAxis[py]);
        // console.log("TO",horizontalAxis[x],verticalAxis[y]);
        //console.log(type);
        console.log(move);

        if (move != null)
        {
            console.log(chess.ascii());
            return true
        }
        return false;
    }
}