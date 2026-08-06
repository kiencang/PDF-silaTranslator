<p align="center">
  <img src="images/app-dich-intro.png" alt="Giao diện của công cụ dịch...">
   <br><em>Một file được dịch bởi công cụ</em>
</p>

Một số tính năng:
- Dịch các file PDF ngắn, chuyên ngành từ 25 - 30 trang đổ lại (ngưỡng chính xác là 25 ngàn token);
- Có khả năng tái tạo tương đối tốt định dạng của tài liệu gốc;
- Có khả năng xử lý các công thức toán học phức tạp;
- Giữ lại được các ảnh bitmap (dạng như ảnh chụp bằng điện thoại/máy ảnh nhúng trong file PDF) trong bản dịch;
- Tìm kiếm tài liệu tiếng Anh trên Google Scholar bằng từ khóa tiếng Việt;
- Các chế độ dịch cho các kiểu tài liệu khác nhau;
- Tùy chọn model dịch là Pro hay Flash;
- Lưu trữ 10 bài dịch gần nhất;

Link dùng:
- **Link web**: https://pdf-silatranslator.wpsila.com (cần API Key trả phí);
- **Link app**: https://aistudio.google.com/apps/bb5c61b7-e110-49aa-933c-04c4ccd18e16?showPreview=true&showAssistant=true (API key miễn phí là đủ dùng);

Chất lượng của 2 phiên bản trên như nhau, dùng qua AI Studio (link app) bạn sẽ tận dụng được ngưỡng miễn phí hàng ngày tương đối thoải mái của Gemini.

---
- Đọc hướng dẫn cách dùng ở đây: https://pdf-translator.wpsila.com
- Chương trình sử dụng SI/Prompt đã được tối ưu sẵn ở dự án này: https://github.com/kiencang/SI-Prompt-PDF-EV-Translate (v1.3.47)

Xem thêm Tuyên bố từ chối trách nhiệm: https://github.com/kiencang/PDF-silaTranslator-Online/blob/main/DISCLAIMERS.md

## Cách thức hoạt động

PDF-silaTranslator có cách thức hoạt động tương đối đơn giản. Nó chủ yếu dựa vào sức mạnh của AI trong việc dịch và tái tạo định dạng gốc của tài liệu. Nên không hề khiêm tốn khi nói rằng về cơ bản nó là dạng sản phẩm AI-Wrapper.

Việc sử dụng định dạng HTML cho bản dịch có nhiều lợi thế:
- AI rất hiểu HTML, CSS;
- Và HTML, CSS rất mềm dẻo trong khả năng định dạng tài liệu;

Để cho kết quả tốt, ứng dụng này:
- Thực hiện thử nghiệm SI/Prompt để tối ưu kết quả (cả khía cạnh dịch & định dạng); Không chỉ nội dung chỉ thị, SI/Prompt còn được tối ưu thông qua định dạng markdown và các thẻ phụ để AI hiểu rõ yêu cầu hơn;
- Cài đặt liên quan đến AI (Gemini nói riêng), chẳng hạn như để Thinking Level là HIGH, thay vì mặc định MEDIUM để tăng khả năng suy luận; Temperature để là 1 để phù hợp với khuyến cáo liên quan đến khả năng suy luận tối ưu;
- Gemini cũng rất mạnh trong khả năng `nhìn`, do vậy việc tách ảnh từ file PDF (thông qua thư viện pdf.js) rồi gửi lên AI chèn lại ảnh không gặp quá nhiều khó khăn;

Về giới hạn 25 ngàn token đầu vào là vì ứng dụng này chỉ sử dụng duy nhất một phiên gọi API để dịch, và giới hạn đầu ra của Gemini rơi vào khoảng 65 ngàn token, do đã mất tương đối nhiều token cho các thẻ HTML và CSS, nên giới hạn trần đầu vào 25 ngàn token là hợp lý, dù đôi khi con số này có thể tăng lên đôi chút mà vẫn dịch đầy đủ trọn vẹn được.

Đối với người dùng có nhu cầu dịch file PDF rất dài mà vẫn giữ được định dạng tốt, bạn có thể thử repo này (cùng tác giả): https://github.com/kiencang/1987-Layout

## Phát triển thêm

Nhìn chung, ở thời điểm hiện tại dùng Gemini để dịch tối ưu về nhiều khía cạnh: 
- Họ cung cấp gói miễn phí hàng ngày tương đối rộng rãi để người dùng thoải mái mà không phải mua API;
- Chất lượng dịch của Gemini rất tốt, nhất là dùng với model mới nhất Pro hoặc Flash;

Nếu người dùng muốn sử dụng các model AI khác, có thể tự vibe coding, chẳng hạn để kết hợp với OpenAI, Claude, vân vân.

Một cách khác là sử dụng OpenRouter, một cổng trung gian AI có thể kết hợp với hầu như bất cứ AI nào đang tồn tại. Làm như vậy mã nguồn sẽ đỡ phức tạp đi nhiều.

Bạn có thể tham khảo repo này (cùng tác giả) để sử dụng OpenRouter kết nối với các AI khác khi dịch file PDF: https://github.com/kiencang/PDF-openSky

Phần SI/Prompt của ứng dụng này cần kết hợp với các AI có khả năng nhận diện cả ảnh (để bản dịch có định dạng tốt và gần tương tự với bản gốc), do vậy bạn cần chọn các AI đa phương thức (Multimodal AI). Các AI mà chỉ nhận đầu vào là text sẽ không hợp với ứng dụng này.

## Ghi công

Công cụ này được hoàn thành dựa vào nhiều thư viện khác. Một số thư viện quan trọng bao gồm:

### 1. Nền tảng
*   **[Angular](https://angular.dev/)**: Framework Javascript, sản phẩm của Google.
*   **[Tailwind CSS](https://tailwindcss.com/)**: Chịu trách nhiệm chính cho giao diện.
*   **[Lucide Angular](https://lucide.dev/)**: Bộ icon.

### 2. PDF core
*   **[pdf-lib](https://pdf-lib.js.org/)**: Giúp chia tách, cắt ngắn file PDF.
*   **[Mozilla PDF.js](https://mozilla.github.io/pdf.js/)** – Phát triển bởi **Mozilla**. Thư viện chạy hoàn toàn trên Client-side, giúp trích xuất hình ảnh trong file PDF.
