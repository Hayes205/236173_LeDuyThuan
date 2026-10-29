Ứng dụng quản lý món ăn

1. Giới thiệu

Dự án xây dựng hệ thống quản lý món ăn trên nền tảng đám mây. Ứng dụng sử dụng React để xây dựng giao diện người dùng, Node.js và Express để phát triển REST API, MongoDB Atlas để lưu trữ dữ liệu.

Mã nguồn được quản lý bằng Git và GitHub. Ứng dụng được đóng gói bằng Docker, lưu trữ image trên Docker Hub và triển khai trên Render.

2. Công nghệ sử dụng

Frontend: React, Vite

Backend: Node.js, Express

Database: MongoDB Atlas

Quản lý mã nguồn: Git, GitHub

Đóng gói ứng dụng: Docker

Lưu trữ image: Docker Hub

Triển khai: Render

3. Chức năng dự kiến

Hiển thị danh sách món ăn.

Thêm món ăn mới.

Xem thông tin chi tiết món ăn.

Cập nhật thông tin món ăn.

Xóa món ăn.

Lưu trữ dữ liệu trên MongoDB Atlas.

4. Cấu trúc dự án

236173_LeDuyThuan/
├── client/
│   ├── src/
│   └── package.json
├── server/
│   ├── models/
│   ├── package.json
│   └── server.js
├── .env.example
├── .gitignore
└── README.md

5. Cài đặt và chạy chương trình

Yêu cầu

Node.js và npm

Git

Tài khoản MongoDB Atlas

Cấu hình backend

Tạo tệp .env trong thư mục gốc của dự án và cấu hình:

PORT=5000
MONGODB_URI=<chuoi-ket-noi-mongodb-atlas>
CLIENT_URL=http://localhost:5173

Thay <chuoi-ket-noi-mongodb-atlas> bằng chuỗi kết nối thực tế.

Cài đặt và chạy backend:

cd server
npm install
npm start

Cấu hình frontend

Mở terminal khác:

cd client
npm install
npm run dev

Truy cập địa chỉ frontend do Vite hiển thị trên terminal.

Lưu ý: Cần hoàn thành mã nguồn và cấu hình phụ thuộc trước khi chạy chương trình.

6. Triển khai

Quy trình triển khai dự kiến:

Đẩy mã nguồn lên GitHub.

Tạo cơ sở dữ liệu MongoDB Atlas.

Xây dựng Docker image cho backend và frontend.

Đẩy image lên Docker Hub.

Triển khai các dịch vụ trên Render.

Kiểm tra API, giao diện và khả năng lưu trữ dữ liệu.

7. Bảo mật

Không đưa tệp .env lên GitHub.

Không công khai mật khẩu, access token hoặc thông tin kết nối bí mật.

Sử dụng biến môi trường để cấu hình dịch vụ.