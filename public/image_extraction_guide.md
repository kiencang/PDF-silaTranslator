# Hướng dẫn chi tiết: Trích xuất hình ảnh (Raster Images) từ file PDF bằng PDF.js

Tài liệu này mô tả chi tiết phương pháp bóc tách hình ảnh (raster images) từ một file PDF bằng JavaScript/TypeScript tại trình duyệt (client-side) sử dụng thư viện `pdfjs-dist`. Phương pháp này hoạt động hiệu quả, có xử lý lỗi, xử lý timeout khi lấy object và tự động scale ảnh để tối ưu bộ nhớ.

Bạn có thể cung cấp tài liệu này cho một AI khác để nó có thể lập trình tính năng tương tự cho ứng dụng của bạn.

## 1. Cài đặt thư viện

Bạn cần cài đặt thư viện `pdfjs-dist`:

```bash
npm install pdfjs-dist
```

Trong file mã nguồn, cấu hình worker cho `pdf.js` để xử lý file PDF mượt mà:

```typescript
import * as pdfjsLib from 'pdfjs-dist';

// Đảm bảo phiên bản worker khớp với phiên bản thư viện
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
```

## 2. Nguyên lý hoạt động

1. **Đọc PDF**: Chuyển file PDF sang dạng `Uint8Array` và dùng `pdfjsLib.getDocument()` để parse.
2. **Quét từng trang**: Lặp qua tất cả các trang của PDF (`pdf.numPages`).
3. **Phân tích Operator List**: Lấy danh sách các toán tử (`operatorList`) của từng trang. Các toán tử vẽ hình ảnh bao gồm:
   - `OPS.paintImageXObject`
   - `OPS.paintInlineImageXObject`
   - `OPS.paintImageXObjectRepeat`
4. **Lấy dữ liệu ảnh (Image Data)**: Dựa vào tên đối tượng ảnh (`imgName`), dùng hàm `get()` trên `page.objs` hoặc `page.commonObjs` để lấy dữ liệu thô của ảnh. Cần thiết lập cơ chế timeout (ví dụ 5 giây) để tránh treo trình duyệt nếu PDF bị lỗi.
5. **Vẽ lên Canvas**: Đọc mảng byte màu (RGB/RGBA/Grayscale) từ đối tượng ảnh và dùng `Canvas API` (`ctx.putImageData` hoặc `ctx.drawImage`) để dựng lại hình ảnh.
6. **Tối ưu hóa (Scale) & Xuất ra Base64**: Nếu ảnh quá to (ví dụ > 1024px chiều rộng), tự động scale nhỏ lại bằng một canvas tạm thời (`tempCanvas`), sau đó xuất ra định dạng `dataUrl` (Base64 JPEG/PNG).
7. **Định danh ảnh (ID)**: Gắn ID duy nhất cho mỗi ảnh bằng cách băm (hash) nội dung PDF kết hợp với chỉ mục đếm (ví dụ: `[hash_của_pdf]_img_0`).

## 3. Đoạn mã mẫu (TypeScript)

Dưới đây là hàm `extractImagesFromPDF` hoàn chỉnh. Bạn có thể chép đoạn code này vào một Service hoặc Utility file.

