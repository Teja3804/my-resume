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

// Initialize chess game
function initChessGame() {
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
    
    updateGameStatus();
    console.log('Chess game initialized successfully');
}

function handleSquareClick(event) {
    if (gameOver) return;
    
    const square = event.currentTarget;
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    const piece = square.querySelector('.chess-piece');
    
    // If it's player's turn and they click on their piece
    if (currentPlayer === 'white' && piece && isWhitePiece(piece.textContent)) {
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
}

function deselectPiece() {
    selectedSquare = null;
    document.querySelectorAll('.chess-square').forEach(sq => {
        sq.classList.remove('selected', 'possible-move');
    });
}

function highlightPossibleMoves(row, col) {
    // Simple highlighting - show adjacent squares as possible moves
    for (let r = Math.max(0, row - 1); r <= Math.min(7, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(7, col + 1); c++) {
            if (r !== row || c !== col) {
                const square = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                if (square) {
                    square.classList.add('possible-move');
                }
            }
        }
    }
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    // Basic validation - can't move to same position
    if (fromRow === toRow && fromCol === toCol) return false;
    
    const targetSquare = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
    const targetPiece = targetSquare.querySelector('.chess-piece');
    
    // Can't capture own piece
    if (targetPiece && isWhitePiece(targetPiece.textContent)) {
        return false;
    }
    
    // Simple move validation - allow moves to adjacent squares
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    return rowDiff <= 1 && colDiff <= 1;
}

function isWhitePiece(piece) {
    return ['♙', '♖', '♘', '♗', '♕', '♔'].includes(piece);
}

function makeMove(fromRow, fromCol, toRow, toCol) {
    const fromSquare = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`);
    const toSquare = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
    
    const piece = fromSquare.querySelector('.chess-piece');
    if (piece) {
        // Move the piece
        toSquare.innerHTML = '';
        toSquare.appendChild(piece);
    }
    
    deselectPiece();
    
    // Check for game over (simplified)
    if (checkGameOver()) {
        endGame();
        return;
    }
    
    // Switch turns
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    updateGameStatus();
    
    // Computer move (simplified)
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
        if (piece && !isWhitePiece(piece.textContent)) {
            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            blackPieces.push({ square, row, col, piece: piece.textContent });
        }
    });
    
    // Make a random move
    if (blackPieces.length > 0) {
        const randomPiece = blackPieces[Math.floor(Math.random() * blackPieces.length)];
        const possibleMoves = [];
        
        // Find possible moves for this piece
        for (let r = Math.max(0, randomPiece.row - 1); r <= Math.min(7, randomPiece.row + 1); r++) {
            for (let c = Math.max(0, randomPiece.col - 1); c <= Math.min(7, randomPiece.col + 1); c++) {
                if (r !== randomPiece.row || c !== randomPiece.col) {
                    const targetSquare = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    const targetPiece = targetSquare.querySelector('.chess-piece');
                    if (!targetPiece || isWhitePiece(targetPiece.textContent)) {
                        possibleMoves.push({ row: r, col: c });
                    }
                }
            }
        }
        
        if (possibleMoves.length > 0) {
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            makeMove(randomPiece.row, randomPiece.col, randomMove.row, randomMove.col);
        }
    }
}

function checkGameOver() {
    // Simple game over check - if white king is captured
    const whiteKing = document.querySelector('.chess-piece');
    if (!whiteKing || whiteKing.textContent !== '♔') {
        return true;
    }
    return false;
}

function endGame() {
    gameOver = true;
    const status = document.getElementById('game-status');
    status.textContent = 'Game Over!';
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
    // Reload the page to reset the board
    location.reload();
}
