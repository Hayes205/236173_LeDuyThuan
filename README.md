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


## Chạy Backend bằng Docker

### 1. Yêu cầu

- Docker Desktop đã được cài đặt và Docker Engine đang chạy.
- Có tài khoản MongoDB Atlas.
- Đã cấu hình kết nối MongoDB Atlas cho backend.

### 2. Docker Image

Image backend: hayes123/food-backend:1.0`

### 3. Cấu hình biến môi trường

Tạo file `.env` tại thư mục gốc dự án với nội dung:

```dotenv
PORT=5000
MONGODB_URI=mongodb+srv://236173_LeDuyThuan:thuan2012@cluster0.dkxnlmv.mongodb.net/236173_LeDuyThuan?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```

Không đưa file `.env` chứa thông tin bí mật lên GitHub hoặc đóng gói vào Docker image.

### 4. Tải Docker Image

```bash
docker pull hayes123/food-backend:1.0
```

### 5. Chạy Container

Tại thư mục gốc dự án, chạy:

```bash
docker run -d --name food-backend -p 5000:5000 --env-file .env hayes123/food-backend:1.0
```

### 6. Kiểm tra hoạt động

Kiểm tra container:

```bash
docker ps
```

Kiểm tra log:

```bash
docker logs food-backend
```

Kiểm tra health endpoint:

`http://localhost:5000/health`

Kiểm tra API danh sách món ăn:

`http://localhost:5000/api/foods`

### 7. Dừng và xóa Container


docker stop food-backend
docker rm food-backend


