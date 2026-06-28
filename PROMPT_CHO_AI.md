# Prompt mô tả cho AI

Bạn là senior full-stack developer. Hãy tạo cho tôi một website dự đoán kết quả World Cup để triển khai bằng GitHub Pages và Firebase.

Yêu cầu:
1. Website chạy trên GitHub Pages, không cần server riêng.
2. Dùng Firebase Authentication để người chơi tạo tài khoản bằng tên đăng nhập và mật khẩu. Vì Firebase yêu cầu email, tự chuyển username thành email nội bộ dạng username@worldcup.local.
3. Dùng Firestore để lưu người chơi, trận đấu, tỷ lệ cược mô phỏng, dự đoán, kết quả và bảng xếp hạng.
4. Giao diện đẹp, phong cách thể thao/odds center: nền tối, card trận đấu, tỷ lệ 1X2, kèo châu Á, tài/xỉu, form nhập dự đoán, bảng xếp hạng realtime, responsive mobile.
5. Người chơi đăng nhập để nhập tỷ số dự đoán từng trận.
6. Trận đấu có trạng thái: chưa đá, đang đá, đã kết thúc.
7. Admin có thể tạo/sửa/xóa trận đấu, sửa giờ đá, nhập kết quả, khóa/mở dự đoán và sửa tỷ lệ cược 1X2, châu Á, tài/xỉu.
8. Khi admin cập nhật kết quả, bảng xếp hạng tự tính lại điểm.
9. Quy tắc điểm: đúng tỷ số 5 điểm, đúng kết quả thắng/hòa/thua 3 điểm, sai 0 điểm.
10. Firestore Rules: người chơi chỉ sửa dự đoán của chính mình; chỉ admin sửa trận đấu/kết quả/tỷ lệ. Admin là document trong collection admins có ID là UID.
11. Không xử lý tiền thật, không nạp/rút tiền, không cá cược thật.

Xuất đầy đủ mã nguồn: index.html, style.css, app.js, firebase-config.js, firestore.rules, README.md.
