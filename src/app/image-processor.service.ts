import { Injectable } from '@angular/core';

export interface ExtractedImage {
  id: string;
  dataUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageProcessorService {
  extractImagesFromHtml(html: string): { cleanHtml: string; extractedImages: ExtractedImage[] } {
    const extractedImages: ExtractedImage[] = [];
    
    const regex = /(?:src|href|data)=(['"])(data:image\/.*?)\1|url\((['"]?)(data:image\/.*?)\3\)/gi;
    
    const cleanHtml = html.replace(regex, (match, q1, g1, q2, g2) => {
      const dataUrl = g1 || g2;
      const id = `img_placeholder_${crypto.randomUUID()}`;
      extractedImages.push({ id, dataUrl });
      return match.replace(dataUrl, id);
    });

    return { cleanHtml, extractedImages };
  }

  extractHtml(text: string): string {
    const match = text.match(/```[a-zA-Z]*\s*([\s\S]*?)\s*```/);
    return match ? match[1] : text;
  }

  postProcessHtml(html: string, extractedImages: ExtractedImage[]): string {
    if (!extractedImages || extractedImages.length === 0) return html;
    
    let processedHtml = html;
    for (const img of extractedImages) {
      const escapedId = img.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      const srcRegex = new RegExp(`src=["']\\[?${escapedId}\\]?["']`, 'g');
      processedHtml = processedHtml.replace(srcRegex, `src="${img.dataUrl}"`);
      
      const fallbackRegex = new RegExp(`\\[IMAGE:\\s*${escapedId}\\]`, 'g');
      processedHtml = processedHtml.replace(fallbackRegex, `<img src="${img.dataUrl}" style="max-width: 100%; height: auto;">`);
    }

    return processedHtml;
  }

  attachInteractiveScript(html: string): string {
    if (!html) return html;

    const interactiveScript = `
<style>
  .interactive-img-wrapper { position: relative; display: inline-block; max-width: 100%; }
  .interactive-img-wrapper img.original-img { display: block; max-width: 100%; height: auto; }
  .translate-btn {
    position: absolute; top: 8px; right: 8px;
    background: rgba(17, 24, 39, 0.85); color: white; border: 1px solid rgba(255,255,255,0.2);
    padding: 6px 12px; border-radius: 6px; cursor: pointer; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; font-size: 12px; font-weight: 500;
    opacity: 0; transition: all 0.2s; z-index: 10; backdrop-filter: blur(4px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  .interactive-img-wrapper:hover .translate-btn { opacity: 1; }
  .translate-btn:hover { background: rgba(17, 24, 39, 1); }
  .reconstructed-wrapper { display: none; width: 100%; overflow: auto; }
  .show-reconstructed .reconstructed-wrapper { display: block; }
  .show-reconstructed img.original-img { display: none; }

  #img-trans-toast-container {
    position: fixed; top: 16px; right: 16px; z-index: 999999;
    display: flex; flex-direction: column; gap: 8px; pointer-events: none;
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
  }
  .img-trans-toast {
    pointer-events: auto; padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: 500;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
    display: flex; align-items: center; gap: 8px; max-width: 450px;
    animation: imgToastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .img-trans-toast.error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
  .img-trans-toast.success { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
  @keyframes imgToastIn {
    from { opacity: 0; transform: translateY(-8px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes imgToastOut {
    from { opacity: 1; transform: translateY(0) scale(1); }
    to { opacity: 0; transform: translateY(-8px) scale(0.96); }
  }
</style>
<script>
  function showImgToast(message, isSuccess) {
    let container = document.getElementById('img-trans-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'img-trans-toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'img-trans-toast ' + (isSuccess ? 'success' : 'error');
    const icon = isSuccess ? '✓' : '⚠️';
    toast.innerHTML = '<span style="font-weight:bold;">' + icon + '</span><span style="flex:1;">' + message + '</span>';
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'imgToastOut 0.3s forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function initImages() {
    document.querySelectorAll('img').forEach(img => {
      if (!img.parentElement.classList.contains('interactive-img-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'interactive-img-wrapper';
        img.parentNode.insertBefore(wrapper, img);
        
        img.classList.add('original-img');
        wrapper.appendChild(img);
        
        const btn = document.createElement('button');
        btn.className = 'translate-btn';
        
        const cachedHtmlAttr = img.getAttribute('data-translated-html');
        if (cachedHtmlAttr) {
          try {
            const decodedHtml = decodeURIComponent(cachedHtmlAttr);
            wrapper.dataset.translatedContent = "true";
            const rec = document.createElement('div');
            rec.className = 'reconstructed-wrapper';
            const shadow = rec.attachShadow({ mode: 'open' });
            shadow.innerHTML = decodedHtml;
            wrapper.appendChild(rec);
            wrapper.classList.add('show-reconstructed');
            btn.textContent = 'Hiển thị ảnh gốc';
          } catch (err) {
            console.error('Lỗi decode cached image html:', err);
            btn.textContent = 'Dịch sơ đồ/biểu đồ này';
          }
        } else {
          btn.textContent = 'Dịch sơ đồ/biểu đồ này';
        }

        wrapper.appendChild(btn);
        
        btn.addEventListener('click', (e) => {
           e.preventDefault();
           e.stopPropagation();
           if (wrapper.classList.contains('show-reconstructed')) {
              wrapper.classList.remove('show-reconstructed');
              btn.textContent = 'Dịch sơ đồ/biểu đồ này';
           } else {
              if (wrapper.dataset.translatedContent) {
                  wrapper.classList.add('show-reconstructed');
                  btn.textContent = 'Hiển thị ảnh gốc';
              } else {
                  const id = Math.random().toString(36).substring(7);
                  wrapper.dataset.reqId = id;
                  btn.textContent = 'Đang dịch...';
                  btn.disabled = true;
                  btn.style.opacity = '1';
                  window.parent.postMessage({ type: 'TRANSLATE_IMAGE', src: img.src, reqId: id }, '*');
              }
           }
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImages);
  } else {
    initImages();
  }
  
  window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'IMAGE_TRANSLATED') {
          const wrapper = document.querySelector('.interactive-img-wrapper[data-req-id="' + event.data.reqId + '"]');
          if (wrapper) {
              const btn = wrapper.querySelector('.translate-btn');
              btn.disabled = false;
              btn.style.opacity = ''; 
              if (event.data.success) {
                  wrapper.dataset.translatedContent = "true";
                  const imgEl = wrapper.querySelector('img.original-img');
                  if (imgEl) {
                      imgEl.setAttribute('data-translated-html', encodeURIComponent(event.data.html));
                  }
                  const rec = document.createElement('div');
                  rec.className = 'reconstructed-wrapper';
                  const shadow = rec.attachShadow({ mode: 'open' });
                  shadow.innerHTML = event.data.html;
                  wrapper.appendChild(rec);
                  wrapper.classList.add('show-reconstructed');
                  btn.textContent = 'Hiển thị ảnh gốc';

                  showImgToast('Tái tạo sơ đồ/biểu đồ thành công!', true);

                  window.parent.postMessage({
                      type: 'PERSIST_TRANSLATED_IMAGE',
                      src: imgEl ? imgEl.getAttribute('src') : null,
                      translatedHtml: event.data.html
                  }, '*');
              } else {
                  btn.textContent = 'Dịch sơ đồ/biểu đồ này';
                  showImgToast(event.data.message || 'Không thể dịch ảnh này.', false);
              }
          }
      }
  });
</script>
`;

    let processedHtml = html;
    if (processedHtml.includes('</body>')) {
        processedHtml = processedHtml.replace('</body>', interactiveScript + '</body>');
    } else {
        processedHtml += interactiveScript;
    }

    return processedHtml;
  }
}
