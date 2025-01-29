function Gameboard() {
    const rows = 3;
    const columns = 3;
    let tileNumber = 1;
    const board = [];
  
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i][j] = Tile(tileNumber);
        tileNumber++
      }
    }
    const selectTile = (chosenTile, playerValue) => {
        let continueGame = true;
        for (let i = 0; i < rows; i++) {
            const tileIndex = board[i].findIndex(tile => tile.getValue() === chosenTile);
            if (tileIndex !== -1) {
                board[i][tileIndex].setValue(playerValue);
                return continueGame;
            }
            if(rows.length - 1 === i) {
                console.log(`Tile ${chosenTile} already taken`)
                continueGame = false
                return continueGame
            }
        }
    };

    const checkResult = (playerToken) => {
        const winningPositions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        // Convert the board to a 1D array for easy indexing
        const flatBoard = board.flat().map(tile => tile.getValue());
        // Check if any of the winning positions contain all the same player token
        for (const positions of winningPositions) {
            const [a, b, c] = positions;

            if (flatBoard[a] === playerToken && 
                flatBoard[b] === playerToken && 
                flatBoard[c] === playerToken) {
                
                console.log(`Player ${playerToken} wins!`);
                return true; // Winner found
            }
        }

        return false; // No winner yet
    }

    const showBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((tile) => tile.getValue()))
        console.log('update board', boardWithCellValues);
      };

    return { board, selectTile, showBoard, checkResult }
}


function Tile(tileValue) {
    let value = tileValue

    const getValue = () => {
        return value
    }

    const setValue = (playerToken) => {
        value = playerToken
    }

    return { getValue, setValue }
}


function GameController( playerOneName = "Player One", playerTwoName = "Player Two") {
    const players = [
        {
            name: playerOneName,
            token: "X"
        },
        {
            name: playerTwoName,
            token: "O"
        }
    ]
    const board = Gameboard()
        let activePlayer = players[0]
        const switchActivePlayer = () => {
            [activePlayer] = players.filter(player => !Object.is(activePlayer, player))
            board.showBoard()
            console.log(`It is ${activePlayer.name}'s turn`)
    }

    const checkResult = (playerToken) => {
        console.log('checking result')
       board.checkResult(playerToken)

    }
    let numberOfTurns = 1;

    const playRound = (tile) => {
        const continueGame = board.selectTile(tile, activePlayer.token)
        if(numberOfTurns > 0) checkResult(activePlayer.token)
        if(!continueGame) {
            board.showBoard()
            console.log('Pick another tile')
            return
        } else {
            switchActivePlayer()
            numberOfTurns++
        }
    }
    console.log("Place Token by choosing tile number")
    board.showBoard()
    console.log(`It is ${activePlayer.name}'s turn`)

    return { playRound }
}

const game = GameController()





