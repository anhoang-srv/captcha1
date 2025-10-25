import React, { useState, useEffect, useRef } from 'react';
import '../styles/puzzleBlock.css';

const PuzzleBlock = ({ imageUrl, difficulty, onSuccess, playSound, timer }) => {
    const [pieces, setPieces] = useState([]);
    const [solved, setSolved] = useState(false);
    const [gridSize, setGridSize] = useState({ rows: 3, cols: 3 });
    const canvasRef = useRef(null);
    
    useEffect(() => {
        // Đặt kích thước lưới dựa trên độ khó
        const size = Math.min(Math.max(difficulty, 3), 5);
        setGridSize({ rows: size, cols: size });
        
        // Tạo các mảnh ghép
        generatePuzzlePieces(imageUrl, size, size);
    }, [imageUrl, difficulty]);
    
    const generatePuzzlePieces = (url, rows, cols) => {
        const img = new Image();
        
        img.onload = () => {
            const pieceWidth = 400 / cols;
            const pieceHeight = 400 / rows;
            
            const newPieces = [];
            
            // Tạo các mảnh canvas
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const canvas = document.createElement('canvas');
                    canvas.width = pieceWidth;
                    canvas.height = pieceHeight;
                    const ctx = canvas.getContext('2d');
                    
                    // Vẽ mảnh
                    ctx.drawImage(
                        img,
                        (x * img.width) / cols, 
                        (y * img.height) / rows, 
                        img.width / cols, 
                        img.height / rows,
                        0, 
                        0, 
                        pieceWidth, 
                        pieceHeight
                    );
                    
                    newPieces.push({
                        id: `piece-${y}-${x}`,
                        url: canvas.toDataURL(),
                        correctPosition: { row: y, col: x },
                        currentPosition: { row: y, col: x }
                    });
                }
            }
            
            // Xáo trộn các mảnh
            const shuffled = [...newPieces];
            
            // Fisher-Yates shuffle
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = shuffled[i].currentPosition;
                shuffled[i].currentPosition = shuffled[j].currentPosition;
                shuffled[j].currentPosition = temp;
            }
            
            setPieces(shuffled);
        };
        
        img.src = url;
    };
    
    const handleDragStart = (e, pieceId) => {
        e.dataTransfer.setData('text/plain', pieceId);
        e.currentTarget.style.opacity = '0.5';
    };
    
    const handleDragEnd = (e) => {
        e.currentTarget.style.opacity = '1';
    };
    
    const handleDrop = (e, targetRow, targetCol) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        const pieceId = e.dataTransfer.getData('text/plain');
        
        // Tìm các mảnh được hoán đổi
        const updatedPieces = [...pieces];
        const draggedPieceIndex = updatedPieces.findIndex(p => p.id === pieceId);
        const targetPieceIndex = updatedPieces.findIndex(
            p => p.currentPosition.row === targetRow && p.currentPosition.col === targetCol
        );
        
        if (draggedPieceIndex !== -1 && targetPieceIndex !== -1) {
            // Hoán đổi vị trí
            const tempPosition = { ...updatedPieces[draggedPieceIndex].currentPosition };
            updatedPieces[draggedPieceIndex].currentPosition = updatedPieces[targetPieceIndex].currentPosition;
            updatedPieces[targetPieceIndex].currentPosition = tempPosition;
            
            setPieces(updatedPieces);
            playSound('click');
            
            // Kiểm tra xem puzzle đã được giải chưa
            checkPuzzleSolved(updatedPieces);
        }
    };
    
    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    };
    
    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-over');
    };
    
    const checkPuzzleSolved = (currentPieces) => {
        const isSolved = currentPieces.every(piece => 
            piece.correctPosition.row === piece.currentPosition.row && 
            piece.correctPosition.col === piece.currentPosition.col
        );
        
        if (isSolved && !solved) {
            setSolved(true);
            playSound('success');
            setTimeout(() => {
                onSuccess();
            }, 500);
        }
    };
    
    return (
        <div className={`puzzle-block-container ${solved ? 'completed' : ''}`}>
            <div className="puzzle-header">
                <h3>Sắp xếp các mảnh ghép để hoàn thành hình ảnh</h3>
                <p className="puzzle-hint">Kéo và thả các mảnh ghép vào đúng vị trí của chúng.</p>
            </div>
            <div 
                className={`puzzle-grid ${solved ? 'solved' : ''}`}
                style={{ 
                    gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
                    gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`
                }}
            >
                {Array(gridSize.rows).fill().map((_, rowIndex) => (
                    Array(gridSize.cols).fill().map((_, colIndex) => {
                        const piece = pieces.find(p => 
                            p.currentPosition.row === rowIndex && 
                            p.currentPosition.col === colIndex
                        );
                        
                        return (
                            <div 
                                key={`cell-${rowIndex}-${colIndex}`}
                                className="puzzle-cell"
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                            >
                                {piece && (
                                    <img
                                        className="puzzle-piece"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, piece.id)}
                                        onDragEnd={handleDragEnd}
                                        src={piece.url}
                                        alt={`Puzzle piece ${piece.id}`}
                                    />
                                )}
                            </div>
                        );
                    })
                ))}
            </div>
            {solved && (
                <div className="puzzle-success-message">
                    ✓ Hoàn thành! Đang chuyển sang level tiếp theo...
                </div>
            )}
        </div>
    );
};

export default PuzzleBlock;
