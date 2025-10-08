// Portfolio JavaScript - Data Structures Theme

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initSkillBars();
    initDataStructureAnimations();
    initTypingEffect();
    initChessGame();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project-card, .timeline-item, .skill-item, .stat-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                skillBar.style.width = width;
                skillBar.style.opacity = '1';
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        bar.style.width = '0%';
        bar.style.opacity = '0';
        skillObserver.observe(bar);
    });
}


// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4ecdc4' : type === 'error' ? '#ff6b6b' : '#00d4ff'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Data structure animations
function initDataStructureAnimations() {
    // Binary tree node interactions
    const nodes = document.querySelectorAll('.node');
    nodes.forEach(node => {
        node.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
            this.style.zIndex = '10';
        });
        
        node.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.zIndex = '1';
        });
    });
    
    // Array element interactions
    const arrayElements = document.querySelectorAll('.array-element');
    arrayElements.forEach((element, index) => {
        element.addEventListener('click', function() {
            // Highlight the clicked element
            arrayElements.forEach(el => el.classList.remove('highlighted'));
            this.classList.add('highlighted');
            
            // Add highlight style
            this.style.background = 'linear-gradient(135deg, #ff6b6b, #f0932b)';
            this.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                this.style.background = 'linear-gradient(135deg, #00d4ff, #4ecdc4)';
                this.style.transform = 'scale(1)';
                this.classList.remove('highlighted');
            }, 1000);
        });
    });
}

// Typing effect for hero title
function initTypingEffect() {
    const titleName = document.querySelector('.title-name');
    if (titleName) {
        const text = titleName.textContent;
        titleName.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                titleName.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a delay
        setTimeout(typeWriter, 1000);
    }
}

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual) {
        const rate = scrolled * -0.5;
        heroVisual.style.transform = `translateY(${rate}px)`;
    }
});

