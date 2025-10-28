Bạn là một lập trình viên có trình độ của một Senior Game Developer với hơn 10 năm kinh nghiệm trong việc phát triển các trò chơi phức tạp và đa nền tảng. Bạn có kiên thức về làm game để deploy lên web. Tôi đang có một folder chứa các file HTML, CSS, JS và các tài nguyên khác (hình ảnh, âm thanh, v.v.) để tạo thành một trò chơi web hoàn chỉnh. Tôi muốn bạn hãy làm một game tương tự như vậy. Để tôi chạy được demo có đầy đủ các level và tính năng như trong folder đó. Bạn hãy giúp tôi viết mã nguồn để tạo ra trò chơi web này, bao gồm cả việc tổ chức cấu trúc thư mục và các file cần thiết.

### New Levels and Features to Implement:
New Level: 
1. Giải đố logic (Sắp xếp mảnh ghép)

    *   Cơ chế chơi: Người chơi cần sắp xếp các mảnh ghép để tạo thành một hình ảnh hoàn chỉnh.

    *   Thiết kế:

        -   Bức tranh bị cắt thành nhiều mảnh ghép nhỏ.

        -   Mỗi mảnh ghép có thể là một phần của phong cảnh hoặc vật thể.

    *   Gameplay:

        -   Người chơi kéo và thả các mảnh ghép vào vị trí đúng để hoàn thành bức tranh.

    *   Tài nguyên cần thiết:

        -   Hình ảnh: Ảnh chất lượng cao cần chia thành các mảnh ghép.

        -   API: Có thể sử dụng API Canvas API để xử lý ảnh, giúp cắt và ghép lại các mảnh ghép.
2. Vẽ hình tròn chính xác

    *   Cơ chế chơi: Người chơi phải vẽ một hình tròn với độ chính xác nhất định (ví dụ: độ chính xác 94%).

    *   Thiết kế:

        -   Màn hình yêu cầu người chơi vẽ một hình tròn với bán kính chính xác.

    *   Gameplay:

        -   Người chơi sử dụng chuột hoặc bàn di để vẽ hình tròn. Sau khi vẽ xong, hệ thống sẽ kiểm tra độ chính xác của hình tròn.

    *   Tài nguyên cần thiết:

        -   API: Canvas API sẽ hỗ trợ việc vẽ hình tròn và kiểm tra độ chính xác của hình.
3. Chọn đúng câu trả lời

    *   Cơ chế chơi: Người chơi phải chọn câu trả lời đúng cho một câu hỏi đơn giản.

    *   Thiết kế:

        -   Câu hỏi về kiến thức đơn giản về tiếng Pháp (ví dụ: "À bien tôt" nghĩa là gì?).

    *   Gameplay:

        -   Người chơi chọn câu trả lời đúng từ các lựa chọn.

    *   Tài nguyên cần thiết:

        -   API AI: Có thể sử dụng DialogFlow để tạo các câu hỏi và phản hồi tự động.

        -   Hình ảnh: Không cần hình ảnh, chỉ cần giao diện câu hỏi.

4.  XOXO

    *  Cơ chế chơi: Người chơi chơi một ván Tic-Tac-Toe với AI.

    *  Thiết kế: Giao diện bàn cờ 3x3.

    *  Gameplay: Người chơi và AI thay phiên đánh dấu X và O.

    *  Tài nguyên cần thiết:

        -   API AI: Sử dụng thuật toán Minimax để tạo AI chơi Tic-Tac-Toe.

        -   Giao diện: Thiết kế bàn cờ và các biểu tượng X, O
5. Word Search
    *   Cơ chế chơi: Người chơi phải nhấn vào các chữ trong bảng chữ cái để tìm các từ được yêu c
    *   Thiết kế:

        Giao diện người dùng (UI):

        -   Bảng chữ cái phải rõ ràng và dễ nhìn, sử dụng phông chữ đơn giản và kích thước chữ đủ lớn.

        -   Màu sắc phải dễ nhìn, tránh quá nhiều màu sắc sáng vì sẽ gây phân tâm cho người chơi. Một bảng chữ cái trắng đen hoặc có màu sắc nhẹ nhàng là phù hợp. Khi người chơi ấn chọn chữ cái, sẽ có hiệu ứng tích như đã chọn captcha thông thường.

    *   Gameplay:

        -   Lối chơi chính: Người chơi sẽ có một bảng chữ cái chứa các từ mục tiêu mà họ cần tìm. Các từ có thể được xếp theo chiều ngang, dọc hoặc chéo. Họ sẽ phải tìm các từ này và chọn chúng bằng cách nhấn vào chữ cái.

    *   Tài nguyên cần thiết:

        -   Thuật toán tạo bảng chữ cái: Cần xây dựng một thuật toán để tạo bảng chữ cái ngẫu nhiên cho mỗi lần chơi. Thuật toán này sẽ phải đảm bảo rằng các từ có thể xuất hiện theo dạng ngang, dọc hoặc chéo mà không bị chồng chéo hoặc khó tìm.
