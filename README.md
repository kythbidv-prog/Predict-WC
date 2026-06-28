# Predict-WC Full Reset

## Cách chạy lại nhanh

1. Upload toàn bộ file trong ZIP này lên GitHub repo `Predict-WC`, đè file cũ.
2. Vào Firebase > Firestore Database > Rules.
3. Dán nội dung file `firestore.rules` rồi Publish.
4. Mở web.
5. Tạo user:
   - Tên đăng nhập: admin
   - Mật khẩu: tối thiểu 6 ký tự, ví dụ admin123
6. Đăng nhập bằng admin.
7. Tab Quản trị sẽ hiện ra.
8. Bấm "Nạp 88 trận".
9. User thường tạo tài khoản khác để dự đoán.

## Ghi chú
- Admin là username `admin`, không cần tạo collection admins nữa.
- Dữ liệu dự đoán nằm trong collection `predictions`.
- Lịch/kết quả nằm trong collection `matches`.
- Trận đã đá bị khóa, trận chưa đá mở dự đoán.