// Dynamic project card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Smooth reveal animation for sections
function revealOnScroll() {
    const reveals = document.querySelectorAll('.section-title, .about-text, .contact-info');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Add CSS for active states
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    .array-element.highlighted {
        box-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
    }
    
    .fade-in-up {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .fade-in-up.active {
        opacity: 1;
        transform: translateY(0);
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
`;
document.head.appendChild(style);

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Scroll-based animations and effects
    revealOnScroll();
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Animate hero elements in sequence
    const heroElements = document.querySelectorAll('.hero-title, .hero-description, .hero-buttons');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Initialize hero elements with hidden state
document.addEventListener('DOMContentLoaded', function() {
    const heroElements = document.querySelectorAll('.hero-title, .hero-description, .hero-buttons');
    heroElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
    });
});

// Simple Chess Game Implementation
let currentPlayer = 'white';
let selectedSquare = null;
let gameOver = false;
let moveCount = 0;

// Initialize chess game
function initChessGame() {
    
    
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
    
    
    updateGameStatus();
}

function handleSquareClick(event) {
    if (gameOver) return;
    
    const square = event.currentTarget;
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    const piece = square.querySelector('.chess-piece');
    
    // If it's player's turn and they click on their piece
    if (currentPlayer === 'white' && piece && isWhitePiece(piece)) {
        selectPiece(square, row, col);
    }
    // If a piece is selected and they click on a valid move
    else if (selectedSquare && isValidMove(selectedSquare.row, selectedSquare.col, row, col)) {
        makeMove(selectedSquare.row, selectedSquare.col, row, col);
    }
    // If they click on an empty square or opponent piece, deselect
    else {
        deselectPiece();
    }
}

function selectPiece(square, row, col) {
    deselectPiece();
    selectedSquare = { square, row, col };
    square.classList.add('selected');
    highlightPossibleMoves(row, col);
    
    // Check if this piece has any legal moves
    let hasLegalMoves = false;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (isValidMove(row, col, r, c)) {
                hasLegalMoves = true;
                break;
            }
        }
        if (hasLegalMoves) break;
    }
    
    // If no legal moves, deselect and check if player has any moves at all
    if (!hasLegalMoves) {
        deselectPiece();
        checkIfPlayerHasAnyMoves();
    }
}

function checkIfPlayerHasAnyMoves() {
    // Check if current player has any legal moves with any piece
    const currentPlayerPieces = [];
    document.querySelectorAll('.chess-square').forEach(square => {
        const piece = square.querySelector('.chess-piece');
        if (piece && isWhitePiece(piece) === (currentPlayer === 'white')) {
            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            currentPlayerPieces.push({ square, row, col, piece });
        }
    });
    
    // Check if any piece has legal moves
    let hasAnyLegalMoves = false;
    for (let piece of currentPlayerPieces) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (isValidMove(piece.row, piece.col, r, c)) {
                    hasAnyLegalMoves = true;
                    break;
                }
            }
            if (hasAnyLegalMoves) break;
        }
        if (hasAnyLegalMoves) break;
    }
    
    // If no legal moves, game over
    if (!hasAnyLegalMoves) {
        const isInCheck = isKingInCheck(currentPlayer);
        if (isInCheck) {
            const winner = currentPlayer === 'white' ? 'Computer' : 'You';
            endGame(`Checkmate! ${winner} wins!`);
        } else {
            endGame('Stalemate! Game is a draw!');
        }
    }
}

function deselectPiece() {
    selectedSquare = null;
    document.querySelectorAll('.chess-square').forEach(sq => {
        sq.classList.remove('selected', 'possible-move');
    });
}

function highlightPossibleMoves(row, col) {
    const fromSquare = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const piece = fromSquare.querySelector('.chess-piece');
    if (!piece) return;
    
    const pieceType = piece.textContent;
    
    // Clear previous highlights
    document.querySelectorAll('.chess-square').forEach(sq => {
        sq.classList.remove('possible-move');
    });
    
    // Get all possible moves for this piece
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (isValidMove(row, col, r, c)) {
                const square = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                if (square) {
                    square.classList.add('possible-move');
                }
            }
        }
    }
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    // Can't move to same position
    if (fromRow === toRow && fromCol === toCol) return false;
    
    const fromSquare = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`);
    const toSquare = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
    const fromPiece = fromSquare.querySelector('.chess-piece');
    const toPiece = toSquare.querySelector('.chess-piece');
    
    if (!fromPiece) return false;
    
    const pieceType = fromPiece.textContent;
    const isWhite = fromPiece.classList.contains('white-piece');
    
    // Can't capture own piece
    if (toPiece) {
        const toPieceIsWhite = toPiece.classList.contains('white-piece');
        if (isWhite === toPieceIsWhite) {
            return false;
        }
    }
    
    // Piece-specific move validation
    let isValid = false;
    switch (pieceType) {
        case '♙': // White pawn
            isValid = isValidPawnMove(fromRow, fromCol, toRow, toCol, true, toPiece);
            break;
        case '♟': // Black pawn
            isValid = isValidPawnMove(fromRow, fromCol, toRow, toCol, false, toPiece);
            break;
        case '♖': // White rook
        case '♜': // Black rook
            isValid = isValidRookMove(fromRow, fromCol, toRow, toCol);
            break;
        case '♘': // White knight
        case '♞': // Black knight
            isValid = isValidKnightMove(fromRow, fromCol, toRow, toCol);
            break;
        case '♗': // White bishop
        case '♝': // Black bishop
            isValid = isValidBishopMove(fromRow, fromCol, toRow, toCol);
            break;
        case '♕': // White queen
        case '♛': // Black queen
            isValid = isValidQueenMove(fromRow, fromCol, toRow, toCol);
            break;
        case '♔': // White king
        case '♚': // Black king
            isValid = isValidKingMove(fromRow, fromCol, toRow, toCol);
            break;
        default:
            isValid = false;
    }
    
    return isValid;
}

function isValidPawnMove(fromRow, fromCol, toRow, toCol, isWhite, toPiece) {
    const direction = isWhite ? -1 : 1;
    const startRow = isWhite ? 6 : 1;
    
    // Move forward one square (only if destination is empty)
    if (toRow === fromRow + direction && toCol === fromCol && !toPiece) {
        return true;
    }
    
    // Move forward two squares from starting position (only if destination is empty)
    if (fromRow === startRow && toRow === fromRow + 2 * direction && toCol === fromCol && !toPiece) {
        // Check if path is clear
        const middleSquare = document.querySelector(`[data-row="${fromRow + direction}"][data-col="${fromCol}"]`);
        const middlePiece = middleSquare.querySelector('.chess-piece');
        if (!middlePiece) {
            return true;
        }
    }
    
    // Capture diagonally (only if there's an enemy piece)
    if (toRow === fromRow + direction && Math.abs(toCol - fromCol) === 1 && toPiece) {
        // Make sure it's an enemy piece
        const isEnemyPiece = isWhite ? !toPiece.classList.contains('white-piece') : toPiece.classList.contains('white-piece');
        if (isEnemyPiece) {
            return true;
        }
    }
    
    return false;
}

function isValidRookMove(fromRow, fromCol, toRow, toCol) {
    // Rook moves horizontally or vertically
    if (fromRow !== toRow && fromCol !== toCol) return false;
    
    return isPathClear(fromRow, fromCol, toRow, toCol);
}

function isValidKnightMove(fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    
    // Knight moves in L-shape
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

function isValidBishopMove(fromRow, fromCol, toRow, toCol) {
    // Bishop moves diagonally
    if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) return false;
    
    return isPathClear(fromRow, fromCol, toRow, toCol);
}

function isValidQueenMove(fromRow, fromCol, toRow, toCol) {
    // Queen combines rook and bishop moves
    return isValidRookMove(fromRow, fromCol, toRow, toCol) || isValidBishopMove(fromRow, fromCol, toRow, toCol);
}

function isValidKingMove(fromRow, fromCol, toRow, toCol) {
    // King moves one square in any direction
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    return rowDiff <= 1 && colDiff <= 1;
}

function isPathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
    
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;
    
    while (currentRow !== toRow || currentCol !== toCol) {
        const square = document.querySelector(`[data-row="${currentRow}"][data-col="${currentCol}"]`);
        if (square.querySelector('.chess-piece')) {
            return false; // Path is blocked
        }
        currentRow += rowStep;
        currentCol += colStep;
    }
    
    return true;
}

