import { Injectable } from '@angular/core';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export interface PdfCropResult {
  fileBase64: string;
  croppedFile: File;
}

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  async hashFile(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const sha256 = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    // Thêm mốc thời gian (timestamp) để đảm bảo tính duy nhất tuyệt đối cho mỗi phiên dịch,
    // tránh trùng lặp hoặc chia sẻ tài nguyên ảnh giữa các lần dịch khác nhau.
    return `${sha256}_${Date.now()}`;
  }

  async extractImagesFromPDF(file: File, pdfHash: string): Promise<{ id: string, dataUrl: string }[]> {
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer.slice(0));
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    const images: { id: string, dataUrl: string }[] = [];
    let imgCount = 0;

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
              
              if (typeof imgName === 'object' && imgName !== null) {
                imgData = imgName;
              } else if (typeof imgName === 'string') {
                imgData = await new Promise((resolve) => {
                  let resolved = false;
                  const timer = setTimeout(() => {
                    if (!resolved) {
                      resolved = true;
                      resolve(null);
                    }
                  }, 1000);

                  const callback = (obj: any) => {
                    if (!resolved) {
                      resolved = true;
                      clearTimeout(timer);
                      resolve(obj);
                    }
                  };

                  try {
                    if ((page as any).objs && typeof (page as any).objs.get === 'function') {
                      const res = (page as any).objs.get(imgName, callback);
                      if (res && res !== imgName) {
                        resolved = true;
                        clearTimeout(timer);
                        resolve(res);
                      }
                    } else if ((page as any).commonObjs && typeof (page as any).commonObjs.get === 'function') {
                      const res = (page as any).commonObjs.get(imgName, callback);
                      if (res && res !== imgName) {
                        resolved = true;
                        clearTimeout(timer);
                        resolve(res);
                      }
                    } else {
                      resolved = true;
                      clearTimeout(timer);
                      resolve(null);
                    }
                  } catch {
                    if (!resolved) {
                      resolved = true;
                      clearTimeout(timer);
                      resolve(null);
                    }
                  }
                });
              }

              if (!imgData) continue;

              const width = imgData.width;
              const height = imgData.height;

              if (!width || !height) continue;
              if (width < 100 || height < 100) continue;

              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');

              if (!ctx) continue;

              if (imgData.data) {
                const imgImageData = ctx.createImageData(width, height);
                const srcData = imgData.data;
                const destData = imgImageData.data;

                if (srcData.length === width * height * 3) {
                  let j = 0;
                  for (let k = 0; k < srcData.length; k += 3) {
                    destData[j] = srcData[k];
                    destData[j + 1] = srcData[k + 1];
                    destData[j + 2] = srcData[k + 2];
                    destData[j + 3] = 255;
                    j += 4;
                  }
                } else if (srcData.length === width * height * 4) {
                  destData.set(srcData);
                } else if (srcData.length === width * height) {
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
                  try {
                    destData.set(srcData.subarray(0, destData.length));
                  } catch {
                    continue;
                  }
                }

                ctx.putImageData(imgImageData, 0, 0);
              } else if (imgData.bitmap) {
                ctx.drawImage(imgData.bitmap, 0, 0);
              } else {
                continue;
              }

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

  async getPageCount(file: File): Promise<number> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    return pdfDoc.getPageCount();
  }

  async cropPdf(file: File, start: number, end: number, totalPages: number): Promise<PdfCropResult> {
    if (start > end) {
      throw new Error('Trang bắt đầu không được lớn hơn trang kết thúc.');
    }

    const arrayBuffer = await file.arrayBuffer();
    const originalPdf = await PDFDocument.load(arrayBuffer);
    const newPdf = await PDFDocument.create();

    const pageIndices = [];
    for (let i = start - 1; i < Math.min(end, totalPages); i++) {
      pageIndices.push(i);
    }

    const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
    copiedPages.forEach(page => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    const croppedBlob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
    const croppedFileObj = new File([croppedBlob], file.name, { type: 'application/pdf' });

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve({
          fileBase64: base64String,
          croppedFile: croppedFileObj
        });
      };
      reader.onerror = () => reject(new Error('Lỗi khi đọc file cắt.'));
      reader.readAsDataURL(croppedFileObj);
    });
  }
}
