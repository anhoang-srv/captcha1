import React, { useState, useEffect } from 'react';
import '../styles/quizBlock.css';

const QuizBlock = ({ difficulty = 1, onSuccess, onFailure, playSound }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [verified, setVerified] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    
    // Bộ câu hỏi Hẹn Hò App - Hài Hước và Relatable
    const datingAppQuestions = React.useMemo(() => [
        {
            question: "Khi ai đó viết: \"I'm an adventurous person\" trên Tinder - Thực tế họ là?",
            options: [
                "Từng leo 5 ngọn núi khó nhất thế giới",
                "Đã đi du lịch 1 lần trong 5 năm qua",
                "Thích thử quán ăn mới gần nhà",
                "Vừa hoàn thành vòng quanh thế giới"
            ],
            correctAnswer: 1
        },
        {
            question: "Bio Bumble: \"Entrepreneur & CEO of my own business\" - Thực chất công việc là?",
            options: [
                "Chủ tịch tập đoàn lớn",
                "Bán hàng online trên Shopee/Lazada",
                "Giám đốc điều hành startup unicorn",
                "Chủ sở hữu chuỗi cửa hàng toàn quốc"
            ],
            correctAnswer: 1
        },
        {
            question: "Match nói: \"Looking for someone serious\" - Người này vừa?",
            options: [
                "Định hôn vào tháng tới",
                "Chia tay hôm qua, muốn quên bằng cách hẹn hò",
                "Độc thân 10 năm và thực sự muốn ổn định",
                "Kết hôn được 2 năm rồi"
            ],
            correctAnswer: 1
        },
        {
            question: "Profile pic là ảnh hóa trang thành siêu nhân/hoàng tử Disney - Người này muốn gửi thông điệp?",
            options: [
                "Tôi yêu thích hóa trang và diễn kịch",
                "Đừng mong thấy mặt thật tôi, bạn đang chọn nhân vật phim",
                "Tôi có tài năng nghệ thuật rất cao",
                "Tôi thích cosplay và những thứ kỳ quặc"
            ],
            correctAnswer: 1
        },
        {
            question: "Người viết: \"I'm very deep and philosophical\" trên app hẹn hò - Thực tế họ?",
            options: [
                "Là giáo sư triết học tại đại học",
                "Xem meme cả ngày và gọi đó là 'deep content'",
                "Đã đọc hết 50 cuốn sách tâm lý nặng",
                "Thích thảo luận chính trị quốc tế"
            ],
            correctAnswer: 1
        },
        {
            question: "Bio nói: \"Fluent in sarcasm\" - Người này muốn cảnh báo?",
            options: [
                "Tôi biết nói sarcasm tiếng Anh rất giỏi",
                "Tôi là kẻ khó tính, nếu không chịu được thì đừng chat với tôi",
                "Tôi rất vui vẻ, hài hước và yêu đùa cợt",
                "Tôi là giáo viên tiếng Anh chuyên dạy sarcasm"
            ],
            correctAnswer: 1
        },
        {
            question: "Bạn match mới gửi tin nhắn đầu tiên: \"Hey\" - Ý định thật của họ là?",
            options: [
                "Chỉ nói chuyện ngắn gọn vì đang bận",
                "Copy template gửi cho 50 người cùng lúc, xem ai trả lời",
                "Muốn xem bạn sẽ nói gì và có vui không",
                "Đang kiểm tra xem app có hoạt động bình thường không"
            ],
            correctAnswer: 1
        },
        {
            question: "Nam giới viết \"6 feet tall\" (185cm) - Chiều cao thực tế là?",
            options: [
                "Đúng 185cm như đúng trên app",
                "Khoảng 175cm, cộng thêm chiều cao từ giày Timberland",
                "182cm, được đo lúc vừa thức dậy sáng",
                "Chưa từng được đo thực tế, chỉ đoán"
            ],
            correctAnswer: 1
        },
        {
            question: "Người vừa từ chối match, 2 tháng sau gửi: \"Hey, bạn khỏe không?\" - Lý do là?",
            options: [
                "Quả thực muốn làm quen lại sau 2 tháng suy nghĩ",
                "Vừa bị bạn trai/gái tròn nên đang tìm người backup",
                "Bạn đó chưa trả lời ai 2 tháng nên thử lại",
                "Buồn chán nên gửi lại cho tất cả mọi người"
            ],
            correctAnswer: 1
        },
        {
            question: "Bio viết: \"No drama, looking for real connection\" - Sự thật là?",
            options: [
                "Người này thực sự đã qua trải và muốn tìm người yên tĩnh",
                "Vừa vỡ mộng vì mối tình 'có drama', sẽ tìm drama lại trong 2 tuần",
                "Là người rất bình tĩnh, chưa bao giờ gây xung đột",
                "Từng là tài tử/nữ diễn viên có scandal"
            ],
            correctAnswer: 1
        }
    ], []);
    
    // Chọn câu hỏi ngẫu nhiên
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * datingAppQuestions.length);
        setCurrentQuestion(datingAppQuestions[randomIndex]);
        setSelectedOption(null);
        setVerified(null);
    }, [datingAppQuestions]);
    
    // Thêm class khi xác nhận thành công
    useEffect(() => {
        if (verified === true) {
            const block = document.querySelector('.quiz-block');
            if (block) {
                block.classList.add('verified-success');
            }
        }
    }, [verified]);
    
    // Xử lý khi người chơi chọn đáp án
    const handleOptionSelect = (optionIndex) => {
        if (verified !== null) return;
        
        setSelectedOption(optionIndex);
        playSound('click');
        
        // Kiểm tra đáp án sau một chút delay để người dùng thấy option được chọn
        setTimeout(() => {
            const isCorrect = optionIndex === currentQuestion.correctAnswer;
            setVerified(isCorrect);
            
            if (isCorrect) {
                playSound('success');
                setTimeout(() => {
                    onSuccess();
                }, 1000); // Giảm từ 1500ms xuống 1000ms để mượt hơn
            } else {
                playSound('error');
                setTimeout(() => {
                    onFailure();
                }, 1200); // Giảm từ 2000ms xuống 1200ms
            }
        }, 200);
    };
    
    // Nếu chưa có câu hỏi, hiển thị loading
    if (!currentQuestion) {
        return (
            <div className="quiz-block">
                <div className="quiz-header">
                    <div className="quiz-title">🔥 Hẹn Hò App Thật Tế 💕</div>
                    <div className="quiz-subtitle">Đang tải câu hỏi...</div>
                </div>
                <div className="quiz-content loading">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }
    
    return (
        <div className={`quiz-block ${verified !== null ? (verified ? 'verified-success' : 'verified-failed') : ''}`}>
            <div className="quiz-header">
                <div className="quiz-title">🔥 Hẹn Hò App Thật Tế 💕</div>
                <div className="quiz-subtitle">Bạn hiểu rõ về thế giới Tinder, Bumble, Hinge không?</div>
            </div>
            
            <div className="quiz-content">
                <div className="quiz-question">{currentQuestion.question}</div>
                
                <div className="quiz-options">
                    {currentQuestion.options.map((option, index) => (
                        <div 
                            key={index}
                            className={`quiz-option ${selectedOption === index ? 'selected' : ''} 
                                      ${verified !== null && index === currentQuestion.correctAnswer ? 'correct' : ''}
                                      ${verified === false && selectedOption === index ? 'incorrect' : ''}`}
                            onClick={() => handleOptionSelect(index)}
                        >
                            <div className="option-checkbox">
                                {selectedOption === index && <div className="option-checkbox-inner"></div>}
                            </div>
                            <div className="option-text">{option}</div>
                        </div>
                    ))}
                </div>
                
                {verified !== null && (
                    <div className={`quiz-feedback ${verified ? 'success' : 'error'}`}>
                        {verified 
                            ? '✓ Chính xác! Bạn là chuyên gia Tinder/Bumble! 😎 Bạn nên viết cuốn sách về điều này.' 
                            : `✗ Sai rồi! Đáp án đúng là: "${currentQuestion.options[currentQuestion.correctAnswer]}"`
                        }
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizBlock;
