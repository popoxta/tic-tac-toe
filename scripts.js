const Player = (name, symbol) => {
    return {name, symbol}
}

function playGame() {
    let gameOver = false

    const GameBoard = (function () {
        const cellArea = document.querySelector(".game-board")
        const cells = document.querySelectorAll(".game-cell")

        function createBoard() {
            for (let cell of cells) {
                cellArea.removeChild(cell)
            }

            for (let i = 0; i < 9; i++) {
                const newCell = document.createElement('button')
                newCell.className = "game-cell"
                cellArea.appendChild(newCell)

                const cellRow = Math.floor(i / 3)
                const cellColumn = i % 3

                newCell.addEventListener('click', () => {
                    if (gameOver) {
                        return
                    }
                    let currentPlayer = GameLogic.getCurrentPlayer()
                    if (GameLogic.playRound(cellRow, cellColumn)) {
                        newCell.classList.add(currentPlayer.symbol)
                    }
                })
            }
        }

        function updateMessage(msg) {
            const message = document.querySelector(".game-message")
            message.textContent = msg
        }

        return {updateMessage, createBoard}
    })()
    GameBoard.createBoard()

    const GameLogic = (function gameLogic() {

        const playerOne = Player("Player 1", "X")
        const playerTwo = Player("Player 2", "O")

        let board = [["", "", ""], ["", "", ""], ["", "", ""],]

        let currentPlayer = playerOne
        const getCurrentPlayer = () => currentPlayer

        GameBoard.updateMessage(`${currentPlayer.name}'s turn`)

        function playRound(row, column) {
            if (board[row][column] !== "") {
                return false
            }
            board[row][column] = currentPlayer.symbol
            if (!checkGameOver()) {

                currentPlayer = (currentPlayer === playerOne ? playerTwo : playerOne)
                GameBoard.updateMessage(`${currentPlayer.name}'s turn`)
            }
            return true
        }

        function checkGameOver() {
            const {symbol} = currentPlayer
            if (
                // straight rows
                board[0][0] === symbol && board[0][1] === symbol && board[0][2] === symbol ||
                board[1][0] === symbol && board[1][1] === symbol && board[1][2] === symbol ||
                board[2][0] === symbol && board[2][1] === symbol && board[2][2] === symbol ||
                // straight cols
                board[0][0] === symbol && board[1][0] === symbol && board[2][0] === symbol ||
                board[0][1] === symbol && board[1][1] === symbol && board[2][1] === symbol ||
                board[0][2] === symbol && board[1][2] === symbol && board[2][2] === symbol ||
                //diagonals
                board[0][0] === symbol && board[1][1] === symbol && board[2][2] === symbol ||
                board[0][2] === symbol && board[1][1] === symbol && board[2][0] === symbol
            ) {
                endGame()
                return true
            } else if (!board.flat().includes("")) {
                endGame("draw")
                return true
            }
        }

        function endGame(...arg) {
            gameOver = true
            console.log(arg)
            if (arg.includes("draw")) {
                GameBoard.updateMessage("It's a draw!")
            } else {
                GameBoard.updateMessage(`${currentPlayer.name} wins!`)
            }
        }

        return {playRound, getCurrentPlayer}
    })()
}

playGame()
document.querySelector(".restart").addEventListener('click', () => playGame())
