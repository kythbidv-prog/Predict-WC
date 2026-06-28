# World Cup Predictor - GitHub Pages + Firebase

Website dự đoán kết quả World Cup cho nhóm/phòng ban.

## Tính năng
- Giao diện đẹp, responsive cho điện thoại.
- Tạo user đơn giản bằng tên đăng nhập + mật khẩu.
- Lưu dự đoán online bằng Firebase Firestore.
- Admin sửa lịch thi đấu, kết quả, tỷ lệ cược 1X2, châu Á, tài/xỉu.
- Tự tính điểm: đúng tỷ số 5 điểm, đúng kết quả 3 điểm, sai 0 điểm.
- Bảng xếp hạng realtime.
- Chạy trên GitHub Pages.

## Cách cài Firebase
1. Vào Firebase Console và tạo project.
2. Authentication > Sign-in method > bật Email/Password.
3. Firestore Database > Create database.
4. Project settings > Your apps > tạo Web app.
5. Copy firebaseConfig và dán vào `firebase-config.js`.
6. Firestore Database > Rules > dán nội dung `firestore.rules` > Publish.

## Tạo admin đầu tiên
1. Chạy website và tạo user mới.
2. Sau khi đăng nhập, góc phải sẽ hiện UID.
3. Copy UID.
4. Vào Firestore Database, tạo collection `admins`.
5. Tạo document có ID đúng bằng UID vừa copy. Có thể thêm field `role: admin`.
6. Refresh website, tab Quản trị sẽ hiện ra.

## Upload lên GitHub Pages
1. Tạo repository mới, ví dụ `worldcup-predictor`.
2. Upload toàn bộ file trong thư mục này.
3. Settings > Pages.
4. Source: Deploy from a branch.
5. Branch: main, Folder: /(root), Save.

## Cập nhật kết quả liên tục
Bản này cập nhật realtime khi admin nhập kết quả trong tab Quản trị. Nếu muốn tự động lấy kết quả từ API bóng đá, không đặt API key trực tiếp trong frontend; hãy dùng Firebase Cloud Functions, Cloudflare Worker hoặc GitHub Actions làm lớp trung gian.

## Lưu ý
Website chỉ phục vụ dự đoán vui/nội bộ, không xử lý nạp/rút tiền, không cá cược tiền thật.