6. Math Pro
    *   Mô tả cách chơi: Level này là một thử thách toán học yêu cầu người chơi sắp xếp các biểu thức toán học theo thứ tự từ nhỏ đến lớn. Người chơi cần tính toán giá trị của 9 biểu thức khác nhau và click chọn chúng theo đúng thứ tự.

    *   Các tương tác và điều khiển:
            Chuột: Click vào từng ô vuông chứa biểu thức theo thứ tự tăng dần
            Touch: Hỗ trợ touch trên mobile/tablet
    *   Visual feedback: Các ô đã chọn sẽ có hiệu ứng highlight hoặc đánh dấu
    *   Điều kiện thắng/thua:
            Thắng: Chọn đúng tất cả 9 biểu thức theo thứ tự từ nhỏ đến lớn
            Thua: Chọn sai thứ tự bất kỳ biểu thức nào
            Reset: Có nút refresh để bắt đầu lại
        -   Các biểu thức trong level:
            e³ ≈ 20.09
            ∞ (vô cực)
            √13 ≈ 3.61
            Σ(i=4 to 8) i = 30
            log₃(25) ≈ 2.93
            ∫₂⁵ x dx = 10.5
            4! = 24
            6π/2 ≈ 9.42
            12/13 ≈ 0.92
        -   Thứ tự đúng (từ nhỏ đến lớn):
            12/13 → log₃(25) → √13 → 6π/2 → ∫₂⁵ x dx → e³ → 4! → Σ(i=4 to 8) i → ∞
7.  Catch ducks
    *   Cơ chế chơi:

            Mục tiêu: Nhấp vào từng con vịt đang di chuyển để đưa chúng trở lại vào ô của chúng.

            Cách chơi: Khi bắt đầu, các con vịt sẽ xuất hiện và di chuyển tự do trên màn hình. Người chơi cần nhanh chóng nhấp vào từng con vịt để đưa chúng về vị trí ban đầu của chúng.

            Đặc điểm: Không có thời gian giới hạn, nhưng yêu cầu sự nhanh nhẹn và chính xác trong việc xác định và nhấp vào các con vịt.
    *   Thiết kế gameplay:

            Giao diện: Màn hình chia thành các ô vuông, mỗi ô chứa một con vịt.

            Hiệu ứng: Khi nhấp vào một con vịt, nó sẽ di chuyển về vị trí ban đầu của nó.

            Thử thách: Sự di chuyển ngẫu nhiên của các con vịt làm tăng độ khó, yêu cầu người chơi phải phản xạ nhanh và chính xác.  
8. Minesweeper Captcha - Không giới hạn thời gian
    *   Cơ chế chơi:
        
        -   Lần click đầu: Tạo board, đảm bảo không trúng mìn
            Mở ô: Flood fill nếu gặp ô trống (số 0)
            Thắng: Mở hết ô an toàn
            Thua: Mở phải mìn

        -   Điều kiện thành công Captcha: Người dùng phải mở ít nhất 70% ô an toàn hoặc cắm cờ chính xác ít nhất 6/9 mìn
    
    *   Thiết kế gameplay:
            
            - Thông số thiết kế:
                Lưới: 8x8 ô (64 ô tổng)
                Số mìn: 8-10 quả (12-15%)
                Thời gian: Không giới hạn
            - Thuật toán cốt lõi
                Đặt mìn an toàn: Tránh vùng 3x3 quanh ô đầu tiên
                Flood Fill: Mở tự động các ô liền kề khi gặp ô số 0
                Kiểm tra thắng: Tất cả ô không phải mìn đã được mở

            Tối ưu hóa hiệu suất:
                - Virtual DOM: Chỉ re-render các ô thay đổi
                - Event Delegation: Sử dụng một event listener cho toàn bộ board
                - RequestAnimationFrame: Cho animations mượt mà
                - Web Workers: Xử lý thuật toán flood-fill cho boards lớn