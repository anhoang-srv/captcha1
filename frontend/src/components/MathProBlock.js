import { useState, useEffect, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import '../styles/mathProBlock.css';

const MathProBlock = ({ onSuccess, onFailure, playSound }) => {
    const initialExpressions = useMemo(() => [
        { display: '\\frac{12}{13}', value: 12 / 13, order: 0 }, // Phân số
        { display: '\\frac{51}{17}', value: 51 / 17, order: 1 }, // Phân số
        { display: '\\sqrt{13}', value: Math.sqrt(13), order: 2 }, // Căn bậc hai
        { display: '\\frac{6\\pi}{2}', value: (6 * Math.PI) / 2, order: 3 }, // Phân số
        { display: '2^5-11\\times 2', value: Math.pow(2, 5) - 11 * 2, order: 4 },
        { display: '3^3-2^3', value: Math.pow(3, 3) - Math.pow(2, 3), order: 5 },
        { display: '4!', value: 24, order: 6 },
        { display: '\\sum_{i=4}^8 i', value: 30, order: 7 }, // Tổng từ 4 đến 8
        { display: '\\infty', value: Infinity, order: 8 },
    ], []);

    const [shuffledExpressions, setShuffledExpressions] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState([]);
    const [status, setStatus] = useState('playing'); // playing, success, failure
    const [feedbackMessage, setFeedbackMessage] = useState('');

    // Shuffle expressions on initial load
    useEffect(() => {
        setShuffledExpressions([...initialExpressions].sort(() => Math.random() - 0.5));
    }, [initialExpressions]);

    const handleExpressionClick = (expression) => {
        // Prevent clicking if the game is over or the cell is already selected
        if (status !== 'playing' || selectedOrder.includes(expression.order)) return;

        const newSelectedOrder = [...selectedOrder, expression.order];
        setSelectedOrder(newSelectedOrder);
        playSound('click');

        // Defer validation until all expressions are selected
        if (newSelectedOrder.length === initialExpressions.length) {
            // Check if the selected order is correct
            const isCorrect = newSelectedOrder.every((order, index) => order === index);

            if (isCorrect) {
                setStatus('success');
                setFeedbackMessage('Đúng rồi!');
                playSound('success');
                setTimeout(onSuccess, 1500); // Increased delay for feedback visibility
            } else {
                setStatus('failure');
                setFeedbackMessage('Sai rồi!');
                playSound('error');
                setTimeout(onFailure, 1500); // Increased delay for feedback visibility
            }
        }
    };

    const handleReset = () => {
        setSelectedOrder([]);
        setStatus('playing');
        setFeedbackMessage(''); // Clear feedback on reset
        setShuffledExpressions([...initialExpressions].sort(() => Math.random() - 0.5));
        playSound('click');
    };

    const getCellClass = (expression) => {
        const isSelected = selectedOrder.includes(expression.order);
        if (isSelected) {
            return 'selected';
        }
        if (status === 'failure' && !isSelected) {
            // Optionally highlight the wrong one that was clicked, but for now just a general failure state
        }
        return '';
    };

    return (
        <div className={`math-pro-block ${status}`}>
            <div className="math-pro-header">
                <h3>Math Pro Challenge</h3>
                <p>Chọn các biểu thức theo thứ tự từ nhỏ đến lớn</p>
            </div>
            <div className="math-pro-grid">
                {shuffledExpressions.map((expr) => (
                    <div
                        key={expr.order}
                        className={`math-pro-cell ${getCellClass(expr)}`} 
                        onClick={() => handleExpressionClick(expr)}
                    >
                        <InlineMath math={expr.display} />
                    </div>
                ))}
            </div>
            {feedbackMessage && <div className={`math-pro-feedback ${status}`}>{feedbackMessage}</div>}
            <div className="math-pro-footer">
                <button onClick={handleReset} className="math-pro-reset-btn">Reset</button>
            </div>
        </div>
    );
};

export default MathProBlock;

