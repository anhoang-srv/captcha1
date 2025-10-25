import React, { useState, useRef, useEffect } from 'react';
import '../styles/circleDrawingBlock.css';

const CircleDrawingBlock = ({ onSuccess, onFailure, playSound }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const [accuracy, setAccuracy] = useState(0);
    const [verified, setVerified] = useState(null);
    const [points, setPoints] = useState([]);
    const [targetRadius, setTargetRadius] = useState(0);
    const [centerPoint, setCenterPoint] = useState({ x: 0, y: 0 });
    const [showGuide, setShowGuide] = useState(true);
    
    // Khởi tạo canvas và target
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;
            
            // Xác định tâm và bán kính mục tiêu
            const center = { x: width / 2, y: height / 2 };
            setCenterPoint(center);
            
            // Bán kính mục tiêu (40-60% kích thước canvas)
            const radius = Math.min(width, height) * (0.35 + Math.random() * 0.15);
            setTargetRadius(radius);
            
            // Vẽ hướng dẫn
            if (showGuide) {
                ctx.clearRect(0, 0, width, height);
                ctx.beginPath();
                ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
                ctx.strokeStyle = 'rgba(91, 232, 26, 0.3)';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.stroke();
                ctx.setLineDash([]);
                
                // Vẽ điểm tâm
                ctx.beginPath();
                ctx.arc(center.x, center.y, 4, 0, 2 * Math.PI);
                ctx.fillStyle = 'rgba(26, 115, 232, 0.6)';
                ctx.fill();
            }
        }
    }, [showGuide]);
    
    // Thêm class khi xác nhận thành công
    useEffect(() => {
        if (verified === true) {
            const block = document.querySelector('.circle-drawing-block');
            if (block) {
                block.classList.add('verified');
            }
        }
    }, [verified]);
    
    // Xử lý bắt đầu vẽ
    const handleMouseDown = (e) => {
        if (verified !== null) return;
        
        setIsDrawing(true);
        setPoints([]);
        setHasDrawn(false);
        
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setPoints([{ x, y }]);
        
        // Xóa hướng dẫn khi bắt đầu vẽ
        setShowGuide(false);
        
        // Xóa canvas để vẽ mới
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        playSound('click');
    };
    
    // Xử lý trong quá trình vẽ
    const handleMouseMove = (e) => {
        if (!isDrawing) return;
        
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newPoint = { x, y };
        setPoints(prevPoints => [...prevPoints, newPoint]);
        
        // Vẽ đường
        const ctx = canvas.getContext('2d');
        if (points.length > 0) {
            const prevPoint = points[points.length - 1];
            
            ctx.beginPath();
            ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.lineTo(x, y);
            ctx.strokeStyle = '#1a73e8';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        }
    };
    
    // Xử lý kết thúc vẽ
    const handleMouseUp = () => {
        if (!isDrawing) return;
        
        setIsDrawing(false);
        setHasDrawn(true);
        
        // Nối điểm đầu và cuối để tạo hình khép kín
        if (points.length > 10) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.beginPath();
            ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
            ctx.lineTo(points[0].x, points[0].y);
            ctx.strokeStyle = '#1a73e8';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Tính toán độ chính xác
            setTimeout(() => calculateAccuracy(), 300);
        } else {
            setHasDrawn(false);
            setShowGuide(true);
        }
    };
    
    // Tính toán độ chính xác của hình tròn
    const calculateAccuracy = () => {
        if (points.length < 10) {
            setAccuracy(0);
            return;
        }
        
        // Tìm tâm của hình vẽ
        let sumX = 0, sumY = 0;
        points.forEach(point => {
            sumX += point.x;
            sumY += point.y;
        });
        
        const drawingCenter = {
            x: sumX / points.length,
            y: sumY / points.length
        };
        
        // Tính bán kính trung bình
        let avgRadius = 0;
        points.forEach(point => {
            const dx = point.x - drawingCenter.x;
            const dy = point.y - drawingCenter.y;
            avgRadius += Math.sqrt(dx * dx + dy * dy);
        });
        avgRadius /= points.length;
        
        // Tính độ lệch bán kính
        let radiusVariance = 0;
        points.forEach(point => {
            const dx = point.x - drawingCenter.x;
            const dy = point.y - drawingCenter.y;
            const radius = Math.sqrt(dx * dx + dy * dy);
            radiusVariance += Math.abs(radius - avgRadius);
        });
        radiusVariance /= points.length;
        
        // Tính độ tròn (1 - tỉ lệ phương sai / bán kính trung bình)
        let roundness = Math.max(0, 1 - (radiusVariance / avgRadius));
        
        // Tính độ khớp với kích thước mục tiêu
        const targetMatch = 1 - Math.min(1, Math.abs(avgRadius - targetRadius) / targetRadius);
        
        // Tính độ khớp với tâm
        const centerOffset = Math.sqrt(
            Math.pow(drawingCenter.x - centerPoint.x, 2) + 
            Math.pow(drawingCenter.y - centerPoint.y, 2)
        );
        const centerMatch = 1 - Math.min(1, centerOffset / (targetRadius / 2));
        
        // Tính điểm tổng hợp (độ chính xác)
        let finalAccuracy = (roundness * 0.6 + targetMatch * 0.25 + centerMatch * 0.15) * 100;
        finalAccuracy = Math.min(100, Math.round(finalAccuracy * 10) / 10);
        
        setAccuracy(finalAccuracy);
        
        // Kiểm tra đạt yêu cầu hay không (giảm từ 85% xuống 80%)
        const passed = finalAccuracy >= 70;
        setVerified(passed);
        
        // Hiển thị kết quả
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Vẽ hình tròn mục tiêu để so sánh
        ctx.beginPath();
        ctx.arc(centerPoint.x, centerPoint.y, targetRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = passed ? 'rgba(76, 175, 80, 0.5)' : 'rgba(244, 67, 54, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Vẽ tâm của hình vẽ người dùng
        ctx.beginPath();
        ctx.arc(drawingCenter.x, drawingCenter.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = passed ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)';
        ctx.fill();
        
        if (passed) {
            playSound('success');
            setTimeout(() => {
                onSuccess();
            }, 1500);
        } else {
            playSound('error');
        }
    };
    
    // Xử lý nút thử lại
    const handleReset = () => {
        setIsDrawing(false);
        setHasDrawn(false);
        setAccuracy(0);
        setVerified(null);
        setPoints([]);
        setShowGuide(true);
        
        const block = document.querySelector('.circle-drawing-block');
        if (block) {
            block.classList.remove('verified');
        }
    };
    
    return (
        <div className="circle-drawing-block">
            <div className="circle-drawing-header">
                <div className="circle-drawing-title">Vẽ một hình tròn</div>
                <div className="circle-drawing-subtitle">Hãy vẽ một hình tròn càng chính xác càng tốt (tối thiểu 80%)</div>
            </div>
            
            <div className="circle-drawing-canvas-container">
                <canvas 
                    ref={canvasRef}
                    width={380}
                    height={380}
                    className="circle-drawing-canvas"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={(e) => {
                        e.preventDefault();
                        const touch = e.touches[0];
                        handleMouseDown({
                            clientX: touch.clientX,
                            clientY: touch.clientY
                        });
                    }}
                    onTouchMove={(e) => {
                        e.preventDefault();
                        const touch = e.touches[0];
                        handleMouseMove({
                            clientX: touch.clientX,
                            clientY: touch.clientY
                        });
                    }}
                    onTouchEnd={handleMouseUp}
                    onTouchCancel={handleMouseUp}
                />
                
                {hasDrawn && verified !== null && (
                    <div className={`circle-drawing-result ${verified ? 'success' : 'failure'}`}>
                        <div className="accuracy-score">Độ chính xác: {accuracy}%</div>
                        <div className="accuracy-message">
                            {verified 
                                ? '✓ Tuyệt vời! Đang chuyển level...' 
                                : '✗ Chưa đạt yêu cầu (cần ≥80%)'}
                        </div>
                        {!verified && (
                            <button className="retry-button" onClick={handleReset}>
                                Thử lại
                            </button>
                        )}
                    </div>
                )}
                
                {!hasDrawn && showGuide && (
                    <div className="drawing-instructions">
                        Click và kéo chuột để vẽ theo đường tròn gợi ý
                    </div>
                )}
            </div>
        </div>
    );
};

export default CircleDrawingBlock;