```typescript
import * as pdfjsLib from 'pdfjs-dist';

// Định cấu hình worker (bắt buộc)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export interface ExtractedImage {
  id: string;
  dataUrl: string;
}

/**
 * Trích xuất toàn bộ hình ảnh từ một file PDF.
 * @param file File PDF đầu vào.
 * @param pdfHash Chuỗi định danh (hash) duy nhất của file PDF để đặt tiền tố ID cho ảnh.
 * @returns Mảng các đối tượng chứa ID và chuỗi Base64 (dataUrl) của ảnh.
 */
export async function extractImagesFromPDF(file: File, pdfHash: string): Promise<ExtractedImage[]> {
  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const images: ExtractedImage[] = [];
  let imgCount = 0;

  // Lọc các thao tác vẽ ảnh hợp lệ
  const validObjectTypes = [
    (pdfjsLib as any).OPS?.paintImageXObject,
    (pdfjsLib as any).OPS?.paintInlineImageXObject,
    (pdfjsLib as any).OPS?.paintImageXObjectRepeat
  ].filter(v => v !== undefined);

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    try {
      const page = await pdf.getPage(pageNum);
      const operatorList = await page.getOperatorList();

      for (let i = 0; i < operatorList.fnArray.length; i++) {
        const fn = operatorList.fnArray[i];
        
        if (validObjectTypes.includes(fn)) {
          const imgName = operatorList.argsArray[i][0];
          
          try {
            let imgData: any = null;
            
            // Hàm xử lý lấy object với Timeout (Tránh treo trình duyệt)
            const fetchObjectWithTimeout = (targetObjs: any, name: string, timeoutMs: number = 5000): Promise<any> => {
              return new Promise((resolve) => {
                let isResolved = false;
                const timeoutId = setTimeout(() => {
                  if (!isResolved) {
                    console.warn(`Timeout khi lấy object ${name}`);
                    isResolved = true;
                    resolve(null);
                  }
                }, timeoutMs);
                try {
                  targetObjs.get(name, (obj: unknown) => {
                    if (!isResolved) {
                      clearTimeout(timeoutId);
                      isResolved = true;
                      resolve(obj);
                    }
                  });
                } catch (err) {
                  if (!isResolved) {
                    clearTimeout(timeoutId);
                    isResolved = true;
                    resolve(null);
                  }
                }
              });
            };
            
            // Lấy dữ liệu ảnh
            if (typeof imgName === 'object' && imgName !== null) {
              imgData = imgName;
            } else if (typeof imgName === 'string') {
              if ((page as any).objs && typeof (page as any).objs.get === 'function') {
                imgData = await fetchObjectWithTimeout((page as any).objs, imgName);
              } else if ((page as any).commonObjs && typeof (page as any).commonObjs.get === 'function') {
                imgData = await fetchObjectWithTimeout((page as any).commonObjs, imgName);
              }
            }

            if (!imgData) continue;
            
            const width = imgData.width;
            const height = imgData.height;
            if (!width || !height || width < 100 || height < 100) continue; // Bỏ qua ảnh quá nhỏ

            // Tạo canvas để dựng ảnh
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) continue;

            if (imgData.data) {
              const imgImageData = ctx.createImageData(width, height);
              const srcData = imgData.data;
              const destData = imgImageData.data;

              // Xử lý các định dạng hệ màu (RGB, RGBA, Grayscale)
              if (srcData.length === width * height * 3) {
                // RGB
                let j = 0;
                for (let k = 0; k < srcData.length; k += 3) {
                  destData[j] = srcData[k];
                  destData[j + 1] = srcData[k + 1];
                  destData[j + 2] = srcData[k + 2];
                  destData[j + 3] = 255; // Alpha
                  j += 4;
                }
              } else if (srcData.length === width * height * 4) {
                // RGBA
                destData.set(srcData);
              } else if (srcData.length === width * height) {
                // Grayscale
                let j = 0;
                for (let k = 0; k < srcData.length; k++) {
                  const val = srcData[k];
                  destData[j] = val;
                  destData[j + 1] = val;
                  destData[j + 2] = val;
                  destData[j + 3] = 255;
                  j += 4;
                }
              } else {
                try { destData.set(srcData.subarray(0, destData.length)); } catch { continue; }
              }
              ctx.putImageData(imgImageData, 0, 0);
            } else if (imgData.bitmap) {
              ctx.drawImage(imgData.bitmap, 0, 0);
            } else {
              continue; // Không có dữ liệu hợp lệ
            }

            // (Tùy chọn) Giới hạn kích thước ảnh để tối ưu bộ nhớ và băng thông
            let targetW = width;
            let targetH = height;
            if (targetW > 1024) {
              const scale = 1024 / targetW;
              targetW = 1024;
              targetH = Math.round(targetH * scale);
            }

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = targetW;
            tempCanvas.height = targetH;
            const tempCtx = tempCanvas.getContext('2d');
            if (tempCtx) {
              tempCtx.imageSmoothingEnabled = true;
              tempCtx.imageSmoothingQuality = 'high';
              tempCtx.drawImage(canvas, 0, 0, targetW, targetH);
              
              // Chuyển đổi thành base64 URL
              const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.95);
              images.push({ id: `${pdfHash}_img_${imgCount++}`, dataUrl });
            }
          } catch (err) {
            console.warn(`Lỗi khi trích xuất ảnh ${imgName} trang ${pageNum}:`, err);
          }
        }
      }
    } catch (err) {
      console.warn(`Error processing page ${pageNum} for image extraction:`, err);
    }
  }

  return images;
}
```

## 4. Những điểm quan trọng cần ghi nhớ:

1. **Khác biệt của dữ liệu hệ màu PDF**: Khác với môi trường Web thông thường (luôn dùng hệ RGBA - 4 kênh màu), hình ảnh trong PDF rất đa dạng. Ảnh có thể chỉ có 1 kênh màu (Grayscale - đen trắng) hoặc 3 kênh màu (RGB - không có độ trong suốt). Mã ở trên chứa một khối lệnh `if/else` đặc biệt để nội suy màu bằng vòng lặp và điền cứng giá trị Alpha bằng 255. Bỏ qua logic này sẽ khiến ảnh xuất ra bị méo màu hoặc hỏng dữ liệu.
2. **Cơ chế Timeout khi gọi hàm `get()`**: Thư viện `pdf.js` xử lý lazy loading (tải chậm) cho một số Object như hình ảnh bằng cách sử dụng callback. Trong một số file PDF lỗi, quá trình gọi hàm `objs.get(name, callback)` không bao giờ kích hoạt được callback, khiến `Promise` không bao giờ được resolve, làm treo ứng dụng vĩnh viễn. Việc bao bọc hàm này bằng một `setTimeout` là một thiết kế bắt buộc cho tính ổn định.
3. **Giới hạn kích thước (Scale down)**: Ảnh in trong PDF thường có độ phân giải khổng lồ (ví dụ 4000x4000 pixel). Đẩy toàn bộ những ảnh base64 này lên API AI (ví dụ: Gemini, OpenAI) sẽ vượt quá Payload Limit (Giới hạn tải) và gây ra lỗi `413 Payload Too Large`. Giải pháp trong mã sử dụng `Canvas` để scale ảnh xuống chiều rộng tối đa `1024px` trước khi mã hóa thành chuỗi Base64.
4. **Bỏ qua ảnh quá nhỏ**: Các PDF thường chứa các icon trang trí rất nhỏ, hoặc các dấu chấm điểm trang (10x10 pixel). Logic `width < 100 || height < 100` loại bỏ chúng, giúp tiết kiệm chi phí Tokens khi gửi cho API xử lý ngôn ngữ.

Chúc bạn triển khai tính năng thành công!
