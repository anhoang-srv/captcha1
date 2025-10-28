import { useState, useEffect, useCallback } from 'react';
import '../styles/minesweeperBlock.css';

const GRID_SIZE = 8;
const MINE_COUNT = 9; // 9 mìn cho board 8x8
const SAFE_CELLS_THRESHOLD = 0.7; // 70% ô an toàn
const FLAG_THRESHOLD = 6; // 6/9 cờ đúng

const MinesweeperBlock = ({ onSuccess, onFailure, playSound }) => {
    const [board, setBoard] = useState([]); // Board chứa thông tin mìn và số
    const [revealed, setRevealed] = useState([]); // Ô đã mở
    const [flags, setFlags] = useState([]); // Ô đã cắm cờ
    const [gameStatus, setGameStatus] = useState('playing'); // playing, success, failure
    const [firstClick, setFirstClick] = useState(true);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    // Khởi tạo board rỗng
    useEffect(() => {
        const emptyBoard = Array(GRID_SIZE).fill(null).map(() => 
            Array(GRID_SIZE).fill(0)
        );
        const emptyRevealed = Array(GRID_SIZE).fill(null).map(() => 
            Array(GRID_SIZE).fill(false)
        );
        const emptyFlags = Array(GRID_SIZE).fill(null).map(() => 
            Array(GRID_SIZE).fill(false)
        );
        
        setBoard(emptyBoard);
        setRevealed(emptyRevealed);
        setFlags(emptyFlags);
    }, []);

    // Tạo board với mìn, tránh vùng 3x3 quanh firstRow, firstCol
    const generateBoard = useCallback((firstRow, firstCol) => {
        const newBoard = Array(GRID_SIZE).fill(null).map(() => 
            Array(GRID_SIZE).fill(0)
        );

        // Đặt mìn
        let minesPlaced = 0;
        while (minesPlaced < MINE_COUNT) {
            const row = Math.floor(Math.random() * GRID_SIZE);
            const col = Math.floor(Math.random() * GRID_SIZE);

            // Kiểm tra không đặt mìn trong vùng 3x3 quanh ô đầu tiên
            const isInSafeZone = Math.abs(row - firstRow) <= 1 && Math.abs(col - firstCol) <= 1;
            
            // Kiểm tra chưa có mìn ở vị trí này
            if (!isInSafeZone && newBoard[row][col] !== -1) {
                newBoard[row][col] = -1; // -1 = mìn
                minesPlaced++;
            }
        }

        // Tính số mìn xung quanh mỗi ô
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                if (newBoard[row][col] === -1) continue; // Bỏ qua ô mìn

                let count = 0;
                // Kiểm tra 8 ô xung quanh
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        const newRow = row + dr;
                        const newCol = col + dc;
                        
                        if (newRow >= 0 && newRow < GRID_SIZE && 
                            newCol >= 0 && newCol < GRID_SIZE && 
                            newBoard[newRow][newCol] === -1) {
                            count++;
                        }
                    }
                }
                newBoard[row][col] = count;
            }
        }

        return newBoard;
    }, []);

    // Flood fill - mở các ô liền kề khi gặp ô số 0
    const floodFill = useCallback((row, col, currentBoard, currentRevealed) => {
        if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return;
        if (currentRevealed[row][col]) return; // Đã mở rồi
        if (currentBoard[row][col] === -1) return; // Là mìn

        currentRevealed[row][col] = true;

        // Nếu ô này có số > 0, dừng lại
        if (currentBoard[row][col] > 0) return;

        // Nếu ô này là 0, tiếp tục mở các ô xung quanh
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                floodFill(row + dr, col + dc, currentBoard, currentRevealed);
            }
        }
    }, []);

    // Kiểm tra điều kiện thắng CAPTCHA
    const checkCaptchaSuccess = useCallback((currentRevealed, currentFlags, currentBoard) => {
        // Đếm số ô an toàn đã mở
        let revealedSafeCells = 0;
        let totalSafeCells = GRID_SIZE * GRID_SIZE - MINE_COUNT;

        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                if (currentBoard[row][col] !== -1 && currentRevealed[row][col]) {
                    revealedSafeCells++;
                }
            }
        }

        const safePercentage = revealedSafeCells / totalSafeCells;

        // Đếm số cờ đúng
        let correctFlags = 0;
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                if (currentFlags[row][col] && currentBoard[row][col] === -1) {
                    correctFlags++;
                }
            }
        }

        // Điều kiện thắng CAPTCHA: 70% ô an toàn HOẶC 6/9 cờ đúng
        return safePercentage >= SAFE_CELLS_THRESHOLD || correctFlags >= FLAG_THRESHOLD;
    }, []);

    // Xử lý click trái (mở ô)
    const handleLeftClick = useCallback((row, col) => {
        if (gameStatus !== 'playing') return;
        if (flags[row][col]) return; // Không mở ô đã cắm cờ

        // Lần click đầu tiên: tạo board
        if (firstClick) {
            const newBoard = generateBoard(row, col);
            setBoard(newBoard);
            setFirstClick(false);

            // Mở ô đầu tiên
            const newRevealed = revealed.map(r => [...r]);
            floodFill(row, col, newBoard, newRevealed);
            setRevealed(newRevealed);
            playSound('click');
            return;
        }

        // Đã mở rồi
        if (revealed[row][col]) return;

        // Trúng mìn - THUA
        if (board[row][col] === -1) {
            const newRevealed = revealed.map(r => [...r]);
            newRevealed[row][col] = true;
            setRevealed(newRevealed);
            setGameStatus('failure');
            setFeedbackMessage('Boom! Bạn đã trúng mìn!');
            playSound('error');
            setTimeout(onFailure, 1500);
            return;
        }

        // Mở ô an toàn
        const newRevealed = revealed.map(r => [...r]);
        floodFill(row, col, board, newRevealed);
        setRevealed(newRevealed);
        playSound('click');

        // Kiểm tra điều kiện thắng CAPTCHA
        if (checkCaptchaSuccess(newRevealed, flags, board)) {
            setGameStatus('success');
            setFeedbackMessage('Xác thực thành công!');
            playSound('success');
            setTimeout(onSuccess, 1500);
        }
    }, [gameStatus, flags, firstClick, revealed, board, generateBoard, floodFill, playSound, onFailure, checkCaptchaSuccess, onSuccess]);

    // Xử lý click phải (cắm cờ)
    const handleRightClick = useCallback((e, row, col) => {
        e.preventDefault();
        if (gameStatus !== 'playing') return;
        if (revealed[row][col]) return; // Không cắm cờ ô đã mở
        if (firstClick) return; // Không cắm cờ trước khi click lần đầu

        const newFlags = flags.map(r => [...r]);
        newFlags[row][col] = !newFlags[row][col];
        setFlags(newFlags);
        playSound('click');

        // Kiểm tra điều kiện thắng CAPTCHA
        if (checkCaptchaSuccess(revealed, newFlags, board)) {
            setGameStatus('success');
            setFeedbackMessage('Xác thực thành công!');
            playSound('success');
            setTimeout(onSuccess, 1500);
        }
    }, [gameStatus, revealed, firstClick, flags, board, playSound, checkCaptchaSuccess, onSuccess]);

    // Render nội dung ô
    const renderCell = (row, col) => {
        const isRevealed = revealed[row][col];
        const isFlagged = flags[row][col];
        const value = board[row][col];

        if (isFlagged) {
            return '🚩';
        }

        if (!isRevealed) {
            return '';
        }

        if (value === -1) {
            return '💣';
        }

        if (value === 0) {
            return '';
        }

        return value;
    };

    // Lấy class cho ô
    const getCellClass = (row, col) => {
        const isRevealed = revealed[row][col];
        const isFlagged = flags[row][col];
        const value = board[row][col];

        let classes = ['minesweeper-cell'];

        if (isRevealed) {
            classes.push('revealed');
            if (value === -1) {
                classes.push('mine');
            } else if (value > 0) {
                classes.push(`number-${value}`);
            }
        } else if (isFlagged) {
            classes.push('flagged');
        }

        return classes.join(' ');
    };

    return (
        <div className={`minesweeper-block ${gameStatus}`}>
            <div className="minesweeper-header">
                <h3>🤖 Minesweeper CAPTCHA</h3>
                <p>Mở ít nhất 70% ô an toàn hoặc cắm đúng 6/9 cờ để xác thực</p>
                <div className="minesweeper-instructions">
                    <span>Click trái: Mở ô</span>
                    <span>Click phải: Cắm cờ</span>
                </div>
            </div>

            {feedbackMessage && (
                <div className={`feedback-message ${gameStatus}`}>
                    {feedbackMessage}
                </div>
            )}

            <div className="minesweeper-grid">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="minesweeper-row">
                        {row.map((_, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={getCellClass(rowIndex, colIndex)}
                                onClick={() => handleLeftClick(rowIndex, colIndex)}
                                onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                            >
                                {renderCell(rowIndex, colIndex)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="minesweeper-footer">
                <div className="minesweeper-stats">
                    <span>🚩 Cờ: {flags.flat().filter(f => f).length}/{MINE_COUNT}</span>
                    <span>💣 Mìn: {MINE_COUNT}</span>
                </div>
            </div>
        </div>
    );
};

export default MinesweeperBlock;

