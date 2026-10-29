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

## Chạy Frontend bằng Docker

1. Yêu cầu

Đã cài đặt Docker Desktop.

Docker Engine đang chạy.

Đã có mã nguồn frontend trong thư mục client/.

Backend đang chạy tại http://localhost:5000.

2. Cấu trúc các file Docker

client/
├── Dockerfile
├── nginx.conf
├── .dockerignore
├── package.json
├── index.html
└── src/

Dockerfile: Build ứng dụng React và tạo image frontend.

nginx.conf: Cấu hình Nginx để phục vụ ứng dụng.

.dockerignore: Loại trừ các file không cần thiết khỏi build context.

3. Build Docker image

Mở terminal tại thư mục gốc của dự án:

docker build \
  --build-arg VITE_API_URL=http://localhost:5000/api \
  -t hayes123/food-frontend:1.0 \
  -f client/Dockerfile client

Trong đó:

--build-arg VITE_API_URL=...: Cấu hình địa chỉ API cho frontend tại thời điểm build.

-t hayes123/food-frontend:1.0: Đặt tên và tag cho Docker image.

-f client/Dockerfile: Chỉ định Dockerfile dùng để build.

client: Thư mục chứa mã nguồn frontend.

4. Khởi chạy frontend container

Chạy lệnh:

docker run -d \
  --name food-frontend \
  -p 8081:80 \
  hayes123/food-frontend:1.0

Frontend sẽ được phục vụ trên cổng 8081 của máy tính.

Truy cập:

http://localhost:8081

5. Kiểm tra container

Kiểm tra trạng thái container:

docker ps

Xem log frontend:

docker logs food-frontend

Kiểm tra ánh xạ cổng:

docker port food-frontend

Nếu container cũ đã tồn tại, xóa container đó trước khi chạy lại:

docker rm -f food-frontend

Sau đó chạy lại lệnh docker run ở bước 4.

6. Cấu hình kết nối Backend

Frontend sử dụng API tại:

http://localhost:5000/api

Để frontend hoạt động chính xác:

Backend phải đang chạy và ánh xạ cổng 5000:5000.

Backend phải cho phép origin http://localhost:8081 trong cấu hình CORS.

Nếu thay đổi VITE_API_URL, cần build lại frontend image.

Nếu triển khai trên máy chủ khác, cần thay localhost bằng địa chỉ backend mà trình duyệt có thể truy cập.

7. Đẩy image lên Docker Hub

Đăng nhập Docker Hub:

docker login

Đẩy image frontend:

docker push hayes123/food-frontend:1.0

8. Tải và chạy image trên máy khác

Tải image:

docker pull hayes123/food-frontend:1.0

Khởi chạy:

docker run -d \
  --name food-frontend \
  -p 8081:80 \
  hayes123/food-frontend:1.0

Mở trình duyệt tại http://localhost:8081 để truy cập ứng dụng.

Lưu ý: Địa chỉ http://localhost:5000/api chỉ phù hợp khi trình duyệt đang chạy trên cùng máy tính với backend được ánh xạ cổng 5000. Nếu frontend và backend triển khai trên hai máy khác nhau, cần cấu hình địa chỉ API công khai phù hợp.


## Triển khai frontend trên Render
Frontend URL:https://web-236173-frwm.onrender.com

## Triển khai backend trên Render
Backend URL:https://api-236173.onrender.com


## Kiểm tra tổng thể hệ thống

Frontend trên Render Kiểm tra giao diện, tìm kiếm, thêm, xem chi tiết, sửa và xóa món ăn. Mở website
Backend API trên Render Kiểm tra trạng thái hoạt động và dữ liệu JSON trả về. Health check API danh sách món ăn
MongoDB Atlas Xác nhận dữ liệu được lưu thật trong database 236028_TranTienThan, collection foods. Kiểm thử CRUD trên website Xem danh sách Danh sách món ăn được tải từ API. Thêm món ăn Thêm một món mới và kiểm tra món đó xuất hiện. Tìm theo tên món ăn hoặc từ khóa phù hợp. Cập nhật Sửa tên hoặc giá và xác nhận dữ liệu mới được hiển thị. Xóa Xóa món kiểm thử và xác nhận món không còn trong danh sách. Kiểm tra MongoDB Xác nhận thao tác thêm, sửa, xóa đã được lưu trong Atlas.