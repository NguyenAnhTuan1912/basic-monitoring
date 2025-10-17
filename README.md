# Basic Monitoring

Thực hiện monitoring cơ bản với ứng dụng mẫu. Bài này bạn sẽ cần phải thực hiện trong Ubuntu (hoặc bất cứ Linux Distrop phù hợp khác).

## Installation & Setup

Trong dự án này thì mình sẽ hướng dẫn cho bạn cách để setup cơ bản một ứng dụng có thể "monitoring" được từ Prometheus. Đơn giản làm mình sẽ cần tới Prometheus Client được cài đặt ở trong ứng dụng và Prometheus server đang được chạy, khi Prometheus cần lấy metrics thì nó sẽ gọi tới endpoints `/metrics` để có thể lấy được tất cả các metrics cần thiết.

Trong bài này thì mình sẽ setup một số metrics cơ bản như:

- `http_requests_total`: tổng số HTTP Request được tạo ra theo từng khoảng thời gian, sẽ được reset về 0 sau 00:00 mỗi ngày (thời gian theo chuẩn UTC).
- `http_requests_statuscode_total`: tổng số request status từ các request mà server đã thực hiện. Metric này để mình biết được xem là trong hôm nay, hệ thống đã xử lý được bao nhiêu request thành công và bao nhiêu request lỗi. Giống với `http_requests_total` thì collector này cũng có cơ chế reset mỗi ngày.
- `http_concurrent_requests`: số các request đồng thời trong một khoảng thời gian nào đó.

Trong README này thì mình chỉ hướng dẫn cơ bản thôi, để có được góc nhìn toàn cảnh hơn thì bạn có thể theo dõi thông qua blog của mình: [Basic monitoring with sample application]().

### Install Packages

Cài đặt các thư viện cần thiết với lệnh npm hoặc pnpm.

```bash
npm install

# hoặc
pnpm install
```

### Create Env File

Tiếp theo là chúng ta cần phải tạo file `.env` và copy nội dung của file `.env.example` sang nó (nhớ là cd đang ở root dự án nhé).

```bash
touch .env && echo .env.example > .env
```

> Note: hiện tại thì mình sẽ để value trong `.env` theo `.env.example` luôn.

### Create Log Directory

Cấp quyền cho logger để nó có thể ghi được logs trong thư mục.

```bash
sudo mkdir /var/log/sma
```

```bash
sudo chmod -R 777 /var/log/sma
```

### Run Application

Cuối cùng thì chúng ta chạy thử ứng dụng và xem kết quả.

```bash
# Build trước
npm run build:express

# Rồi chạy
npm run start:express
```

Nếu dùng `pnpm`

```bash
# Build trước
pnpm run build:express

# Rồi chạy
pnpm run start:express
```
