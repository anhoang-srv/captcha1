# 🌐 Hướng Dẫn Truy Cập Live Server Từ Mạng LAN

## 📌 Thông Tin Máy Hiện Tại

- **IP Address**: `10.122.69.166`
- **Live Server Default Port**: `5500` (có thể thay đổi)

---

## 1️⃣ CÁCH KIỂM TRA PORT CỦA LIVE SERVER

### Cách 1: Xem ở Status Bar (Thanh trạng thái)

Khi Live Server đang chạy:
- Nhìn xuống góc dưới bên phải của VS Code
- Bạn sẽ thấy: **"Port: 5500"** hoặc **"🔴 Port: 5500"**
- Click vào đó để xem thông tin chi tiết

### Cách 2: Xem ở Output Panel

1. Mở Output panel: `View` → `Output` (hoặc `Ctrl+Shift+U`)
2. Chọn "Live Server" trong dropdown
3. Bạn sẽ thấy log như:
   ```
   [Live Server] Server is Started at port 5500
   [Live Server] Serving "c:\Users\Haha\Desktop\Captcha\Test1\captcha-game\frontend\build"
   ```

### Cách 3: Xem trên Browser

Khi Live Server mở browser, URL sẽ hiển thị port:
- `http://127.0.0.1:5500/index.html`
- `http://localhost:5500/index.html`

Số `5500` chính là port đang sử dụng.

### Cách 4: Kiểm tra trong Settings

1. Mở Settings: `File` → `Preferences` → `Settings` (hoặc `Ctrl+,`)
2. Tìm kiếm: `liveServer.settings.port`
3. Xem giá trị hiện tại (mặc định: 5500)

---

## 2️⃣ TRUY CẬP TỪ MÁY KHÁC TRONG MẠNG LAN

### A. Lấy Địa Chỉ IP Của Máy Chạy Live Server

#### Trên Windows:

**Cách 1: Dùng Command Prompt**
```cmd
ipconfig
```
Tìm dòng `IPv4 Address` trong phần adapter mạng đang dùng (WiFi hoặc Ethernet):
```
IPv4 Address. . . . . . . . . . . : 10.122.69.166
```

**Cách 2: Dùng PowerShell (Nhanh hơn)**
```powershell
ipconfig | findstr /i "IPv4"
```

**Cách 3: Xem trong Settings**
- `Settings` → `Network & Internet` → `WiFi` (hoặc `Ethernet`)
- Click vào mạng đang kết nối
- Xem `IPv4 address`

**IP của máy anh hiện tại**: `10.122.69.166`

---

### B. Cấu Hình Live Server Cho Phép Truy Cập LAN

Mặc định, Live Server **ĐÃ CHO PHÉP** truy cập từ LAN, nhưng để chắc chắn:

#### Tạo/Chỉnh sửa file cấu hình VS Code

**File**: `.vscode/settings.json` (trong thư mục dự án)

```json
{
  "liveServer.settings.port": 5500,
  "liveServer.settings.host": "0.0.0.0",
  "liveServer.settings.useLocalIp": true,
  "liveServer.settings.root": "/frontend/build",
  "liveServer.settings.CustomBrowser": "chrome",
  "liveServer.settings.NoBrowser": false,
  "liveServer.settings.ignoreFiles": [
    ".vscode/**",
    "**/*.scss",
    "**/*.sass",
    "**/node_modules/**"
  ]
}
```

**Giải thích các settings quan trọng:**

- `"host": "0.0.0.0"` - Cho phép truy cập từ mọi IP (bao gồm LAN)
- `"useLocalIp": true` - Hiển thị local IP khi khởi động
- `"port": 5500` - Port cố định (dễ nhớ)
- `"root": "/frontend/build"` - Thư mục gốc để serve

---

### C. Định Dạng URL Để Truy Cập Từ Máy Khác

Sau khi Live Server chạy, từ **máy khác trong cùng mạng LAN**:

#### URL Format:
```
http://<IP_CỦA_MÁY_CHẠY_LIVE_SERVER>:<PORT>
```

