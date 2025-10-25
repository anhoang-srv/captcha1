import { useState, useEffect, useCallback, useRef } from 'react';
import '../styles/wordSearchBlock.css';

const WordSearchBlock = ({ difficulty = 1, onSuccess, playSound }) => {
    const [grid, setGrid] = useState([]);
    const [words, setWords] = useState([]);
    const [foundWords, setFoundWords] = useState([]);
    const [foundWordPositions, setFoundWordPositions] = useState([]); // Track positions of found words
    const [selection, setSelection] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [verified, setVerified] = useState(null);
    
    const gridRef = useRef(null);
    const onSuccessCalled = useRef(false); // Flag to prevent double calls
    
    // Words pools based on difficulty
    const wordPools = [
        // Difficulty 1: Common 3-4 letter words
        ['CAT', 'DOG', 'BAT', 'RAT', 'PIG', 'COW'],
        // Difficulty 2: 4-5 letter words
        ['FISH', 'BIRD', 'MOUSE', 'SNAKE', 'TIGER'],
        // Difficulty 3: 5-6 letter words
        ['APPLE', 'GRAPE', 'LEMON', 'MELON', 'PEACH'],
        // Difficulty 4: 6-7 letter words
        ['ORANGE', 'BANANA', 'CHERRY', 'TOMATO'],
        // Difficulty 5: 7+ letter words
        ['PINEAPPLE', 'STRAWBERRY', 'WATERMELON']
    ];
    
    // Get random words from pool
    const getRandomWords = useCallback((pool, count) => {
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, pool.length));
    }, []);
    
    // Check if word fits at position
    const checkWordFit = useCallback((grid, word, row, col, direction, size) => {
        const dirs = [
            [0, 1],   // horizontal (right)
            [1, 0],   // vertical (down)
            [1, 1],   // diagonal down-right
            [-1, 1]   // diagonal up-right
        ];
        
        const [dx, dy] = dirs[direction];
        
        // Check bounds
        const endRow = row + dx * (word.length - 1);
        const endCol = col + dy * (word.length - 1);
        
        if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
            return false;
        }
        
        // Check if cells are empty or match
        for (let i = 0; i < word.length; i++) {
            const r = row + dx * i;
            const c = col + dy * i;
            
            if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
                return false;
            }
        }
        
        return true;
    }, []);
    
    // Place word in grid and return positions
    const placeWord = useCallback((grid, word, row, col, direction) => {
        const dirs = [[0, 1], [1, 0], [1, 1], [-1, 1]];
        const [dx, dy] = dirs[direction];
        const positions = [];
        
        for (let i = 0; i < word.length; i++) {
            const r = row + dx * i;
            const c = col + dy * i;
            grid[r][c] = word[i];
            positions.push({ row: r, col: c });
        }
        
        return positions;
    }, []);
    
    // Create grid with words placed
    const createGrid = useCallback((size, wordsToPlace) => {
        const grid = Array(size).fill().map(() => Array(size).fill(''));
        const wordPositions = {};
        
        // Place each word
        wordsToPlace.forEach(word => {
            let placed = false;
            let attempts = 0;
            
            while (!placed && attempts < 200) {
                attempts++;
                
                const row = Math.floor(Math.random() * size);
                const col = Math.floor(Math.random() * size);
                const direction = Math.floor(Math.random() * 4);
                
                if (checkWordFit(grid, word, row, col, direction, size)) {
                    const positions = placeWord(grid, word, row, col, direction);
                    wordPositions[word] = positions;
                    placed = true;
                }
            }
        });
        
        // Fill empty cells with random letters
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (grid[i][j] === '') {
                    grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }
            }
        }
        
        return { grid, wordPositions };
    }, [checkWordFit, placeWord]);
    
    // Initialize grid and words
    useEffect(() => {
        const difficultyIndex = Math.min(difficulty - 1, wordPools.length - 1);
        const gridSize = 8 + Math.floor(difficulty / 2); // 8, 8, 9, 9, 10
        const wordCount = 3 + Math.floor(difficulty / 2); // 3, 3, 4, 4, 5
        
        const wordsToFind = getRandomWords(wordPools[difficultyIndex], wordCount);
        setWords(wordsToFind);
        
        const { grid: newGrid, wordPositions } = createGrid(gridSize, wordsToFind);
        setGrid(newGrid);
        
        // Store word positions for highlighting later
        gridRef.current = { wordPositions };
        
        setFoundWords([]);
        setFoundWordPositions([]);
        setSelection([]);
        setIsDragging(false);
        setVerified(null);
    }, [difficulty, getRandomWords, createGrid]);
    
    // Check if game completed
    useEffect(() => {
        // Check if all words have been found
        // Check if all words have been found and onSuccess has not been called yet
        if (words.length > 0 && foundWords.length === words.length && !onSuccessCalled.current) {
            onSuccessCalled.current = true; // Set the flag to prevent further calls

            // All words found, trigger success
            setVerified(true);
            playSound('success');
            // Call onSuccess immediately. The parent component (game.js) will handle the delay.
            onSuccess();
        }
    }, [foundWords, words, onSuccess, playSound]);
    
    // Handle cell mousedown
    const handleCellMouseDown = useCallback((rowIndex, colIndex) => {
        if (verified !== null) return;
        
        setIsDragging(true);
        setSelection([{ row: rowIndex, col: colIndex }]);
        playSound('click');
    }, [verified, playSound]);
    
    // Handle cell mouseenter
    const handleCellMouseEnter = useCallback((rowIndex, colIndex) => {
        if (!isDragging || verified !== null) return;
        
        setSelection(prevSelection => {
            // Don't add if already in selection
            if (prevSelection.some(cell => cell.row === rowIndex && cell.col === colIndex)) {
                return prevSelection;
            }
            
            if (prevSelection.length === 0) {
                return [{ row: rowIndex, col: colIndex }];
            }
            
            const lastCell = prevSelection[prevSelection.length - 1];
            
            // Only allow straight line selection
            if (prevSelection.length === 1) {
                // Second cell - establish direction
                const rowDiff = Math.abs(rowIndex - lastCell.row);
                const colDiff = Math.abs(colIndex - lastCell.col);
                
                // Only allow one step in horizontal, vertical, or diagonal
                if ((rowDiff === 0 && colDiff === 1) || 
                    (rowDiff === 1 && colDiff === 0) || 
                    (rowDiff === 1 && colDiff === 1)) {
                    return [...prevSelection, { row: rowIndex, col: colIndex }];
                }
            } else {
                // Continue in same direction
                const firstCell = prevSelection[0];
                const dirRow = Math.sign(lastCell.row - firstCell.row);
                const dirCol = Math.sign(lastCell.col - firstCell.col);
                
                const expectedRow = lastCell.row + dirRow;
                const expectedCol = lastCell.col + dirCol;
                
                if (rowIndex === expectedRow && colIndex === expectedCol) {
                    return [...prevSelection, { row: rowIndex, col: colIndex }];
                }
            }
            
            return prevSelection;
        });
    }, [isDragging, verified]);
    
    // Handle mouseup - FIX: Use useCallback with proper dependencies
    const handleMouseUp = useCallback(() => {
        // If dragging has not started, or the level is already verified, or success callback has been initiated, do nothing.
        if (!isDragging || verified !== null || onSuccessCalled.current) return;
        
        setIsDragging(false);
        
        if (selection.length === 0) return;
        
        // Get selected word
        const selectedWord = selection.map(cell => grid[cell.row][cell.col]).join('');
        
        // Check forward and backward
        const reversedWord = selectedWord.split('').reverse().join('');
        
        if ((words.includes(selectedWord) || words.includes(reversedWord)) && 
            !foundWords.includes(selectedWord) && !foundWords.includes(reversedWord)) {
            
            const actualWord = words.includes(selectedWord) ? selectedWord : reversedWord;
            
            setFoundWords(prev => [...prev, actualWord]);
            setFoundWordPositions(prev => [...prev, ...selection]);
            playSound('success');
            
            // Keep selection visible briefly
            setTimeout(() => {
                setSelection([]);
            }, 500);
        } else {
            // Not a word or already found
            playSound('error');
            setSelection([]);
        }
    }, [isDragging, verified, selection, grid, words, foundWords, playSound]);
    
    // FIX: Add/remove event listener properly
    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseUp]);
    
    // Check if a cell is in current selection
    const isCellSelected = useCallback((rowIndex, colIndex) => {
        return selection.some(cell => cell.row === rowIndex && cell.col === colIndex);
    }, [selection]);
    
    // Check if a cell is part of a found word
    const isCellFoundWord = useCallback((rowIndex, colIndex) => {
        return foundWordPositions.some(cell => cell.row === rowIndex && cell.col === colIndex);
    }, [foundWordPositions]);
    
    return (
        <div className={`word-search-block ${verified !== null ? (verified ? 'verified-success' : 'verified-failed') : ''}`}>
            <div className="word-search-header">
                <div className="word-search-title">Word Search Challenge</div>
                <div className="word-search-subtitle">Tìm các từ ẩn trong bảng chữ cái</div>
            </div>
            
            <div className="word-search-content">
                <div className="words-to-find">
                    {words.map((word, index) => (
                        <div key={index} className={`word-item ${foundWords.includes(word) ? 'found' : ''}`}>
                            {foundWords.includes(word) && <span className="checkmark">✓ </span>}
                            {word}
                        </div>
                    ))}
                </div>
                
                <div className="word-search-progress">
                    Đã tìm: {foundWords.length}/{words.length}
                </div>
                
                <div className="word-search-grid" ref={gridRef}>
                    {grid.map((row, rowIndex) => (
                        <div key={rowIndex} className="grid-row">
                            {row.map((cell, colIndex) => (
                                <div
                                    key={colIndex}
                                    className={`grid-cell ${isCellSelected(rowIndex, colIndex) ? 'selected' : ''} ${isCellFoundWord(rowIndex, colIndex) ? 'found-word' : ''}`}
                                    onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                                    onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                                >
                                    {cell}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WordSearchBlock;
