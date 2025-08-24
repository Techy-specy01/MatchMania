class MatchMania {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.matches = 0;
        this.gameStarted = false;
        this.startTime = null;
        this.timerInterval = null;
        
        // Food emojis for the cards (8 pairs = 16 cards)
        this.cardSymbols = ['🍎', '🍌', '🍇', '🍓', '🍊', '🥝', '🍑', '🍍'];
        
        this.initializeGame();
    }

    initializeGame() {
        this.createCards();
        this.renderBoard();
        this.resetStats();
    }

    createCards() {
        this.cards = [];
        // Create pairs of cards
        this.cardSymbols.forEach(symbol => {
            this.cards.push({ symbol, id: Math.random(), flipped: false, matched: false });
            this.cards.push({ symbol, id: Math.random(), flipped: false, matched: false });
        });
        this.shuffleCards();
    }

    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    renderBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';

        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.index = index;
            cardElement.addEventListener('click', () => this.flipCard(index));

            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">?</div>
                    <div class="card-back">${card.symbol}</div>
                </div>
            `;

            if (card.flipped) {
                cardElement.classList.add('flipped');
            }
            if (card.matched) {
                cardElement.classList.add('matched');
            }

            gameBoard.appendChild(cardElement);
        });
    }

    flipCard(index) {
        const card = this.cards[index];
        const cardElement = document.querySelector(`[data-index="${index}"]`);

        // Don't flip if card is already flipped, matched, or we have 2 cards flipped
        if (card.flipped || card.matched || this.flippedCards.length === 2) {
            return;
        }

        // Start timer on first move
        if (!this.gameStarted) {
            this.startTimer();
            this.gameStarted = true;
        }

        // Flip the card
        card.flipped = true;
        cardElement.classList.add('flipped');
        this.flippedCards.push(index);

        // Check for match if 2 cards are flipped
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateMoves();
            setTimeout(() => this.checkMatch(), 1000);
        }
    }

    checkMatch() {
        const [index1, index2] = this.flippedCards;
        const card1 = this.cards[index1];
        const card2 = this.cards[index2];

        if (card1.symbol === card2.symbol) {
            // Match found
            card1.matched = true;
            card2.matched = true;
            this.matches++;
            this.updateMatches();

            const cardElement1 = document.querySelector(`[data-index="${index1}"]`);
            const cardElement2 = document.querySelector(`[data-index="${index2}"]`);
            cardElement1.classList.add('matched');
            cardElement2.classList.add('matched');

            // Check if game is won
            if (this.matches === 8) {
                this.gameWon();
            }
        } else {
            // No match, flip cards back
            card1.flipped = false;
            card2.flipped = false;

            const cardElement1 = document.querySelector(`[data-index="${index1}"]`);
            const cardElement2 = document.querySelector(`[data-index="${index2}"]`);
            cardElement1.classList.remove('flipped');
            cardElement2.classList.remove('flipped');
        }

        this.flippedCards = [];
    }

    gameWon() {
        clearInterval(this.timerInterval);
        const finalTime = document.getElementById('timer').textContent;
        document.getElementById('finalMoves').textContent = this.moves;
        document.getElementById('finalTime').textContent = finalTime;
        document.getElementById('winMessage').classList.add('show');
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            document.getElementById('timer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    updateMoves() {
        document.getElementById('moves').textContent = this.moves;
    }

    updateMatches() {
        document.getElementById('matches').textContent = `${this.matches}/8`;
    }

    resetStats() {
        this.moves = 0;
        this.matches = 0;
        this.gameStarted = false;
        clearInterval(this.timerInterval);
        document.getElementById('moves').textContent = '0';
        document.getElementById('matches').textContent = '0/8';
        document.getElementById('timer').textContent = '00:00';
        document.getElementById('winMessage').classList.remove('show');
    }

    resetGame() {
        this.flippedCards = [];
        this.cards.forEach(card => {
            card.flipped = false;
            card.matched = false;
        });
        this.renderBoard();
        this.resetStats();
    }

    newGame() {
        this.resetGame();
        this.shuffleCards();
        this.renderBoard();
    }
}

// Initialize the game
let game = new MatchMania();

// Global functions for buttons
function startNewGame() {
    game = new MatchMania();
}

function resetGame() {
    game.resetGame();
}