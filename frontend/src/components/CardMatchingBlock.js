import React, { useState, useEffect, useCallback } from 'react';
import '../styles/cardMatching.css';

const CardMatchingBlock = ({ difficulty, onSuccess, onFailure, playSound }) => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [displayOn, setDisplayOn] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [gameStatus, setGameStatus] = useState('playing');
  const [moveCount, setMoveCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Danh sách TẤT CẢ ảnh từ các folder
  const allImages = [
    // Bicycles (16 ảnh)
    ...Array(16).fill().map((_, i) => ({
      url: `/captcha-images/bicycles/${i}.jpg`,
      type: 'bicycles'
    })),
    // Bridges (16 ảnh)
    ...Array(16).fill().map((_, i) => ({
      url: `/captcha-images/bridges/${i}.jpg`,
      type: 'bridges'
    })),
    // Cars (16 ảnh)
    ...Array(16).fill().map((_, i) => ({
      url: `/captcha-images/cars/${i}.jpg`,
      type: 'cars'
    })),
    // Crosswalks (16 ảnh)
    ...Array(16).fill().map((_, i) => ({
      url: `/captcha-images/crosswalks/${i}.jpg`,
      type: 'crosswalks'
    })),
    // Fruits (6 ảnh)
    { url: '/captcha-images/fruits/cam.png', type: 'fruits' },
    { url: '/captcha-images/fruits/chuoi.png', type: 'fruits' },
    { url: '/captcha-images/fruits/le.png', type: 'fruits' },
    { url: '/captcha-images/fruits/tao.png', type: 'fruits' },
    { url: '/captcha-images/fruits/xoai.png', type: 'fruits' },
    { url: '/captcha-images/fruits/mang_cau.png', type: 'fruits' },
    // Streetlights (16 ảnh)
    ...Array(16).fill().map((_, i) => ({
      url: `/captcha-images/streetlights/${i}.jpg`,
      type: 'streetlights'
    })),
    // Trains (16 ảnh)
    ...Array(16).fill().map((_, i) => ({
      url: `/captcha-images/trains/${i}.jpg`,
      type: 'trains'
    })),
    // Vegetables (4 ảnh)
    { url: '/captcha-images/vegetables/bi_ngo.png', type: 'vegetables' },
    { url: '/captcha-images/vegetables/ca_chua.png', type: 'vegetables' },
    { url: '/captcha-images/vegetables/dua_chuot.png', type: 'vegetables' },
    { url: '/captcha-images/vegetables/ot.png', type: 'vegetables' }
  ];

  // Xác định cấu hình game dựa trên difficulty
  const getGameConfig = useCallback(() => {
    switch (difficulty) {
      case 1:
        return { rows: 4, cols: 4, maxMoves: 30 }; // 8 cặp = 16 cards
      case 2:
        return { rows: 4, cols: 5, maxMoves: 40 }; // 10 cặp = 20 cards
      case 3:
        return { rows: 6, cols: 6, maxMoves: 60 }; // 18 cặp = 36 cards
      default:
        return { rows: 4, cols: 4, maxMoves: 30 };
    }
  }, [difficulty]);

  // Khởi tạo game
  useEffect(() => {
    initializeGame();
    setTimeout(() => setDisplayOn(true), 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const initializeGame = useCallback(() => {
    const config = getGameConfig();
    const totalPairs = (config.rows * config.cols) / 2;

    // Xáo trộn tất cả ảnh và chọn số lượng cần thiết
    const shuffledImages = [...allImages].sort(() => Math.random() - 0.5);
    const selectedImages = shuffledImages.slice(0, totalPairs);

    // Tạo các card từ ảnh đã chọn
    let cardId = 0;
    const cardPairs = selectedImages.map(image => ({
      id: cardId++,
      imageUrl: image.url,
      imageType: image.type,
      isFlipped: false,
      isMatched: false
    }));

    // Nhân đôi để tạo cặp (mỗi ảnh xuất hiện đúng 2 lần)
    const allCards = [
      ...cardPairs,
      ...cardPairs.map(card => ({
        ...card,
        id: cardId++
      }))
    ];

    // Xáo trộn tất cả các card
    const shuffledCards = allCards.sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setGameOver(false);
    setMoveCount(0);
    setIsProcessing(false);
  }, [getGameConfig, allImages]);

  // Xử lý click card
  const handleCardClick = useCallback((index) => {
    if (gameOver || isProcessing || !displayOn) return;
    
    const card = cards[index];
    
    // Không cho phép click card đã matched hoặc đã flipped
    if (card.isMatched || flippedIndices.includes(index)) return;
    
    // Không cho phép flip quá 2 card cùng lúc
    if (flippedIndices.length >= 2) return;
    
    // Flip card
    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);
    
    // Nếu đã flip 2 card, kiểm tra match
    if (newFlippedIndices.length === 2) {
      setIsProcessing(true);
      setMoveCount(prev => prev + 1);
      
      setTimeout(() => {
        checkMatch(newFlippedIndices);
      }, 800);
    }
  }, [cards, flippedIndices, gameOver, isProcessing, displayOn]);

  // Kiểm tra 2 card có match không
  const checkMatch = useCallback((indices) => {
    const [index1, index2] = indices;
    const card1 = cards[index1];
    const card2 = cards[index2];

    // So sánh theo imageUrl thay vì fruitType
    if (card1.imageUrl === card2.imageUrl) {
      // Match! Đánh dấu cả 2 card là matched
      const newCards = [...cards];
      newCards[index1].isMatched = true;
      newCards[index2].isMatched = true;
      setCards(newCards);

      const newMatchedPairs = [...matchedPairs, card1.imageUrl];
      setMatchedPairs(newMatchedPairs);

      playSound('beep');

      // Kiểm tra thắng
      const config = getGameConfig();
      const totalPairs = (config.rows * config.cols) / 2;

      if (newMatchedPairs.length === totalPairs) {
        // Thắng!
        handleWin();
      }
    } else {
      // Không match, phát âm thanh lỗi
      playSound('game-over');
    }

    // Reset flipped indices
    setFlippedIndices([]);
    setIsProcessing(false);
  }, [cards, matchedPairs, playSound, getGameConfig]);

  // Xử lý thắng
  const handleWin = useCallback(() => {
    setGameOver(true);
    setGameStatus('success');
    setFeedbackMessage('🎉 Xác thực thành công! Bạn đã ghép đúng tất cả các cặp.');
    playSound('beep');
    
    setTimeout(() => {
      setDisplayOn(false);
    }, 1800);
    
    setTimeout(() => {
      onSuccess();
    }, 2300);
  }, [onSuccess, playSound]);

  // Xử lý thua
  const handleLose = useCallback(() => {
    setGameOver(true);
    setGameStatus('failure');
    setFeedbackMessage(`❌ Hết lượt! Bạn đã dùng hết ${moveCount} lượt chơi.`);
    playSound('game-over');
    
    setTimeout(() => {
      setDisplayOn(false);
    }, 2200);
    
    setTimeout(() => {
      onFailure();
    }, 2700);
  }, [moveCount, onFailure, playSound]);

  // Kiểm tra số lượt chơi
  useEffect(() => {
    if (gameOver) return;
    
    const config = getGameConfig();
    if (moveCount >= config.maxMoves) {
      handleLose();
    }
  }, [moveCount, gameOver, getGameConfig, handleLose]);

  // Render card
  const renderCard = (card, index) => {
    const isFlipped = flippedIndices.includes(index) || card.isMatched;
    const isMatched = card.isMatched;

    return (
      <div
        key={card.id}
        className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
        onClick={() => handleCardClick(index)}
      >
        <div className="card-inner">
          <div className="card-front">
            <div className="card-pattern">?</div>
          </div>
          <div className="card-back">
            <img src={card.imageUrl} alt={card.imageType} />
          </div>
        </div>
      </div>
    );
  };

  const config = getGameConfig();

  return (
    <div className={`card-matching-block ${displayOn ? 'display-on' : ''}`}>
      <div className="card-matching-banner">
        <p>Để xác minh bạn là con người, vui lòng</p>
        <h1>Ghép các cặp hình giống nhau</h1>
        <p>Lượt chơi: {moveCount}/{config.maxMoves} | Cặp đã ghép: {matchedPairs.length}/{(config.rows * config.cols) / 2}</p>
      </div>

      {feedbackMessage && (
        <div className={`feedback-message ${gameStatus}`}>
          {feedbackMessage}
        </div>
      )}

      <div 
        className="card-grid" 
        style={{
          gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
          gridTemplateRows: `repeat(${config.rows}, 1fr)`
        }}
      >
        {cards.map((card, index) => renderCard(card, index))}
      </div>

      <div className="card-matching-footer">
        <div className="game-info">
          <span className="difficulty-badge">Độ khó: {difficulty}</span>
        </div>
      </div>

      <div className={`block-flash ${displayOn ? 'display-on' : ''}`}></div>
    </div>
  );
};

export default CardMatchingBlock;

