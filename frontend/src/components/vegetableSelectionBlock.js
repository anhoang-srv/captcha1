import React, { useState, useEffect } from 'react';
import '../styles/vegetableSelectionBlock.css';

const VegetableSelectionBlock = ({ onSuccess, onFailure, playSound }) => {
  const [images, setImages] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [displayOn, setDisplayOn] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [gameStatus, setGameStatus] = useState('playing');

  // Danh sách rau củ và hoa quả
  const vegetables = [
    '/captcha-images/vegetables/bi_ngo.png',
    '/captcha-images/vegetables/ca_chua.png',
    '/captcha-images/vegetables/dua_chuot.png',
    '/captcha-images/vegetables/ot.png'
  ];

  const fruits = [
    '/captcha-images/fruits/cam.png',
    '/captcha-images/fruits/chuoi.png',
    '/captcha-images/fruits/le.png',
    '/captcha-images/fruits/mang_cau.png',
    '/captcha-images/fruits/tao.png',
    '/captcha-images/fruits/xoai.png'
  ];

  // Khởi tạo game
  useEffect(() => {
    initializeGame();
    setTimeout(() => setDisplayOn(true), 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeGame = () => {
    // Chọn 3 rau củ ngẫu nhiên
    const selectedVegetables = vegetables
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Chọn 6 hoa quả ngẫu nhiên
    const selectedFruits = fruits
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    // Kết hợp và xáo trộn
    const allImages = [
      ...selectedVegetables.map(img => ({ url: img, type: 'vegetable', clicked: false })),
      ...selectedFruits.map(img => ({ url: img, type: 'fruit', clicked: false }))
    ].sort(() => Math.random() - 0.5);

    setImages(allImages);
    setSelectedCount(0);
    setGameOver(false);
  };

  const handleImageClick = (index) => {
    if (gameOver || !displayOn) return;

    const newImages = [...images];
    const clickedImage = newImages[index];

    if (clickedImage.clicked) {
      // Bỏ chọn
      clickedImage.clicked = false;
      setSelectedCount(selectedCount - 1);
      setImages(newImages);
    } else {
      // Chọn
      clickedImage.clicked = true;
      const newCount = selectedCount + 1;
      setSelectedCount(newCount);
      setImages(newImages);
    }
  };

  const clickVerify = () => {
    setDisplayOn(false);

    // Kiểm tra xem có chọn hoa quả nào không
    const hasFruitSelected = images.some(img => img.type === 'fruit' && img.clicked);

    // Kiểm tra xem có chọn đủ 3 rau củ không
    const vegetablesSelected = images.filter(img => img.type === 'vegetable' && img.clicked).length;

    // Logic: Phải chọn đúng 3 rau củ và không chọn hoa quả nào
    const isCorrect = vegetablesSelected === 3 && !hasFruitSelected;

    if (isCorrect) {
      // Thắng
      setGameOver(true);
      setGameStatus('success');
      setFeedbackMessage('Xác thực thành công!');
      playSound('beep');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      // Thua - Hiển thị thông báo lỗi chi tiết
      setGameOver(true);
      setGameStatus('failure');

      // Xác định lỗi cụ thể
      let errorMessage = '';
      if (hasFruitSelected) {
        errorMessage = '❌ Bạn đã chọn hoa quả! Chỉ được chọn rau củ.';
      } else if (vegetablesSelected < 3) {
        errorMessage = `❌ Bạn chỉ chọn ${vegetablesSelected}/3 rau củ! Phải chọn đủ 3 rau củ.`;
      } else if (vegetablesSelected > 3) {
        errorMessage = `❌ Bạn chọn ${vegetablesSelected}/3 rau củ! Chỉ được chọn đúng 3 rau củ.`;
      } else {
        errorMessage = '❌ Bạn đã chọn sai rồi!';
      }

      setFeedbackMessage(errorMessage);
      playSound('game-over');
      setTimeout(() => {
        onFailure();
      }, 2000); // Tăng delay lên 2 giây để người chơi đọc thông báo
    }
  };

  return (
    <div className={`vegetable-selection-block ${displayOn ? 'display-on' : ''}`}>
      <div className="vegetable-banner">
        <p>Để xác minh bạn là con người, vui lòng</p>
        <h1>Chọn tất cả những rau củ</h1>
        <p>Nhấn VERIFY khi đã chọn xong.</p>
      </div>

      {feedbackMessage && (
        <div className={`feedback-message ${gameStatus}`}>
          {feedbackMessage}
        </div>
      )}

      <div className="vegetable-grid">
        {images.map((image, index) => (
          <div
            key={index}
            className={`vegetable-item ${image.clicked ? 'selected' : ''}`}
            onClick={() => handleImageClick(index)}
          >
            <img src={image.url} alt={`item-${index}`} />
            {image.clicked && <div className="checkmark">✓</div>}
          </div>
        ))}
      </div>

      <div className="vegetable-footer">
        <button className="verify-button" onClick={clickVerify}>VERIFY</button>
      </div>

      <div className={`block-flash ${displayOn ? 'display-on' : ''}`}></div>
    </div>
  );
};

export default VegetableSelectionBlock;

