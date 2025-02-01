function Gameboard() {
	const rows = 3;
	const columns = 3;
	let tileNumber = 1;
	let board = [];

	for (let i = 0; i < rows; i++) {
		board[i] = [];
		for (let j = 0; j < columns; j++) {
			board[i][j] = Tile(tileNumber);
			tileNumber++;
		}
	}
	const selectTile = (chosenTile, playerValue) => {
		let continueGame = true;
		for (let i = 0; i < rows; i++) {
			const tileIndex = board[i].findIndex(
				(tile) => tile.getValue() === parseInt(chosenTile)
			);
			if (tileIndex !== -1) {
				board[i][tileIndex].setValue(playerValue);
				return continueGame;
			}
			if (rows.length - 1 === i) {
				continueGame = false;
				return continueGame;
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
			[2, 4, 6],
		];
		const flatBoard = board.flat().map((tile) => tile.getValue());
		for (const positions of winningPositions) {
			const [a, b, c] = positions;
			if (
				flatBoard[a] === playerToken &&
				flatBoard[b] === playerToken &&
				flatBoard[c] === playerToken
			) {
				return true;
			}
		}
		return false;
	};

	const resetBoard = () => {
		board = [];
		tileNumber = 1;
		for (let i = 0; i < rows; i++) {
			board[i] = [];
			for (let j = 0; j < columns; j++) {
				board[i][j] = Tile(tileNumber);
				tileNumber++;
			}
		}
	};

	const getBoard = () => board;
	return { selectTile, checkResult, getBoard, resetBoard };
}

function Tile(tileValue) {
	let value = tileValue;

	const getValue = () => {
		return value;
	};

	const setValue = (playerToken) => {
		value = playerToken;
	};

	return { getValue, setValue };
}

function GameController(
	playerOneName = 'Player One',
	playerTwoName = 'Player Two'
) {
	const players = [
		{
			name: playerOneName,
			token: 'X',
		},
		{
			name: playerTwoName,
			token: 'O',
		},
	];
	const board = Gameboard();
	let activePlayer = players[0];
	const getActivePlayer = () => activePlayer;
	const switchActivePlayer = () => {
		[activePlayer] = players.filter(
			(player) => !Object.is(activePlayer, player)
		);
	};

	const checkResult = () => {
		const result = board.checkResult(activePlayer.token);
		return result;
	};

	const restartGame = () => {
		board.resetBoard();
		activePlayer = players[0];
	};

	const playRound = (tile) => {
		board.selectTile(tile, activePlayer.token);
		if (checkResult()) return;
		switchActivePlayer();
	};

	return {
		playRound,
		getBoard: board.getBoard,
		getActivePlayer,
		checkResult,
		restartGame,
	};
}

function displayController() {
	const game = GameController();
	const playerTurnDiv = document.querySelector('.player');
	const boardDiv = document.querySelector('.board');
	const resetButton = document.querySelector('.reset');

	const updateScreen = () => {
		boardDiv.textContent = '';
		const board = game.getBoard();
		const activePlayer = game.getActivePlayer();
		playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
		board.forEach((row) => {
			row.forEach((tile) => {
				const tileButton = document.createElement('button');
				tileButton.dataset.tile = tile.getValue();
				tileButton.textContent = tile.getValue();
				boardDiv.appendChild(tileButton);
			});
		});
	};

	function clickHandlerBoard(e) {
		const selectedTile = e.target.dataset.tile;
		if (!selectedTile) return;
		game.playRound(selectedTile);
		const result = game.checkResult();
		const activePlayer = game.getActivePlayer();
		updateScreen();
		if (result) {
			playerTurnDiv.textContent = `${activePlayer.name} wins`;
			return;
		}
	}

	resetButton.addEventListener('click', () => {
		game.restartGame();
		updateScreen();
	});

	boardDiv.addEventListener('click', clickHandlerBoard);
	updateScreen();
}

displayController();