#### Ví dụ với máy của anh:
```
http://10.122.69.166:5500
```

Hoặc nếu có file cụ thể:
```
http://10.122.69.166:5500/index.html
```

#### Truy cập từ:
- ✅ Máy tính khác (Windows/Mac/Linux)
- ✅ Điện thoại (Android/iOS)
- ✅ Tablet
- ✅ Bất kỳ thiết bị nào trong cùng mạng WiFi/LAN

---

### D. Các Bước Thực Hiện Chi Tiết

#### Bước 1: Chuẩn bị ứng dụng

```bash
# Build production (nếu chưa)
cd frontend
npm run build
```

#### Bước 2: Cấu hình Live Server

Tạo file `.vscode/settings.json` với nội dung ở phần B.

#### Bước 3: Khởi động Live Server

1. Mở file `frontend/build/index.html` trong VS Code
2. Click chuột phải → "Open with Live Server"
3. Hoặc click "Go Live" ở status bar

#### Bước 4: Kiểm tra Output

Trong Output panel, bạn sẽ thấy:
```
[Live Server] Server is Started at port 5500
[Live Server] Serving "c:\Users\Haha\Desktop\Captcha\Test1\captcha-game\frontend\build"
[Live Server] Local: http://127.0.0.1:5500
[Live Server] Network: http://10.122.69.166:5500
```

**Chú ý dòng "Network"** - đây chính là URL để truy cập từ máy khác!

#### Bước 5: Truy cập từ thiết bị khác

Trên điện thoại/máy tính khác:
1. Kết nối vào **cùng mạng WiFi/LAN**
2. Mở browser
3. Nhập: `http://10.122.69.166:5500`
4. Enjoy! 🎉

---

## 3️⃣ CÁC VẤN ĐỀ CÓ THỂ GẶP PHẢI & CÁCH KHẮC PHỤC

### ❌ Vấn đề 1: Không truy cập được từ máy khác

**Nguyên nhân**: Windows Firewall chặn kết nối

**Giải pháp**:

#### Cách 1: Cho phép qua Firewall (Khuyến nghị)

1. Mở **Windows Defender Firewall**:
   - `Control Panel` → `System and Security` → `Windows Defender Firewall`
   - Hoặc tìm kiếm "Firewall" trong Start Menu

2. Click **"Allow an app or feature through Windows Defender Firewall"**

3. Click **"Change settings"** (cần quyền admin)

4. Tìm **"Node.js"** hoặc **"Code.exe"** (VS Code) trong danh sách

5. Tick cả 2 ô: **Private** và **Public**

6. Click **OK**

#### Cách 2: Tạo Firewall Rule mới (Nâng cao)

Mở PowerShell **với quyền Administrator**:

```powershell
# Cho phép port 5500 (Live Server)
New-NetFirewallRule -DisplayName "Live Server Port 5500" -Direction Inbound -LocalPort 5500 -Protocol TCP -Action Allow

# Kiểm tra rule đã tạo
Get-NetFirewallRule -DisplayName "Live Server Port 5500"
```

#### Cách 3: Tắt Firewall tạm thời (KHÔNG khuyến nghị)

⚠️ Chỉ dùng để test, nhớ bật lại sau!

```powershell
# Tắt firewall (cần admin)
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False

# Bật lại sau khi test
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
```

---

### ❌ Vấn đề 2: Port 5500 đã bị chiếm

**Triệu chứng**: Live Server báo lỗi hoặc tự động chuyển sang port khác (5501, 5502...)

**Giải pháp**:

#### Cách 1: Kiểm tra port nào đang dùng

```cmd
netstat -ano | findstr :5500
```

Nếu có kết quả, port đang bị chiếm.

#### Cách 2: Đổi port trong settings

Trong `.vscode/settings.json`:
```json
{
  "liveServer.settings.port": 5501
}
```

Sau đó truy cập: `http://10.122.69.166:5501`

---

### ❌ Vấn đề 3: Thiết bị không cùng mạng

**Triệu chứng**: Không kết nối được dù đã tắt firewall

**Kiểm tra**:

