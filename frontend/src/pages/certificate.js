import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import '../styles/certificate.css';

export default function Certificate({level, playSound}) {
    const navigate = useNavigate();
    const [displayOn, setDisplayOn] = useState(false);
    const [name, setName] = useState('');
    
    useEffect(() => {
        // Lấy tên người chơi từ local storage nếu có
        try {
            const savedLeaders = JSON.parse(localStorage.getItem('captchaLeaders') || '[]');
            if (savedLeaders.length > 0) {
                // Lấy tên từ entry có level cao nhất
                const topPlayer = savedLeaders.sort((a, b) => b.level - a.level)[0];
                setName(topPlayer.name || 'Human Player');
            } else {
                setName('Human Player');
            }
        } catch (error) {
            console.error('Error loading player name:', error);
            setName('Human Player');
        }
        
        // Animation fade in
        const fadeTimer = setTimeout(() => setDisplayOn(true), 300);
        
        // Play success sound
        playSound('success');
        
        return () => clearTimeout(fadeTimer);
    }, [playSound]);

    const getCertificateText = (level) => {
        if (level >= 24) {
            return "bằng cách hoàn thành TẤT CẢ các thử thách CAPTCHA và chứng minh khả năng tư duy độc đáo của con người.";
        } else if (level >= 15) {
            return `bằng cách hoàn thành ${level} level thử thách và thể hiện trí tuệ vượt trội của con người.`;
        } else {
            return `bằng cách hoàn thành ${level} level thử thách CAPTCHA một cách xuất sắc.`;
        }
    };

    const getCurrentDate = () => {
        const date = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('vi-VN', options);
    };

    const handleBackToMenu = () => {
        setDisplayOn(false);
        playSound('beep');
        setTimeout(() => navigate('/menu'), 600);
    };

    const displayClass = displayOn ? 'display-on' : '';

    return (
        <div className='certificate-page'>
            <div className={`certificate-container ${displayClass}`}>
                <div className="certificate">
                    <div className="certificate-border">
                        <div className="certificate-header">
                            <div className="logo">🤖</div>
                            <h1>Certificate of Humanity</h1>
                            <p className="subtitle">GIẤY CHỨNG NHẬN</p>
                        </div>
                        
                        <div className="certificate-content">
                            <p className="certificate-text">Chứng nhận rằng</p>
                            <p className="certificate-name">{name}</p>
                            <p className="certificate-text">đã chứng minh thành công</p>
                            <p className="certificate-title">KHÔNG PHẢI ROBOT</p>
                            <p className="certificate-details">
                                {getCertificateText(level)}
                            </p>
                            
                            <div className="certificate-stats">
                                <div className="stat-item">
                                    <div className="stat-number">{level}</div>
                                    <div className="stat-label">Levels Completed</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">100%</div>
                                    <div className="stat-label">Human Verified</div>
                                </div>
                            </div>
                            
                            <div className="certificate-seal">
                                <div className="seal-inner">
                                    <span className="seal-check">✓</span>
                                    <span className="seal-text">VERIFIED<br/>HUMAN</span>
                                </div>
                            </div>
                            
                            <p className="certificate-date">Ngày cấp: {getCurrentDate()}</p>
                            
                            <div className="certificate-signature">
                                <div className="signature-line"></div>
                                <p className="signature-label">CAPTCHA Verification System</p>
                            </div>
                        </div>
                        
                        <button className="menu-button" onClick={handleBackToMenu}>
                            <span className="button-icon">🏠</span>
                            Quay lại màn hình chính
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
