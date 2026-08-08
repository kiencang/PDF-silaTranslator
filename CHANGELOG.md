# Changelog

Tất cả những thay đổi đáng chú ý của dự án **PDF-silaTranslator-Online** sẽ được ghi lại trong file này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
và dự án này tuân thủ [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Riêng chỉ sửa nhỏ giao diện mà không động đến logic dịch thuật sẽ sử dụng thêm giá trị i, k, l... đằng sau.

Ví dụ 1.0.19.i nghĩa là phiên bản này có lõi giống y phiên bản 1.0.19, chỉ có giao diện người dùng là chỉnh sửa nhỏ.

## [1.0.75] - 2026-08-08
### Fixed
- Thiết lập timeout 5s để việc bị kẹt ở một ảnh nào đó không dẫn đến việc bị kẹt hoàn toàn ở một file;
- Ngoài ra điều chỉnh mặc định cũ 1s, giúp các ảnh khó không bị bỏ qua quá sớm dẫn đến tình trạng thiếu ảnh;

## [1.0.74] - 2026-08-08
### Fixed
- Cập nhật cơ chế bóc tách ảnh mới cho chất lượng bóc tách ảnh tốt hơn;

## [1.0.73] - 2026-08-06
### Fixed
- Cập nhật SI/Prompt phiên bản mới nhất (chỉnh để chắc chắn tất cả ảnh được đưa vào bản dịch);

## [1.0.72] - 2026-08-06
### Fixed
- Cập nhật SI/Prompt phiên bản mới nhất;

## [1.0.71] - 2026-08-06
### Fixed
- Cập nhật cho phase1 xử lý ảnh vector (bản 1.0.70 mới cập nhật cho 3 kiểu dịch đầu);

## [1.0.70] - 2026-08-06
### Fixed
- Cập nhật prompt để nó xử lý các sơ đồ, biểu đồ vector tốt hơn;
- Đang dịch thì cần vô hiệu hóa button `+Search`;

## [1.0.69] - 2026-08-03
### Fixed
- Điều chỉnh để chất lượng vẽ ảnh tốt hơn;
- Điều chỉnh để ảnh nào là của file PDF đó, kể cả là dịch lại từ 2 file PDF giống hệt nhau. Tức là hoàn toàn độc lập với nhau;
- Xóa file PDF sẽ kèm luôn xóa ảnh tương ứng của file đó, không cần kiểm tra chéo xem có file PDF nào còn dùng ảnh hay không;

## [1.0.68] - 2026-08-02
### Fixed
- Với những ảnh ít màu sắc thì giữ định dạng là PNG để nét hơn;
- Những ảnh nhiều màu sắc (thường là ảnh chụp) vẫn chuyển về định dạng JPG 95%;

## [1.0.67] - 2026-07-31
### Fixed
- Thêm model sử dụng để dịch vào tên file cho dễ phân biệt;
- Chuyển model mặc định là Pro thay vì Flash;
- Cải tiến một chút giao diện của `Lịch sử dịch` (tăng chiều rộng modal; file nào đang được khôi phục thì card của file đó sẽ active để dễ nhận ra hơn);

## [1.0.66] - 2026-07-31
### Fixed
- Chỉnh sửa câu chữ cột trái cho gọn gàng hơn;
- Đổi mặc định dịch từ khóa từ `gemini-flash-latest` thành `gemini-flash-lite-latest` để tốc độ tốt hơn nữa;

## [1.0.65] - 2026-07-30
### Fixed
- Thêm tính năng lưu trữ file gốc vào Lịch sử dịch (tiện để đối chiếu với bản dịch sau này, đặc biệt khi bản gốc thất lạc);
- Toggle +Search ít dùng được chuyển xuống footer;
- Tinh chỉnh một số câu chữ cho gọn gàng hơn;

## [1.0.64] - 2026-07-24
### Fixed
- Điều chỉnh câu chữ cho rõ ràng hơn;
- Khi click ra ngoài modal thì modal tự đóng (tuân thủ chuẩn chung);

## [1.0.63] - 2026-07-23
### Fixed
- Cung cấp thêm thông tin dịch bằng model AI nào trong phần `Lịch sử dịch`;

## [1.0.62] - 2026-07-23
### Fixed
- Chỉnh sửa lại câu chữ cho rõ ràng dễ hiểu (toast, thông tin khi vực upload, hiển thị nội dung kết quả);

## [1.0.61] - 2026-07-22
### Fixed
- Chỉnh lại một chút toast liên quan đến thông báo chưa nhập API Key để rõ ràng hơn;
- Chia tách `translation.state.ts` ra phần quản lý SI/Prompt và quản lý xử lý ảnh;

## [1.0.60] - 2026-07-22
### Fixed
- Sửa lại các SI để nó tương thích tốt hơn với prompt trong phần liên quan đến xử lý ảnh;

## [1.0.59] - 2026-07-16
### Fixed
- Với dịch thuật ở phase2, không cần thiết gửi kèm ảnh base64 cho AI nữa;

## [1.0.58] - 2026-07-16
### Fixed
- Xóa file PDF thì xóa các ảnh base64 liên quan đến file PDF đó;

## [1.0.57] - 2026-07-16
### Fixed
- Cập nhật tính năng đưa ảnh vào bản dịch;

## [1.0.56] - 2026-07-08
### Fixed
- Loại bỏ các thư viện thừa thãi không dùng đến;
- Điều chỉnh một chút thiết kế;

## [1.0.55] - 2026-07-06
### Fixed
- Điều chỉnh cấu hình safetySettings và đưa các mức chặn threshold về BLOCK_NONE giúp AI nới lỏng bộ lọc;
 
## [1.0.54] - 2026-07-04
### Fixed
- Điều chỉnh một chút thiết kế ở phần `Các ứng dụng khác`;

## [1.0.53] - 2026-07-04
### Fixed
- Thêm favicon;
- Xóa các thư viện serverside không cần thiết;
- Thêm `Các ứng dụng khác` ở footer;

## [1.0.52] - 2026-06-02
### Fixed
- Thêm hướng dẫn các remix công cụ về để tận dụng ngưỡng miễn phí tốt hơn từ Gemini.

## [1.0.51] - 2026-05-26
### Fixed
- Bắt lỗi thông báo từ Google API chuẩn hơn (Bóc tách thông báo lỗi JSON và đưa vào Toast).

## [1.0.50] - 2026-05-26
### Fixed
- Xóa bỏ các đoạn mã dư thừa do cấu hình serverside trước đây.

## [1.0.49] - 2026-05-26
### Fixed
- Điều chỉnh vị trí của button nhập API Key để tránh nó chiếm diện tích header.
- Làm cho toggle chuyển đổi model nổi bật hơn.
- Loại trừ các thông báo lỗi dư thừa ở console để tránh người dùng hiểu nhầm ứng dụng lỗi, trong khi đó chỉ là lỗi do thiếu API key. Thông báo Toast là đủ rồi.
- Thay đổi font chữ của logo.
- Điều chỉnh mã nguồn để tương thích tốt hơn với người khiếm thị.

## [1.0.48] - 2026-05-25
### Fixed
- Chuyển về dạng Clientside, và bắt buộc nhập API Key để dịch.
- Chỉnh sửa giao diện nhập API Key.

## [1.0.47] - 2026-05-23
### Fixed
- Tinh chỉnh modal `Lịch sử dịch`.
- Tái cấu trúc mã.
- Thông báo quá tải thân thiện, dễ hiểu hơn.

## [1.0.46] - 2026-05-23
### Fixed
- Bổ sung thông báo Toast của phần Dịch từ khóa cẩn thận hơn.
- Điều chỉnh thời gian hiển thị các Toast lỗi lên 10s.

## [1.0.45] - 2026-05-23
### Fixed
- Bổ sung tính năng `Lịch sử dịch`.

## [1.0.44] - 2026-05-23
### Fixed
- Điều chỉnh một chút về giao diện.
- Cập nhật một số Toast cho phù hợp hơn.
- Chuyển model tính toán, đếm token thành `gemini-flash-lite-latest`.

## [1.0.43] - 2026-05-23
### Fixed
- Tái cấu trúc mã nguồn.

## [1.0.42] - 2026-05-21
### Fixed
- Điều chỉnh nhỏ giao diện, chỉnh toast để thông báo rõ ràng hơn.

## [1.0.41] - 2026-05-21
### Fixed
- Thiết lập cài đặt khóa API dùng riêng.
- Loại bỏ temperature.

## [1.0.40] - 2026-05-20
### Fixed
- Chỉnh tooltip cho phù hợp hơn, vì tính năng này giờ hay bị hạn chế ở người dùng miễn phí.
- Chuyển model mặc định sang Flash, vì những hạn chế với model Pro ở người dùng miễn phí.

## [1.0.39] - 2026-05-20
### Fixed
- Thêm tính năng lựa chọn model AI.

## [1.0.38] - 2026-05-19
### Fixed
- Cập nhật theo tiêu chuẩn mới của Gemini về vị trí khóa API Key phải cất ở phía server.

## [1.0.37.c] - 2026-04-26
### Fixed
- Chữa bản lỗi v1.0.37.

## [1.0.37] - 2026-04-26
### Added
- Thêm tính năng bổ sung công cụ tìm kiếm khi dịch bằng AI (grounding with google search).

## [1.0.36] - 2026-04-26
### Fixed
- Thêm tùy chỉnh thiết lập chế độ dịch mặc định.
- Điều chỉnh lại giao diện để hiển thị tốt hơn trên di động.
- Xóa thông tin không cần thiết trên header.

## [1.0.35] - 2026-04-16
### Fixed
- Đặt giới hạn dung lượng HTML 0.5 MB.
- Chỉnh lại một số câu chữ trong giao diện của app.

## [1.0.34] - 2026-04-16
### Fixed
- Chỉnh Temperature khi dịch từ Anh sang Việt lên 0.5 cho phase 2.

## [1.0.33] - 2026-04-15
### Fixed
- Chỉnh nhỏ ở phase 2 để cho AI quyền can thiệp tốt hơn với CSS.

## [1.0.32] - 2026-04-15
### Fixed
- Nâng cấp SI/Prompt lên phiên bản mới (SI phase 2).

## [1.0.31] - 2026-04-15
### Fixed
- Nâng cấp SI/Prompt lên phiên bản mới (SI phase 1).

## [1.0.30] - 2026-04-15
### Fixed
- Thao tác DOM trực tiếp (Anti-pattern trong Angular).
- Quản lý bộ nhớ (Memory Leak) cho một số tác vụ chạy ngầm.

## [1.0.29] - 2026-04-15
### Removed
- Loại bỏ tính năng ghi nhớ lịch sử dịch (ít hữu ích, nhưng lại cản trở luồng thao tác).
- Loại bỏ tính năng ghi nhớ chế độ dịch (dễ gây sai lỗi cho người mới dùng, người dùng quen thì có ích nhưng không đáng kể) => mục tiêu hạn chế lỗi tối đa và giữ tỉnh táo khi chọn chế độ dịch, nên không cần thiết duy trì.
- Tính năng phím tắt cũng gây ảnh hưởng đến luồng thao tác trong khi không có quá nhiều tác dụng với trường hợp dịch thuật (cần thao tác cẩn thận hơn là phải nhanh), ngoài ra tính năng này gia tăng gánh nặng bảo trì => Loại bỏ vì không mấy tác dụng.

### Fixed
- Chuẩn hơn trong việc xử lý khi người dùng chọn các tùy chọn dịch không phù hợp với file tải lên. Ngăn ngừa lỗi ngay ở giao diện thay vì bấm nút dịch rồi mới biết.

## [1.0.28] - 2026-04-15
### Fixed
- Nới ngưỡng tải file PDF lên 10MB.

## [1.0.27] - 2026-04-15
### Fixed
- Chỉnh text 'Thay đổi file' thành 'Chọn file khác'.
- Thêm phím tắt Ctrl + Enter khi muốn dịch để đỡ phải bấm nút.

## [1.0.26] - 2026-04-15
### Fixed
- Điều chỉnh nút 'Thay đổi file' thành dạng dễ bấm hơn.
- Lưu lại tùy chọn dịch gần đây nhất của người dùng.

## [1.0.25] - 2026-04-15
### Fixed
- Điều chỉnh khu vực tải file lên khi hover được rõ nét hơn.
- Gom nhóm dịch 2 phase và một radio button để có cùng logic với 3 kiểu dịch đầu (UX/UI). 

## [1.0.24] - 2026-04-14
### Fixed
- Điều chỉnh tên file SI/Prompt trong thư mục refine thành kiểu đỡ nhầm lẫn hơn (x_svg thành zero_svg). 

## [1.0.23] - 2026-04-14
### Fixed
- Điều chỉnh SI/Prompt lên phiên bản mới nhất. 

## [1.0.22] - 2026-04-13
### Fixed
- Với trường hợp chuyển file PDF sang HTML (phase 1), đôi khi bị gặp vấn đề 'Lỗi Recitation'. 
- Phiên bản này cập nhật thông báo chi tiết cho phản hồi, tránh không thông báo điều gì.











































