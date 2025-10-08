// Simple Chess Game - No External Dependencies

// Game state
let currentPlayer = 'white';
let selectedSquare = null;
let gameOver = false;

// Initialize the chess game
function initSimpleChess() {
    console.log('Initializing simple chess game...');
    
    // Add click events to all squares
    const squares = document.querySelectorAll('.chess-square');
    squares.forEach(square => {
        square.addEventListener('click', handleSquareClick);
    });
    
    // Reset button
    const resetBtn = document.getElementById('reset-game');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetGame);
    }
    
    // Initialize game state
    updateGameStatus();
    console.log('Chess game initialized successfully!');
}

// Handle square clicks
function handleSquareClick(event) {
    if (gameOver) return;
    
    const square = event.currentTarget;
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    
    if (selectedSquare) {
        // Try to make a move
        if (makeMove(selectedSquare.row, selectedSquare.col, row, col)) {
            // Move successful
            deselectPiece();
            
            // Switch turns
            currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
            updateGameStatus();
            
            // Computer move after a delay
            if (currentPlayer === 'black' && !gameOver) {
                setTimeout(() => {
                    makeComputerMove();
                }, 1000);
            }
        } else {
            // Invalid move, select new piece
            selectPiece(square, row, col);
        }
    } else {
        // Select piece
        selectPiece(square, row, col);
    }
}

// Select a piece
function selectPiece(square, row, col) {
    const piece = square.querySelector('.chess-piece');
    if (piece && isWhitePiece(piece) === (currentPlayer === 'white')) {
        selectedSquare = { square, row, col };
        square.classList.add('selected');
    }
}

// Deselect piece
function deselectPiece() {
    if (selectedSquare) {
        selectedSquare.square.classList.remove('selected');
        selectedSquare = null;
    }
}

// Check if piece is white
function isWhitePiece(piece) {
    return piece.classList.contains('white-piece');
}

// Make a move
function makeMove(fromRow, fromCol, toRow, toCol) {
    const fromSquare = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`);
    const toSquare = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
    
    const piece = fromSquare.querySelector('.chess-piece');
    if (!piece) return false;
    
    // Check if it's a valid move
    if (!isValidMove(fromRow, fromCol, toRow, toCol)) {
        return false;
    }
    
    // Make the move
    const capturedPiece = toSquare.querySelector('.chess-piece');
    toSquare.innerHTML = '';
    toSquare.appendChild(piece);
    
    // Check for game over (king capture)
    if (capturedPiece && (capturedPiece.textContent === '♔' || capturedPiece.textContent === '♚')) {
        endGame(capturedPiece.textContent === '♔' ? 'Black wins!' : 'White wins!');
    }
    
    return true;
}

// Check if move is valid (simplified)
function isValidMove(fromRow, fromCol, toRow, toCol) {
    const fromSquare = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`);
    const toSquare = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
    
    const piece = fromSquare.querySelector('.chess-piece');
    const targetPiece = toSquare.querySelector('.chess-piece');
    
    if (!piece) return false;
    
    // Can't capture own piece
    if (targetPiece && isWhitePiece(piece) === isWhitePiece(targetPiece)) {
        return false;
    }
    
    // Basic move validation for each piece
    const pieceType = piece.textContent;
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    
    switch (pieceType) {
        case '♙': // White pawn
            if (fromCol === toCol && !targetPiece) {
                return fromRow === 6 ? (toRow === 4 || toRow === 5) : (toRow === fromRow - 1);
            }
            return colDiff === 1 && toRow === fromRow - 1 && targetPiece;
            
        case '♟': // Black pawn
            if (fromCol === toCol && !targetPiece) {
                return fromRow === 1 ? (toRow === 2 || toRow === 3) : (toRow === fromRow + 1);
            }
            return colDiff === 1 && toRow === fromRow + 1 && targetPiece;
            
        case '♖': // Rook
        case '♜':
            return (rowDiff === 0 || colDiff === 0) && isPathClear(fromRow, fromCol, toRow, toCol);
            
        case '♗': // Bishop
        case '♝':
            return rowDiff === colDiff && isPathClear(fromRow, fromCol, toRow, toCol);
            
        case '♘': // Knight
        case '♞':
            return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
            
        case '♕': // Queen
        case '♛':
            return (rowDiff === colDiff || rowDiff === 0 || colDiff === 0) && isPathClear(fromRow, fromCol, toRow, toCol);
            
        case '♔': // King
        case '♚':
            return rowDiff <= 1 && colDiff <= 1;
            
        default:
            return false;
    }
}

// Check if path is clear for sliding pieces
function isPathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
    
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;
    
    while (currentRow !== toRow || currentCol !== toCol) {
        const square = document.querySelector(`[data-row="${currentRow}"][data-col="${currentCol}"]`);
        if (square.querySelector('.chess-piece')) {
            return false;
        }
        currentRow += rowStep;
        currentCol += colStep;
    }
    
    return true;
}

// Make computer move
function makeComputerMove() {
    if (gameOver) return;
    
    // Get all black pieces
    const blackPieces = [];
    document.querySelectorAll('.chess-square').forEach(square => {
        const piece = square.querySelector('.chess-piece');
        if (piece && !isWhitePiece(piece)) {
            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            blackPieces.push({ square, row, col, piece });
        }
    });
    
    // Find all possible moves
    const allPossibleMoves = [];
    
    blackPieces.forEach(piece => {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (isValidMove(piece.row, piece.col, r, c)) {
                    allPossibleMoves.push({
                        from: { row: piece.row, col: piece.col },
                        to: { row: r, col: c }
                    });
                }
            }
        }
    });
    
    // Make a random move
    if (allPossibleMoves.length > 0) {
        const randomMove = allPossibleMoves[Math.floor(Math.random() * allPossibleMoves.length)];
        makeMove(randomMove.from.row, randomMove.from.col, randomMove.to.row, randomMove.to.col);
        
        // Switch back to white
        currentPlayer = 'white';
        updateGameStatus();
    } else {
        endGame('Computer has no legal moves - You win!');
    }
}

// Update game status
function updateGameStatus() {
    const status = document.getElementById('game-status');
    if (status) {
        if (gameOver) {
            status.textContent = 'Game Over';
        } else {
            status.textContent = currentPlayer === 'white' ? 'Your turn (White)' : 'Computer thinking...';
        }
    }
}

// End game
function endGame(message) {
    gameOver = true;
    const status = document.getElementById('game-status');
    if (status) {
        status.textContent = message;
    }
}

// Reset game
function resetGame() {
    currentPlayer = 'white';
    selectedSquare = null;
    gameOver = false;
    
    // Reload the page to reset the board
    location.reload();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initSimpleChess();
    }, 100);
});
