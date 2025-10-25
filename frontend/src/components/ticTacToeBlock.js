import React, { useState, useEffect, useCallback } from 'react';
import '../styles/ticTacToeBlock.css';

const TicTacToeBlock = ({ difficulty = 1, onSuccess, onFailure, playSound }) => {
    // Board state: null = empty, 0 = O (AI), 1 = X (Player)
    const [board, setBoard] = useState(Array(9).fill(null));
    const [playerTurn, setPlayerTurn] = useState(true); // true = player's turn, false = AI's turn
    const [gameOver, setGameOver] = useState(false);
    const [result, setResult] = useState(null); // null, 'player', 'ai', 'draw'
    const [verified, setVerified] = useState(null);
    const [aiShouldMove, setAiShouldMove] = useState(false);
    
    // Lines to check for winner (horizontal, vertical, diagonal)
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
        [0, 4, 8], [2, 4, 6]             // diagonal
    ];
    
    // Reset game
    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setPlayerTurn(true);
        setGameOver(false);
        setResult(null);
        setVerified(null);
        setAiShouldMove(false);
    };
    
    // Check if there's a winner
    const checkWinner = useCallback((board) => {
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
                return board[a]; // 0 = AI, 1 = Player
            }
        }
        return null;
    }, [lines]);
    
    // Check if board is full (draw)
    const checkDraw = useCallback((board) => {
        return board.every(cell => cell !== null);
    }, []);
    
    // Minimax algorithm for AI
    const minimax = useCallback((board, depth, isMaximizing) => {
        // Increase AI difficulty based on level
        // Higher difficulty means AI looks more moves ahead
        const maxDepth = Math.min(difficulty + 3, 9);
        if (depth >= maxDepth) return 0;
        
        const winner = checkWinner(board);
        
        // Terminal states
        if (winner === 0) return 10 - depth; // AI wins
        if (winner === 1) return depth - 10; // Player wins
        if (checkDraw(board)) return 0; // Draw
        
        if (isMaximizing) {
            // AI's turn (maximizing)
            let maxScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    const newBoard = [...board];
                    newBoard[i] = 0; // AI move
                    const score = minimax(newBoard, depth + 1, false);
                    maxScore = Math.max(maxScore, score);
                }
            }
            return maxScore;
        } else {
            // Player's turn (minimizing)
            let minScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    const newBoard = [...board];
                    newBoard[i] = 1; // Player move
                    const score = minimax(newBoard, depth + 1, true);
                    minScore = Math.min(minScore, score);
                }
            }
            return minScore;
        }
    }, [difficulty, checkWinner, checkDraw]);
    

    // Check game status and handle win/lose/draw
    const checkGameStatus = useCallback((newBoard, player) => {
        const winner = checkWinner(newBoard);
        const isDraw = checkDraw(newBoard);
        
        if (winner !== null) {
            setGameOver(true);
            if (winner === 1) {
                // Player wins
                setResult('player');
                playSound('success');
                // Show result first, then mark as verified
                setTimeout(() => {
                    setVerified(true);
                }, 300); // Delay to show message
                setTimeout(() => {
                    onSuccess();
                }, 1200); // ⏱️ THỜI GIAN CHUYỂN CẢNH KHI THẮNG (ms)
            } else {
                // AI wins
                setResult('ai');
                playSound('error');
                // Show result first, then mark as failed
                setTimeout(() => {
                    setVerified(false);
                }, 300); // Delay to show message
                setTimeout(() => {
                    onFailure();
                }, 1200); // ⏱️ THỜI GIAN CHUYỂN CẢNH KHI THUA (ms)
            }
            return true; // Game ended
        } else if (isDraw) {
            // Draw - count as failure (player loses)
            setGameOver(true);
            setResult('draw');
            playSound('error');
            // Show result first, then mark as failed
            setTimeout(() => {
                setVerified(false);
            }, 300); // Delay to show message
            setTimeout(() => {
                onFailure(); // Changed to onFailure - draw = lose
            }, 2500); // ⏱️ THỜI GIAN CHUYỂN CẢNH KHI HÒA (ms)
            return true; // Game ended
        }
        return false; // Game continues
    }, [checkWinner, checkDraw, playSound, onSuccess, onFailure]);
    
    // Make a move (player only)
    const makePlayerMove = useCallback((index) => {
        setBoard(currentBoard => {
            // Check if cell is already occupied
            if (currentBoard[index] !== null) return currentBoard;
            
            const newBoard = [...currentBoard];
            newBoard[index] = 1; // Player = 1
            playSound('click');
            
            // Check game status after player move
            const gameEnded = checkGameStatus(newBoard, 1);
            
            if (!gameEnded) {
                // Game continues, switch to AI turn
                setPlayerTurn(false);
                setAiShouldMove(true);
            }
            
            return newBoard;
        });
    }, [playSound, checkGameStatus]);
    
    // Handle player move
    const handleCellClick = (index) => {
        // Only allow moves during player's turn and when game is not over
        if (!gameOver && playerTurn) {
            makePlayerMove(index);
        }
    };
    
    // AI takes its turn
    useEffect(() => {
        if (aiShouldMove && !gameOver) {
            const timer = setTimeout(() => {
                setBoard(currentBoard => {
                    // Introduce randomness at easy difficulty
                    let bestMove = null;
                    
                    if (difficulty === 1 && Math.random() < 0.4) {
                        // Random move for easy difficulty
                        const emptyCells = currentBoard
                            .map((cell, index) => cell === null ? index : null)
                            .filter(cell => cell !== null);
                        
                        if (emptyCells.length > 0) {
                            bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                        }
                    } else {
                        // Find best move with minimax
                        let bestScore = -Infinity;
                        
                        for (let i = 0; i < 9; i++) {
                            if (currentBoard[i] === null) {
                                const testBoard = [...currentBoard];
                                testBoard[i] = 0; // AI move
                                const score = minimax(testBoard, 0, false);
                                if (score > bestScore) {
                                    bestScore = score;
                                    bestMove = i;
                                }
                            }
                        }
                    }
                    
                    // Make AI move
                    if (bestMove !== null) {
                        const newBoard = [...currentBoard];
                        newBoard[bestMove] = 0; // AI = 0
                        
                        playSound('click');
                        
                        // Reset AI trigger AFTER making the move
                        setAiShouldMove(false);
                        
                        // Check game status after AI move
                        const gameEnded = checkGameStatus(newBoard, 0);
                        if (!gameEnded) {
                            // Game continues, switch back to player turn
                            setPlayerTurn(true);
                        }
                        
                        return newBoard;
                    }
                    
                    // No valid move found, reset trigger
                    setAiShouldMove(false);
                    return currentBoard;
                });
            }, 500); // ⏱️ THỜI GIAN DELAY TRƯỚC KHI AI ĐÁNH (ms)
            
            return () => clearTimeout(timer);
        }
    }, [aiShouldMove, gameOver, difficulty, playSound, checkGameStatus, minimax]);
    
    // Add verified class
    useEffect(() => {
        if (verified === true) {
            const block = document.querySelector('.tic-tac-toe-block');
            if (block) {
                block.classList.add('verified-success');
            }
        }
    }, [verified]);
    
    // Display result message
    const getResultMessage = () => {
        switch(result) {
            case 'player':
                return 'Bạn đã thắng! Chúc mừng! 🎉';
            case 'ai':
                return 'AI đã thắng! Hãy thử lại. 😢';
            case 'draw':
                return 'Hòa! Bạn phải thắng AI mới qua level! ⚠️';
            default:
                return '';
        }
    };
    
    // Render cell content (X, O, or empty)
    const renderCell = (index) => {
        if (board[index] === 1) return <div className="x-mark">✕</div>;
        if (board[index] === 0) return <div className="o-mark">○</div>;
        return null;
    };
    
    return (
        <div className={`tic-tac-toe-block ${verified !== null ? (verified ? 'verified-success' : 'verified-failed') : ''}`}>
            <div className="tic-tac-toe-header">
                <div className="tic-tac-toe-title">Tic-Tac-Toe Challenge</div>
                <div className="tic-tac-toe-subtitle">Bạn đánh X, AI đánh O. Bạn phải THẮNG AI để qua level!</div>
            </div>
            
            <div className="tic-tac-toe-content">
                <div className={`turn-indicator ${playerTurn ? 'player-turn' : 'ai-turn'}`}>
                    {playerTurn ? 'Lượt của bạn (X)' : 'AI đang suy nghĩ... (O)'}
                </div>
                
                <div className="tic-tac-toe-board">
                    {board.map((cell, index) => (
                        <div 
                            key={index}
                            className={`board-cell ${board[index] !== null ? 'filled' : ''}`}
                            onClick={() => handleCellClick(index)}
                        >
                            {renderCell(index)}
                        </div>
                    ))}
                </div>
                
                {gameOver && (
                    <div className={`game-result ${result === 'player' ? 'success' : 'error'}`}>
                        {getResultMessage()}
                    </div>
                )}
                

            </div>
        </div>
    );
};

export default TicTacToeBlock;
