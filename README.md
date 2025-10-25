# I'm Not a Robot! - CAPTCHA Parody Game

## Giới thiệu

"I'm Not a Robot!" là một trò chơi parody CAPTCHA được tạo ra để giúp người chơi thử thách khả năng của mình qua các level ngày càng khó. Game được xây dựng với React frontend và Express.js backend.

## Tính năng

- **Progressive Difficulty**: Mỗi level có nhiều CAPTCHA blocks hơn với độ khó tăng dần
- **Multiple Challenge Types**: 
  - Skew (méo hình ảnh)
  - Negative (đảo màu)
  - Rotate (xoay hình ảnh) 
  - Movement (hình ảnh di chuyển)
  - Four (grid 4x4 thay vì 3x3)
- **Timer System**: 10 giây để hoàn thành mỗi level
- **Leaderboard**: Lưu trữ điểm số cao nhất
- **Sound Effects**: Hiệu ứng âm thanh cho trải nghiệm tốt hơn
- **6 Image Categories**: bicycles, bridges, cars, crosswalks, streetlights, trains

## Cấu trúc dự án

```
captcha-game/
├── backend/                 # Express.js server
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── server.js           # Main server file
│   └── package.json
├── frontend/               # React app
│   ├── public/
│   │   ├── captcha-images/ # CAPTCHA images (6 categories)
│   │   └── sounds/         # Sound effects
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── styles/         # CSS files
│   │   └── App.js
│   └── package.json
└── README.md
```

## Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js (v16 hoặc cao hơn)
- MongoDB (local hoặc MongoDB Atlas)

### Backend
```bash
cd backend
npm install
npm start
# Server sẽ chạy trên http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start
# App sẽ chạy trên http://localhost:3000
```

### Cấu hình môi trường

Tạo file `.env` trong thư mục backend:
```
MONGODB_URI=mongodb://localhost:27017/captcha-game
PORT=5000
```

## Cách chơi

1. **Start Screen**: Click vào checkbox "I'm not a robot" để bắt đầu
2. **Menu**: Chọn "New Game" để bắt đầu chơi
3. **Game**: 
   - Chọn tất cả hình ảnh thuộc loại được yêu cầu
   - Click "VERIFY" khi hoàn thành
   - Bạn có 10 giây để hoàn thành mỗi level
4. **Game Over**: Nhập tên để lưu điểm số vào leaderboard

## Game Logic

- **Level Progression**: Mỗi level sẽ có thêm CAPTCHA blocks và challenges phức tạp hơn
- **Challenge Combination**: Các challenges có thể kết hợp với nhau (ví dụ: skew + rotate)
- **Scoring**: Điểm số dựa trên level cao nhất đạt được
- **Failure Conditions**: 
  - Chọn sai hình ảnh khi verify
  - Hết thời gian (10 giây)

## Technologies Used

### Frontend
- React 18
- React Router DOM
- CSS3 với animations
- HTML5 Audio API

### Backend  
- Express.js
- MongoDB với Mongoose
- CORS middleware
- dotenv for environment variables

## API Endpoints

### Scoreboard
- `GET /scoreboard/` - Lấy top 10 điểm cao nhất
- `POST /scoreboard/` - Thêm điểm số mới
  ```json
  {
    "name": "PlayerName",
    "level": 5
  }
  ```

## Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Dự án này được phân phối dưới MIT License.

## Credits

Game được tạo cảm hứng từ CAPTCHA systems và mong muốn tạo ra một trải nghiệm giải trí từ việc "chứng minh bạn không phải robot".