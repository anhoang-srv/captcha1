import React, { useState, useEffect, useCallback } from 'react';
import '../styles/pipePuzzleBlock.css';

const PipePuzzleBlock = ({ onSuccess, onFailure, playSound }) => {
  const GRID_SIZE = 6; // Tăng từ 5×5 lên 6×6 để dễ đạt 100% coverage
  const [grid, setGrid] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [paths, setPaths] = useState({});
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);
  const [displayOn, setDisplayOn] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [gameStatus, setGameStatus] = useState('playing');

  // Khởi tạo game
  useEffect(() => {
    initializeGame();
    setTimeout(() => setDisplayOn(true), 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================================
  // HAMILTONIAN PATH DECOMPOSITION ALGORITHM
  // Tạo puzzle bằng cách: 1) Tạo Hamiltonian path qua tất cả ô
  //                       2) Chia path thành 2-4 segments
  //                       3) Mỗi segment = 1 màu với endpoints ở đầu/cuối
  // ĐẢM BẢO: 100% solvable, 100% coverage, không retry, load < 0.5s
  // ============================================================================

  /**
   * Tạo Hamiltonian Path (đường đi qua tất cả ô đúng 1 lần) bằng zigzag pattern
   * @param {number} size - Kích thước lưới (6 cho lưới 6×6)
   * @returns {Array<[number, number]>} - Mảng các ô theo thứ tự đi qua
   */
  const createZigzagPath = useCallback((size) => {
    const path = [];

    // RANDOMIZATION 1: Random start corner (4 góc)
    const corners = [
      { row: 0, col: 0, name: 'top-left' },
      { row: 0, col: size - 1, name: 'top-right' },
      { row: size - 1, col: 0, name: 'bottom-left' },
      { row: size - 1, col: size - 1, name: 'bottom-right' }
    ];
    const startCorner = corners[Math.floor(Math.random() * corners.length)];

    // RANDOMIZATION 2: Random direction (horizontal-first hoặc vertical-first)
    const horizontalFirst = Math.random() < 0.5;

    // RANDOMIZATION 3: Random zigzag orientation
    const reverseOddRows = Math.random() < 0.5;

    if (horizontalFirst) {
      // Đi theo hàng ngang (horizontal zigzag)
      for (let row = 0; row < size; row++) {
        const actualRow = startCorner.name.includes('bottom') ? size - 1 - row : row;
        const shouldReverse = reverseOddRows ? row % 2 === 1 : row % 2 === 0;

        if (shouldReverse) {
          // Đi từ phải sang trái
          for (let col = size - 1; col >= 0; col--) {
            const actualCol = startCorner.name.includes('right') ? size - 1 - col : col;
            path.push([actualRow, actualCol]);
          }
        } else {
          // Đi từ trái sang phải
          for (let col = 0; col < size; col++) {
            const actualCol = startCorner.name.includes('right') ? size - 1 - col : col;
            path.push([actualRow, actualCol]);
          }
        }
      }
    } else {
      // Đi theo cột dọc (vertical zigzag)
      for (let col = 0; col < size; col++) {
        const actualCol = startCorner.name.includes('right') ? size - 1 - col : col;
        const shouldReverse = reverseOddRows ? col % 2 === 1 : col % 2 === 0;

        if (shouldReverse) {
          // Đi từ dưới lên trên
          for (let row = size - 1; row >= 0; row--) {
            const actualRow = startCorner.name.includes('bottom') ? size - 1 - row : row;
            path.push([actualRow, actualCol]);
          }
        } else {
          // Đi từ trên xuống dưới
          for (let row = 0; row < size; row++) {
            const actualRow = startCorner.name.includes('bottom') ? size - 1 - row : row;
            path.push([actualRow, actualCol]);
          }
        }
      }
    }

    return path;
  }, []);

  /**
   * Chia tổng số ô thành các segments với độ dài ngẫu nhiên
   * @param {number} totalCells - Tổng số ô (36 cho lưới 6×6)
   * @param {number} numSegments - Số segments (2-4)
   * @returns {Array<number>} - Mảng độ dài của mỗi segment
   */
  const divideIntoSegments = useCallback((totalCells, numSegments) => {
    const baseLength = Math.floor(totalCells / numSegments);
    const remainder = totalCells % numSegments;

    // Bắt đầu với độ dài đều nhau
    const lengths = Array(numSegments).fill(baseLength);

    // RANDOMIZATION 4: Phân phối remainder ngẫu nhiên để tạo độ dài không đều
    // Ví dụ: Thay vì [9, 9, 9, 9], có thể tạo [10, 8, 11, 7]
    const indices = Array.from({ length: numSegments }, (_, i) => i);

    // Shuffle indices để random phân phối
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Phân phối remainder
    for (let i = 0; i < remainder; i++) {
      lengths[indices[i]]++;
    }

    // Thêm variation: Random +/- 1 ô (trong giới hạn hợp lý)
    if (numSegments >= 3 && baseLength >= 8) {
      for (let i = 0; i < numSegments - 1; i++) {
        const variation = Math.random() < 0.5 ? -1 : 1;
        if (lengths[i] + variation >= 6 && lengths[i] + variation <= baseLength + 3) {
          lengths[i] += variation;
          lengths[numSegments - 1] -= variation; // Bù vào segment cuối
        }
      }
    }

    return lengths;
  }, []);

  /**
   * Tạo puzzle với thuật toán Hamiltonian Path Decomposition
   * ĐẢM BẢO: 100% solvable, 100% coverage, không retry
   */
  const generateSolvablePuzzle = useCallback(() => {
    const colors = ['#4A90E2', '#E24A4A', '#4AE290', '#F5A623'];
    const numPairs = 3 + Math.floor(Math.random() * 2); // 3-4 cặp (tăng độ khó)

    // BƯỚC 1: Tạo Hamiltonian Path qua tất cả 36 ô
    const hamiltonianPath = createZigzagPath(GRID_SIZE);
    const totalCells = hamiltonianPath.length; // 36 ô

    // BƯỚC 2: Chia path thành segments với độ dài ngẫu nhiên
    const segmentLengths = divideIntoSegments(totalCells, numPairs);

    // BƯỚC 3: Tạo segments và endpoints
    const segments = [];
    let startIdx = 0;

    for (let i = 0; i < numPairs; i++) {
      const endIdx = startIdx + segmentLengths[i];
      const segment = hamiltonianPath.slice(startIdx, endIdx);
      segments.push({
        color: colors[i],
        path: segment,
        start: segment[0],
        end: segment[segment.length - 1]
      });
      startIdx = endIdx;
    }

    // BƯỚC 4: Tạo grid và pairs
    const newGrid = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({ color: null, isEndpoint: false }))
    );

    const newPairs = segments.map(segment => {
      // Đánh dấu endpoints trên grid
      newGrid[segment.start[0]][segment.start[1]] = {
        color: segment.color,
        isEndpoint: true
      };
      newGrid[segment.end[0]][segment.end[1]] = {
        color: segment.color,
        isEndpoint: true
      };

      return {
        color: segment.color,
        start: segment.start,
        end: segment.end
      };
    });

    return { grid: newGrid, pairs: newPairs };
  }, [createZigzagPath, divideIntoSegments]);

  // Khởi tạo lưới và puzzle
  const initializeGame = useCallback(() => {
    const puzzle = generateSolvablePuzzle();
    setGrid(puzzle.grid);
    setPairs(puzzle.pairs);
    setPaths({});
    setGameStatus('playing');
    setFeedbackMessage('');
  }, [generateSolvablePuzzle]);

  // Kiểm tra 2 ô có kề nhau không
  const isAdjacent = (cell1, cell2) => {
    const [r1, c1] = cell1;
    const [r2, c2] = cell2;
    return (Math.abs(r1 - r2) === 1 && c1 === c2) || (Math.abs(c1 - c2) === 1 && r1 === r2);
  };

  // Xử lý click vào ô
  const handleCellMouseDown = useCallback((row, col) => {
    if (gameStatus !== 'playing' || !displayOn) return;

    const cell = grid[row][col];
    
    // Click vào điểm đầu/cuối
    if (cell.isEndpoint) {
      const color = cell.color;
      
      // Nếu đã có đường của màu này, xóa nó
      if (paths[color]) {
        const newPaths = { ...paths };
        delete newPaths[color];
        setPaths(newPaths);
        playSound('click');
      }
      
      // Bắt đầu vẽ đường mới
      setIsDrawing(true);
      setCurrentColor(color);
      setCurrentPath([[row, col]]);
      playSound('click');
    }
    // Click vào đường đã vẽ để xóa
    else if (cell.color && !cell.isEndpoint) {
      const color = cell.color;
      const newPaths = { ...paths };
      delete newPaths[color];
      setPaths(newPaths);
      playSound('click');
    }
  }, [grid, paths, gameStatus, displayOn, playSound]);

  // Xử lý di chuyển chuột khi đang vẽ
  const handleCellMouseEnter = useCallback((row, col) => {
    if (!isDrawing || gameStatus !== 'playing') return;

    const lastCell = currentPath[currentPath.length - 1];

    // Kiểm tra ô kề nhau
    if (!isAdjacent(lastCell, [row, col])) return;

    const cell = grid[row][col];

    // Kiểm tra backtrack (quay lại ô trước đó)
    if (currentPath.length >= 2) {
      const prevCell = currentPath[currentPath.length - 2];
      if (prevCell[0] === row && prevCell[1] === col) {
        // Backtrack: xóa ô cuối
        setCurrentPath(currentPath.slice(0, -1));
        return;
      }
    }

    // Kiểm tra ô đã có trong path hiện tại (tránh loop)
    const alreadyInPath = currentPath.some(([r, c]) => r === row && c === col);
    if (alreadyInPath) return;

    // Kiểm tra ô đã bị chiếm bởi đường khác
    const occupiedByOther = Object.entries(paths).some(([color, path]) => {
      if (color === currentColor) return false;
      return path.some(([r, c]) => r === row && c === col);
    });
    if (occupiedByOther) return;

    // Không cho phép đi qua endpoint của màu khác
    if (cell.isEndpoint && cell.color !== currentColor) return;

    // Thêm ô vào đường
    setCurrentPath([...currentPath, [row, col]]);
  }, [isDrawing, currentPath, currentColor, grid, gameStatus, paths]);

  // Kiểm tra hoàn thành - PHẢI KHAI BÁO TRƯỚC handleMouseUp
  const checkCompletion = useCallback((currentPaths) => {
    // Kiểm tra tất cả cặp đã được kết nối
    const allPairsConnected = pairs.every(pair => currentPaths[pair.color]);

    if (!allPairsConnected) return;

    // Đếm số ô đã lấp đầy
    const filledCells = new Set();
    Object.values(currentPaths).forEach(path => {
      path.forEach(([r, c]) => {
        filledCells.add(`${r},${c}`);
      });
    });

    const totalCells = GRID_SIZE * GRID_SIZE;
    const coverage = (filledCells.size / totalCells) * 100;

    // Điều kiện thắng: tất cả cặp kết nối + lấp đầy 100% lưới (CRITICAL: quy tắc Pipe Puzzle)
    if (allPairsConnected && coverage === 100) {
      setGameStatus('success');
      setFeedbackMessage('🎉 Xác thực thành công!');
      playSound('beep');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  }, [pairs, playSound, onSuccess]);

  // Xử lý kết thúc vẽ
  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return;

    // Kiểm tra xem đường có kết thúc tại endpoint đúng màu không
    const lastCell = currentPath[currentPath.length - 1];
    const [lastRow, lastCol] = lastCell;
    const cell = grid[lastRow][lastCol];

    if (cell.isEndpoint && cell.color === currentColor && currentPath.length > 1) {
      // Đường hợp lệ, lưu vào paths
      const newPaths = { ...paths, [currentColor]: currentPath };
      setPaths(newPaths);
      playSound('success');

      // Kiểm tra hoàn thành
      setTimeout(() => checkCompletion(newPaths), 100);
    } else {
      // Đường không hợp lệ
      playSound('error');
    }

    setIsDrawing(false);
    setCurrentColor(null);
    setCurrentPath([]);
  }, [isDrawing, currentPath, currentColor, grid, paths, playSound, checkCompletion]);

  // Render ô
  const renderCell = (row, col) => {
    const cell = grid[row][col];
    const isInCurrentPath = currentPath.some(([r, c]) => r === row && c === col);

    // Tìm màu của ô (từ paths hoặc currentPath)
    let cellColor = null;
    let isInPath = false;

    for (const [color, path] of Object.entries(paths)) {
      if (path.some(([r, c]) => r === row && c === col)) {
        cellColor = color;
        isInPath = true;
        break;
      }
    }

    let cellClass = 'pipe-cell';
    let cellStyle = {};

    if (cell.isEndpoint) {
      cellClass += ' pipe-endpoint';
      cellStyle.backgroundColor = cell.color;
    } else if (isInCurrentPath) {
      cellClass += ' pipe-path-current';
      cellStyle.backgroundColor = currentColor;
    } else if (isInPath) {
      cellClass += ' pipe-path';
      cellStyle.backgroundColor = cellColor;
    }

    return (
      <div
        key={`${row}-${col}`}
        className={cellClass}
        style={cellStyle}
        onMouseDown={() => handleCellMouseDown(row, col)}
        onMouseEnter={() => handleCellMouseEnter(row, col)}
      />
    );
  };

  // Reset game
  const handleReset = () => {
    initializeGame();
    playSound('click');
  };

  // Verify
  const handleVerify = () => {
    if (gameStatus !== 'playing') return;

    const allPairsConnected = pairs.every(pair => paths[pair.color]);
    
    if (!allPairsConnected) {
      setGameStatus('failure');
      setFeedbackMessage('❌ Chưa kết nối đủ tất cả các cặp!');
      playSound('error');
      setTimeout(() => {
        onFailure();
      }, 1500);
      return;
    }

    // Đếm coverage
    const filledCells = new Set();
    Object.values(paths).forEach(path => {
      path.forEach(([r, c]) => {
        filledCells.add(`${r},${c}`);
      });
    });

    const totalCells = GRID_SIZE * GRID_SIZE;
    const coverage = (filledCells.size / totalCells) * 100;

    // CRITICAL: Yêu cầu lấp đầy 100% lưới (quy tắc Pipe Puzzle/Flow Free)
    if (coverage < 100) {
      setGameStatus('failure');
      setFeedbackMessage(`❌ Chưa lấp đầy lưới! (${Math.round(coverage)}% / 100%)`);
      playSound('error');
      setTimeout(() => {
        onFailure();
      }, 1500);
    } else {
      setGameStatus('success');
      setFeedbackMessage('🎉 Xác thực thành công!');
      playSound('beep');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  };

  return (
    <div 
      className={`pipe-puzzle-block ${displayOn ? 'display-on' : ''}`}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="pipe-banner">
        <p>Để xác minh bạn là con người, vui lòng</p>
        <h1>Kết nối tất cả các điểm cùng màu</h1>
        <p>Lấp đầy toàn bộ lưới. Kéo chuột để vẽ đường.</p>
      </div>

      {feedbackMessage && (
        <div className={`feedback-message ${gameStatus}`}>
          {feedbackMessage}
        </div>
      )}

      <div className="pipe-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="pipe-row">
            {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
          </div>
        ))}
      </div>

      <div className="pipe-footer">
        <div className="pipe-stats">
          <span>Cặp: {Object.keys(paths).length}/{pairs.length}</span>
          <span>Lấp đầy: {Math.round((Object.values(paths).reduce((sum, path) => sum + path.length, 0) / (GRID_SIZE * GRID_SIZE)) * 100)}%</span>
        </div>
        <div className="pipe-buttons">
          <button onClick={handleReset} disabled={gameStatus !== 'playing'}>
            RESET
          </button>
          <button onClick={handleVerify} disabled={gameStatus !== 'playing'}>
            VERIFY
          </button>
        </div>
      </div>
    </div>
  );
};

export default PipePuzzleBlock;

