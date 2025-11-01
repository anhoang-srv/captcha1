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

    *   Tối ưu hóa hiệu suất:
            
            - Virtual DOM: Chỉ re-render các ô thay đổi
            - Event Delegation: Sử dụng một event listener cho toàn bộ board
            - RequestAnimationFrame: Cho animations mượt mà
            - Web Workers: Xử lý thuật toán flood-fill cho boards lớn
9. Pipe Puzzle
    *   Cơ chế chơi:
        -   Lưới chơi: Một bảng ô vuông (grid) khoảng 5x6 ô
        -   Các điểm nối: Các hình tròn ở các vị trí khác nhau trên lưới, mỗi màu đại diện cho một cặp điểm
        -   Các đường nối: Các đường cong/thẳng nối các điểm cùng màu lại với nhau
        -   Tương tác: Người chơi nhấp chuột vào các ô để vẽ/kết nối các đường từ điểm này đến điểm khác
    *   Mục tiêu/Nhiệm vụ:
        -   Mỗi cặp điểm cùng màu phải được kết nối bằng một đường liên tục
        -   Các đường phải không giao nhau
        -   Mỗi ô trong lưới chỉ được sử dụng một lần
        -   Phải kết nối tất cả các cặp và lấp đầy toàn bộ lưới để thắng
    *   Thiết kế gameplay:
        -   Giao diện: Hiển thị giao diện captcha như các level khác, lưới ô vuông (5*5), các điểm nối (3-4 cặp) và đường vẽ
        -   Hiệu ứng: Vẽ đường khi nhấp chuột, kiểm tra và đánh dấu khi kết nối thành công
        -   Thử thách: Các cặp điểm sẽ xuất hiện ngẫu nhiên trên lưới, yêu cầu sự chính xác và suy nghĩ logic để kết nối các cặp điểm (Lưu ý các cặp điểm sẽ xuất hiện với điều kiện có thể cho người chơi hoàn thành được level )
10. Card Matching
    *   Cơ Chế Chơi:

        -   Mục Tiêu Của Trò Chơi: Người chơi cần tìm và ghép các cặp hình giống nhau trong thời gian giới hạn hoặc với số lượt tối thiểu.

        -   Cách Thực Hiện:

            +   Trò chơi sẽ có một bảng gồm các ô chứa các hình ảnh (ảnh hoa quả). Các hình ảnh này sẽ được xáo trộn và ẩn dưới những ô vuông.

            +   Người chơi cần nhấp vào hai ô bất kỳ để mở chúng ra. Nếu hai hình ảnh trong các ô đó giống nhau, chúng sẽ được giữ lại và người chơi có thể chọn tiếp.

            +   Nếu hai hình ảnh không giống nhau, chúng sẽ bị ẩn lại và người chơi tiếp tục thử.

        -   Điều Kiện Thắng: Người chơi thắng khi đã tìm hết tất cả các cặp hình giống nhau mà không hết lượt chơi hoặc thời gian (tuỳ vào cách thiết kế).

        -   Điều Kiện Thua: Người chơi thua nếu:

            +   Không tìm đủ các cặp hình trong thời gian quy định.

            +   Hết lượt chơi mà vẫn chưa tìm hết tất cả các cặp hình.
    *   Thiết Kế Gameplay
        -   Màn Hình Chính: 
            +   Giao diện giống các màn hình chơi của các level khác phù hợp để làm captcha.

        -   Bảng Chơi: Một bảng với nhiều ô vuông xếp theo dạng lưới (ví dụ: 4x4, 6x6), mỗi ô chứa một hình ảnh ẩn.

        -   Các Cấp Độ (Levels): Trò chơi có thể có nhiều cấp độ từ dễ đến khó:

        -   Cấp độ dễ: 4x4 lưới, số lượng cặp hình ít.

        -   Cấp độ khó: 6x6 hoặc 8x8 lưới, số lượng cặp hình tăng lên.

    *   Điều Khiển (Controls)

        -   Click để mở hình: Người chơi chỉ cần nhấp vào các ô vuông để mở chúng ra.
