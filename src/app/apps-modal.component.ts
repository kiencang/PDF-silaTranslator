import { Component, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LayoutGrid, X, FileText, Youtube, Globe, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-apps-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-labelledby="apps-title" (click)="closeModal.emit()">
      <div class="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-0 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <lucide-icon [img]="LayoutGrid" class="w-5 h-5"></lucide-icon>
            </div>
            <h3 id="apps-title" class="text-lg font-bold text-slate-900">Các ứng dụng dịch thuật từ Anh sang Việt tiện dùng khác</h3>
          </div>
          <button (click)="closeModal.emit()" class="text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors focus:outline-none rounded-full p-2 cursor-pointer" aria-label="Đóng modal">
            <lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon>
          </button>
        </div>
        
        <!-- Content -->
        <div class="p-6 overflow-y-auto bg-white flex-1">
          <p class="text-sm text-slate-600 leading-relaxed mb-4">
            Ngoài dịch tài liệu chuyên ngành PDF, chúng tôi còn cung cấp bộ giải pháp dịch thuật chuyên sâu bằng AI, miễn phí trên AI Studio. Hãy tham khảo ứng dụng bạn muốn sử dụng dưới đây:
          </p>
          
          <div class="grid grid-cols-1 gap-4">
            <!-- App 1: Dịch sách dài -->
            <a href="https://aistudio.google.com/apps/d25924ff-35f1-42f7-9543-f142ecfe037a?showPreview=true&showAssistant=true&fullscreenApplet=true" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="group flex items-start p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl transition-all duration-200 text-left cursor-pointer no-underline focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <div class="mr-4 p-3 rounded-xl shrink-0 flex items-center justify-center transition-all group-hover:scale-105 duration-200 bg-amber-50 text-amber-600 border border-amber-100">
                <lucide-icon [img]="FileText" class="w-6 h-6"></lucide-icon>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">Dịch sách có nội dung dài</h4>
                </div>
                <p class="text-xs text-slate-500 leading-relaxed">
                  Có khả năng dịch đa dạng từ truyện ngắn, tiểu thuyết, tài liệu chuyên ngành.
                </p>
                <div class="mt-3 flex justify-end">
                  <div class="flex items-center text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 group-hover:bg-indigo-100 group-hover:border-indigo-200 transition-colors px-3 py-1.5 rounded-lg">
                    <span>Trải nghiệm ngay</span>
                    <lucide-icon [img]="ArrowRight" class="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1 duration-200"></lucide-icon>
                  </div>
                </div>
              </div>
            </a>

            <!-- App 2: Dịch phụ đề YouTube -->
            <a href="https://aistudio.google.com/apps/b98324ac-cdef-4887-961c-dbcc2c50a6c7?fullscreenApplet=true&showPreview=true&showAssistant=true" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="group flex items-start p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl transition-all duration-200 text-left cursor-pointer no-underline focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <div class="mr-4 p-3 rounded-xl shrink-0 flex items-center justify-center transition-all group-hover:scale-105 duration-200 bg-red-50 text-red-600 border border-red-100">
                <lucide-icon [img]="Youtube" class="w-6 h-6"></lucide-icon>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">Dịch phụ đề YouTube</h4>
                </div>
                <p class="text-xs text-slate-500 leading-relaxed">
                  Dịch phụ đề video YouTube chất lượng hơn, chế độ song ngữ, lịch sử dịch để tiện xem lại khi cần.
                </p>
                <div class="mt-3 flex justify-end">
                  <div class="flex items-center text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 group-hover:bg-indigo-100 group-hover:border-indigo-200 transition-colors px-3 py-1.5 rounded-lg">
                    <span>Trải nghiệm ngay</span>
                    <lucide-icon [img]="ArrowRight" class="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1 duration-200"></lucide-icon>
                  </div>
                </div>
              </div>
            </a>

            <!-- App 3: Dịch website -->
            <a href="https://aistudio.google.com/apps/4cc7e19e-46dd-4d38-8617-ba38ef1c80c3?fullscreenApplet=true&showPreview=true&showAssistant=true" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="group flex items-start p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl transition-all duration-200 text-left cursor-pointer no-underline focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <div class="mr-4 p-3 rounded-xl shrink-0 flex items-center justify-center transition-all group-hover:scale-105 duration-200 bg-blue-50 text-blue-600 border border-blue-100">
                <lucide-icon [img]="Globe" class="w-6 h-6"></lucide-icon>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">Dịch website</h4>
                </div>
                <p class="text-xs text-slate-500 leading-relaxed">
                  Dịch website chất lượng hơn & tối ưu cho việc đọc hiểu tài liệu.
                </p>
                <div class="mt-3 flex justify-end">
                  <div class="flex items-center text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 group-hover:bg-indigo-100 group-hover:border-indigo-200 transition-colors px-3 py-1.5 rounded-lg">
                    <span>Trải nghiệm ngay</span>
                    <lucide-icon [img]="ArrowRight" class="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1 duration-200"></lucide-icon>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>

        <!-- Actions -->
        <div class="p-5 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button (click)="closeModal.emit()" class="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400">
            Đóng
          </button>
        </div>
      </div>
    </div>
  `
})
export class AppsModalComponent {
  LayoutGrid = LayoutGrid;
  XIcon = X;
  FileText = FileText;
  Youtube = Youtube;
  Globe = Globe;
  ArrowRight = ArrowRight;

  @Output() closeModal = new EventEmitter<void>();
}
