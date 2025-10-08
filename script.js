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

// Chess Game Implementation
class ChessGame {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.selectedSquare = null;
        this.gameOver = false;
        this.moveHistory = [];
    }

    initializeBoard() {
        // Initialize empty 8x8 board
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Place black pieces (computer)
        board[0] = ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'];
        board[1] = ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'];
        
        // Place white pieces (player)
        board[6] = ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'];
        board[7] = ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'];
        
        return board;
    }

    createBoardHTML() {
        const boardElement = document.getElementById('chess-board');
        boardElement.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = 'chess-square';
                square.dataset.row = row;
                square.dataset.col = col;
                
                // Alternate square colors
                if ((row + col) % 2 === 0) {
                    square.classList.add('light-square');
                } else {
                    square.classList.add('dark-square');
                }
                
                // Add piece if exists
                if (this.board[row][col]) {
                    const piece = document.createElement('span');
                    piece.className = 'chess-piece';
                    piece.textContent = this.board[row][col];
                    square.appendChild(piece);
                }
                
                // Add click event
                square.addEventListener('click', () => this.handleSquareClick(row, col));
                
                boardElement.appendChild(square);
            }
        }
    }

    handleSquareClick(row, col) {
        if (this.gameOver) return;
        
        const piece = this.board[row][col];
        
        // If it's player's turn and they click on their piece
        if (this.currentPlayer === 'white' && piece && this.isWhitePiece(piece)) {
            this.selectPiece(row, col);
        }
        // If a piece is selected and they click on a valid move
        else if (this.selectedPiece && this.isValidMove(this.selectedSquare.row, this.selectedSquare.col, row, col)) {
            this.makeMove(this.selectedSquare.row, this.selectedSquare.col, row, col);
        }
        // If they click on an empty square or opponent piece, deselect
        else {
            this.deselectPiece();
        }
    }

    selectPiece(row, col) {
        this.deselectPiece();
        this.selectedPiece = this.board[row][col];
        this.selectedSquare = { row, col };
        
        // Highlight selected square
        const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        square.classList.add('selected');
        
        // Highlight possible moves
        this.highlightPossibleMoves(row, col);
    }

    deselectPiece() {
        this.selectedPiece = null;
        this.selectedSquare = null;
        
        // Remove all highlights
        document.querySelectorAll('.chess-square').forEach(square => {
            square.classList.remove('selected', 'possible-move');
        });
    }

    highlightPossibleMoves(row, col) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.isValidMove(row, col, r, c)) {
                    const square = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    square.classList.add('possible-move');
                }
            }
        }
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        // Basic validation - can't move to same position
        if (fromRow === toRow && fromCol === toCol) return false;
        
        // Can't capture own piece
        const targetPiece = this.board[toRow][toCol];
        if (targetPiece && this.isWhitePiece(targetPiece) === this.isWhitePiece(this.board[fromRow][fromCol])) {
            return false;
        }
        
        // Simple move validation for pawns
        const piece = this.board[fromRow][fromCol];
        if (piece === '♙') { // White pawn
            // Move forward one square
            if (toRow === fromRow - 1 && toCol === fromCol && !this.board[toRow][toCol]) {
                return true;
            }
            // Move forward two squares from starting position
            if (fromRow === 6 && toRow === 4 && toCol === fromCol && !this.board[toRow][toCol] && !this.board[5][toCol]) {
                return true;
            }
            // Capture diagonally
            if (toRow === fromRow - 1 && Math.abs(toCol - fromCol) === 1 && this.board[toRow][toCol]) {
                return true;
            }
        }
        
        // For other pieces, allow basic movement (simplified for demo)
        return true;
    }

    isWhitePiece(piece) {
        return ['♙', '♖', '♘', '♗', '♕', '♔'].includes(piece);
    }

    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];
        
        // Make the move
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        // Record move
        this.moveHistory.push({
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            piece: piece,
            captured: capturedPiece
        });
        
        // Update display
        this.createBoardHTML();
        this.deselectPiece();
        
        // Check for game over
        if (this.checkGameOver()) {
            this.endGame();
            return;
        }
        
        // Switch turns
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.updateGameStatus();
        
        // Computer move
        if (this.currentPlayer === 'black' && !this.gameOver) {
            setTimeout(() => this.makeComputerMove(), 1000);
        }
    }

    makeComputerMove() {
        if (this.gameOver) return;
        
        // Get all possible moves for black pieces
        const possibleMoves = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && !this.isWhitePiece(piece)) {
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (this.isValidMove(row, col, toRow, toCol)) {
                                possibleMoves.push({ from: { row, col }, to: { row: toRow, col: toCol } });
                            }
                        }
                    }
                }
            }
        }
        
        // Make a random move
        if (possibleMoves.length > 0) {
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            this.makeMove(randomMove.from.row, randomMove.from.col, randomMove.to.row, randomMove.to.col);
        }
    }

    checkGameOver() {
        // Simple game over check - if king is captured
        let whiteKing = false;
        let blackKing = false;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] === '♔') whiteKing = true;
                if (this.board[row][col] === '♚') blackKing = true;
            }
        }
        
        return !whiteKing || !blackKing;
    }

    endGame() {
        this.gameOver = true;
        const status = document.getElementById('game-status');
        if (!this.board.some(row => row.includes('♔'))) {
            status.textContent = 'Computer wins!';
        } else {
            status.textContent = 'You win!';
        }
    }

    updateGameStatus() {
        const status = document.getElementById('game-status');
        if (this.currentPlayer === 'white') {
            status.textContent = 'Your turn (White)';
        } else {
            status.textContent = 'Computer thinking...';
        }
    }

    resetGame() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.selectedSquare = null;
        this.gameOver = false;
        this.moveHistory = [];
        this.createBoardHTML();
        this.updateGameStatus();
    }
}

// Initialize chess game
function initChessGame() {
    const chessBoard = document.getElementById('chess-board');
    if (!chessBoard) return;
    
    const game = new ChessGame();
    game.createBoardHTML();
    game.updateGameStatus();
    
    // Reset button
    const resetBtn = document.getElementById('reset-game');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => game.resetGame());
    }
}
