# Bài 1. Lập trình trên máy ảo đám mây đầu tiên

Môn: Thực hành Điện toán đám mây (LING270)

| | |
|---|---|
| Sinh viên | Lưu Lý Công |
| MSSV | 2324802010011 |
| Repo | https://github.com/LuuLyCong/notes-api-2324802010011 |
| Trang kết quả (GitHub Pages) | https://luulycong.github.io/notes-api-2324802010011/ |

## Mô tả

API "Hello Cloud" viết bằng Node.js và Express, chạy trong GitHub Codespaces. Ứng dụng (`src/app.js`) được tách khỏi tệp khởi động (`src/server.js`) để dùng lại cho các bài sau.

## Cấu trúc

```
src/app.js          ứng dụng Express (xuất bằng module.exports)
src/server.js       tệp khởi động, lắng nghe cổng 3000
src/app.test.js     kiểm thử GET /
docs/index.html     trang GitHub Pages: 5 đặc tính NIST, bảng so sánh, ảnh minh chứng
docs/images/        ảnh chụp minh chứng
.devcontainer/      cấu hình Codespace
```

## Chạy thử

```bash
npm install
npm test
npm start
```

Server chạy ở cổng 3000 (đổi bằng biến môi trường `PORT`).

| Đường dẫn | Kết quả |
|---|---|
| `GET /` | JSON gồm `message`, `host`, `platform`, `cpus`, `memoryGB`, `uptimeSec`, `time` |
| `GET /health` | `status` và `uptime_seconds` |
| `GET /hello` | lời chào, `hostname`, `time` |

## Kết quả đã đo (ngày 05/11/2026, giờ Việt Nam)

- Bấm tạo Codespace lúc 14:07:08; terminal hiện lúc 14:11:16; chạy được `node -v` lúc 14:12:21 (v22.23.4). Lần dựng đầu nên lâu hơn 2 phút vì image có thêm Java và Docker.
- `npm test` đạt 1/1. `GET /` trả `host: codespaces-fa6c08`, `cpus: 2`, `memoryGB: 7.8` (Debian GNU/Linux 13, nhân Linux 6.8.0-1064-azure).
- Cổng 3000 mặc định Private; đã đổi sang Public để mở bằng điện thoại (mạng 4G) rồi đặt lại Private.
- Billing Usage: Codespaces storage 0,6 GB-tháng và Actions Linux 22 phút, đều billed $0. Số core-giờ tính toán chưa hiện lúc chụp.

Bảng so sánh máy cá nhân và Codespace, cùng ảnh minh chứng từng bước, nằm trên trang GitHub Pages.

## An toàn

Repo không chứa bí mật nào. `.env` và `node_modules/` nằm trong `.gitignore`.
