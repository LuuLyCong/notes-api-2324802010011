# Thực hành Điện toán đám mây (LING270): Bài 1 và Bài 2

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

---

# Bài 2. Ảo hóa, container và mô phỏng trung tâm dữ liệu

Đóng gói API của bài 1 thành container, chạy hai bản sao có giới hạn CPU/RAM, đẩy image lên GHCR rồi mô phỏng xếp máy ảo bằng CloudSim Plus (thực hiện ngày 12/11/2026).

| | |
|---|---|
| Image công khai (GHCR) | https://github.com/users/LuuLyCong/packages/container/package/notes-api |
| Kéo về và chạy | `docker pull ghcr.io/luulycong/notes-api:1.0` |
| Dockerfile | [Dockerfile](Dockerfile) và [.dockerignore](.dockerignore) |
| Bảng số liệu và câu trả lời | trang GitHub Pages, mục "Bài 2": https://luulycong.github.io/notes-api-2324802010011/ |

## Chạy bằng Docker

```bash
docker build -t notes-api:1.0 .
docker run -d --name notes1 -p 3000:3000 notes-api:1.0
docker run -d --name notes2 -p 3001:3000 --cpus=0.5 --memory=128m notes-api:1.0
curl -s localhost:3000 && echo
curl -s localhost:3001 && echo
docker stats --no-stream
```

## Kết quả đã đo

- Image `notes-api:1.0`: 251 MB (nội dung nén 63,4 MB). Khởi động một container: 0,398 s.
- `GET /` của hai container có `host` khác nhau (ID container) nhưng `cpus: 2` và `memoryGB: 7.8` giống nhau, bằng của máy Codespace. `docker stats` mới hiện giới hạn: `notes2` là 128 MiB.
- Nhân hệ điều hành dùng chung với máy chủ (`uname -r` cùng là `6.8.0-1070-azure`).
- Trong container có `--memory=128m`, `os.totalmem()` vẫn báo 7,76 GB còn `process.constrainedMemory()` báo 128 MiB.

## Mô phỏng CloudSim Plus (BasicFirstExample, JDK 25)

| Lần | Thay đổi | Cloudlet cuối hoàn thành (giây mô phỏng) |
|---|---|---|
| 0 | giữ nguyên | 20,1 |
| 1 | nhân đôi VMS (2 → 4) | 45,6 (2 VM không đặt được vì máy chủ chỉ có 8 lõi) |
| 2 | nhân đôi CLOUDLETS (4 → 8) | 40,1 (chỉ 4/8 cloudlet hoàn thành, các cloudlet còn lại thiếu RAM của VM) |
| 3 | đổi sang CloudletSchedulerSpaceShared | 20,1 (giống lần 0) |
| phụ | SpaceShared kèm CLOUDLETS = 8 | 40,3 (cả 8 hoàn thành, thành hai đợt) |
