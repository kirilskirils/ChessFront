import "bootstrap/dist/css/bootstrap.min.css";

export default function GameRow({number, firstPlayer, secondPlayer, gameStatus, joinEvent}) {

    return (
        <tr>
            <td>{number}</td>
            <td>{firstPlayer}</td>
            <td>{secondPlayer}</td>
            <td>{gameStatus}</td>
            <td>
                {!secondPlayer ? <button onClick={() => joinEvent(number)}>Join</button> : null}
            </td>
        </tr>
    );
}