1. **Trên máy chạy Live Server**:
   ```cmd
   ipconfig
   ```
   Xem IP: `10.122.69.166`

2. **Trên thiết bị muốn truy cập**:
   - Android: `Settings` → `WiFi` → Tap vào mạng đang kết nối → Xem IP
   - iOS: `Settings` → `WiFi` → (i) → Xem IP
   - Windows: `ipconfig`

3. **So sánh 3 số đầu**:
   - Máy 1: `10.122.69.166` → `10.122.69`
   - Máy 2: `10.122.69.xxx` → `10.122.69` ✅ Cùng mạng
   - Máy 3: `192.168.1.xxx` → `192.168.1` ❌ Khác mạng

**Giải pháp**: Kết nối cả 2 thiết bị vào cùng WiFi/LAN

---

### ❌ Vấn đề 4: CORS errors (với React app)

**Triệu chứng**: Console browser báo lỗi CORS khi gọi API

**Giải pháp**: Đã được xử lý trong dự án này (có CORS config trong backend)

Nếu vẫn gặp lỗi, kiểm tra:
- Backend có đang chạy không?
- API endpoint có đúng không?

---

### ❌ Vấn đề 5: Tốc độ chậm trên LAN

**Nguyên nhân**: Mạng WiFi yếu hoặc nhiều thiết bị

**Giải pháp**:
- Dùng Ethernet cable (dây mạng) thay vì WiFi
- Đảm bảo router gần thiết bị
- Giảm số thiết bị kết nối WiFi

---

## 4️⃣ KIỂM TRA VÀ TEST KẾT NỐI

### Test 1: Ping từ thiết bị khác

Trên thiết bị muốn truy cập:

**Windows/Mac/Linux**:
```bash
ping 10.122.69.166
```

**Kết quả mong đợi**:
```
Reply from 10.122.69.166: bytes=32 time=2ms TTL=128
```

Nếu thấy "Request timed out" → Kiểm tra firewall hoặc mạng

---

### Test 2: Telnet kiểm tra port

```cmd
telnet 10.122.69.166 5500
```

Nếu kết nối thành công → Port đang mở
Nếu lỗi → Firewall chặn hoặc Live Server chưa chạy

---

### Test 3: Truy cập từ chính máy chạy Live Server

Thử cả 3 URL này trên máy chạy Live Server:
1. `http://localhost:5500` ✅
2. `http://127.0.0.1:5500` ✅
3. `http://10.122.69.166:5500` ✅

Nếu URL 3 không hoạt động → Vấn đề về cấu hình Live Server

---

## 5️⃣ TÓM TẮT NHANH

### Để truy cập từ máy khác:

1. **Build app**: `cd frontend && npm run build`
2. **Cấu hình**: Tạo `.vscode/settings.json` (xem phần B)
3. **Chạy Live Server**: Mở `frontend/build/index.html` → "Open with Live Server"
4. **Lấy IP**: `ipconfig` → Tìm IPv4 Address
5. **Truy cập**: `http://<IP>:5500` từ thiết bị khác
6. **Nếu lỗi**: Kiểm tra Firewall (xem phần 3)

### URL của anh:
```
http://10.122.69.166:5500
```

---

## 6️⃣ BONUS: QR CODE ĐỂ TRUY CẬP NHANH

Tạo QR code cho URL để quét bằng điện thoại:

1. Truy cập: https://www.qr-code-generator.com/
2. Chọn "URL"
3. Nhập: `http://10.122.69.166:5500`
4. Download QR code
5. Quét bằng camera điện thoại → Tự động mở browser

---

## 📞 Troubleshooting Checklist

- [ ] Live Server đang chạy?
- [ ] Đã build production? (`npm run build`)
- [ ] Cùng mạng WiFi/LAN?
- [ ] IP address đúng? (`ipconfig`)
- [ ] Port đúng? (xem Output panel)
- [ ] Firewall đã cho phép?
- [ ] Ping được máy chủ?
- [ ] URL format đúng? (`http://IP:PORT`)

---

Chúc anh test thành công! 🚀