function isWhitePiece(pieceElement) {
    return pieceElement && pieceElement.classList.contains('white-piece');
}

function makeMove(fromRow, fromCol, toRow, toCol) {
    const fromSquare = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`);
    const toSquare = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
    
    const piece = fromSquare.querySelector('.chess-piece');
    if (piece) {
        // Store the captured piece (if any)
        const capturedPiece = toSquare.querySelector('.chess-piece');
        
        // Make the move (preserve classes)
        toSquare.innerHTML = '';
        toSquare.appendChild(piece);
        
        // Check if this move puts own king in check
        if (isKingInCheck(currentPlayer)) {
            // Move puts own king in check - undo the move
            toSquare.innerHTML = '';
            if (capturedPiece) {
                toSquare.appendChild(capturedPiece);
            }
            fromSquare.appendChild(piece);
            return;
        }
    }
    
    deselectPiece();
    
    // Increment move count
    moveCount++;
    
    // Switch turns
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    updateGameStatus();
    
    // Computer move
    if (currentPlayer === 'black' && !gameOver) {
        setTimeout(() => makeComputerMove(), 1000);
    }
}

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
    
    // Collect all possible moves for all black pieces
    const allPossibleMoves = [];
    
    blackPieces.forEach(piece => {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (isValidMove(piece.row, piece.col, r, c)) {
                    allPossibleMoves.push({
                        from: { row: piece.row, col: piece.col },
                        to: { row: r, col: c },
                        piece: piece.piece
                    });
                }
            }
        }
    });
    
    // Make a random legal move
    if (allPossibleMoves.length > 0) {
        const randomMove = allPossibleMoves[Math.floor(Math.random() * allPossibleMoves.length)];
        
        // Make the move directly (without calling makeMove to avoid recursion)
        const fromSquare = document.querySelector(`[data-row="${randomMove.from.row}"][data-col="${randomMove.from.col}"]`);
        const toSquare = document.querySelector(`[data-row="${randomMove.to.row}"][data-col="${randomMove.to.col}"]`);
        const piece = fromSquare.querySelector('.chess-piece');
        
        if (piece) {
            toSquare.innerHTML = '';
            toSquare.appendChild(piece);
        }
        
        // Switch back to white player
        currentPlayer = 'white';
        updateGameStatus();
        
        // Don't check for game over automatically - let the game continue
        
    } else {
        endGame('Computer has no legal moves - You win!');
    }
}

function checkGameOver() {
    if (gameOver) return; // Already game over
    
    // Only check for game over if we have enough pieces on the board
    const allPieces = document.querySelectorAll('.chess-piece');
    if (allPieces.length < 4) {
        // Too few pieces - game might be over
        const whitePieces = document.querySelectorAll('.chess-piece.white-piece');
        const blackPieces = document.querySelectorAll('.chess-piece.black-piece');
        
        if (whitePieces.length === 0) {
            endGame('Computer wins! All white pieces captured!');
        } else if (blackPieces.length === 0) {
            endGame('You win! All black pieces captured!');
        }
        return;
    }
    
    // For now, let the game continue unless there are very few pieces
    // We'll add proper checkmate detection later
}

function isKingInCheck(player) {
    const kingPiece = player === 'white' ? '♔' : '♚';
    
    // Find the king
    let kingRow = -1, kingCol = -1;
    document.querySelectorAll('.chess-square').forEach(square => {
        const piece = square.querySelector('.chess-piece');
        if (piece && piece.textContent === kingPiece) {
            kingRow = parseInt(square.dataset.row);
            kingCol = parseInt(square.dataset.col);
        }
    });
    
    if (kingRow === -1) return false; // King not found
    
    // Check if any opponent piece can attack the king
    const opponentPieces = [];
    document.querySelectorAll('.chess-square').forEach(square => {
        const piece = square.querySelector('.chess-piece');
        if (piece && isWhitePiece(piece) !== (player === 'white')) {
            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            opponentPieces.push({ row, col, piece });
        }
    });
    
    for (let piece of opponentPieces) {
        if (isValidMove(piece.row, piece.col, kingRow, kingCol)) {
            return true; // King is in check
        }
    }
    
    return false;
}

function endGame(message) {
    gameOver = true;
    const status = document.getElementById('game-status');
    status.textContent = message;
}

function updateGameStatus() {
    const status = document.getElementById('game-status');
    if (currentPlayer === 'white') {
        status.textContent = 'Your turn (White)';
    } else {
        status.textContent = 'Computer thinking...';
    }
}

function resetGame() {
    // Reset game state
    currentPlayer = 'white';
    selectedSquare = null;
    gameOver = false;
    moveCount = 0;
    
    // Reload the page to reset the board
    location.reload();
}

