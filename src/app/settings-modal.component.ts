import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { LucideAngularModule, X, Zap, Brain } from 'lucide-angular';
import { TranslationMode, SearchModel } from './translation.state';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-labelledby="settings-title" (click)="closeModal.emit()">
      <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full p-0 animate-in zoom-in-95 duration-200 overflow-hidden" (click)="$event.stopPropagation()">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 id="settings-title" class="text-lg font-semibold text-slate-900">Thay đổi phong cách mặc định</h3>
          <button (click)="closeModal.emit()" class="text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors focus:outline-none rounded-full p-2 cursor-pointer" aria-label="Đóng cài đặt">
            <lucide-icon [img]="X" class="w-5 h-5" aria-hidden="true"></lucide-icon>
          </button>
        </div>
        <div class="p-6">
          <p class="text-slate-500 text-sm mb-5">
            Mỗi khi tải trang, công cụ sẽ sử dụng phong cách mặc định "Tài liệu khoa học nói chung", nếu bạn thường xuyên dịch tài liệu kiểu khác, bạn có thể chọn phong cách khác. Phong cách được chọn sẽ tự động áp dụng mỗi khi bạn tải lại trang. Cấu hình chỉ lưu tại trình duyệt bạn đang dùng.
          </p>
          <div class="space-y-3">
            <label class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                   [class.border-indigo-600]="modeControl.value === 'zero_math'"
                   [class.bg-indigo-50]="modeControl.value === 'zero_math'">
              <input type="radio" value="zero_math" [formControl]="modeControl" class="text-indigo-600 focus:ring-indigo-600 mt-0.5">
              <span class="text-sm font-medium text-slate-900">Tài liệu khoa học xã hội</span>
            </label>
            <label class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                   [class.border-indigo-600]="modeControl.value === 'zero_svg'"
                   [class.bg-indigo-50]="modeControl.value === 'zero_svg'">
              <input type="radio" value="zero_svg" [formControl]="modeControl" class="text-indigo-600 focus:ring-indigo-600 mt-0.5">
              <span class="text-sm font-medium text-slate-900">Tài liệu khoa học nói chung</span>
            </label>
            <label class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                   [class.border-indigo-600]="modeControl.value === 'normal'"
                   [class.bg-indigo-50]="modeControl.value === 'normal'">
              <input type="radio" value="normal" [formControl]="modeControl" class="text-indigo-600 focus:ring-indigo-600 mt-0.5">
              <span class="text-sm font-medium text-slate-900">Tài liệu toán chuyên ngành</span>
            </label>
            <label class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                   [class.border-indigo-600]="modeControl.value === 'phase1'"
                   [class.bg-indigo-50]="modeControl.value === 'phase1'">
              <input type="radio" value="phase1" [formControl]="modeControl" class="text-indigo-600 focus:ring-indigo-600 mt-0.5">
              <span class="text-sm font-medium text-slate-900">Dịch 2 giai đoạn</span>
            </label>
          </div>
        </div>

        <div class="p-6 pt-0">
          <h4 class="text-sm font-semibold text-slate-900 mb-1.5">Mô hình dịch từ khóa tìm kiếm</h4>
          <p class="text-slate-500 text-sm mb-4">
            Phần này dùng để chọn model AI dùng cho dịch từ khóa từ Việt sang Anh để tìm bài viết trên Scholar (thanh tìm kiếm trên header).
          </p>
          
          <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shadow-inner" role="radiogroup" aria-label="Mô hình tìm kiếm">
            <button 
              type="button"
              role="radio"
              [attr.aria-checked]="searchModelControl.value === 'gemini-flash-lite-latest'"
              (click)="searchModelControl.setValue('gemini-flash-lite-latest')"
              class="group relative flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer"
              [ngClass]="searchModelControl.value === 'gemini-flash-lite-latest' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-slate-900/5' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'"
            >
              <lucide-icon [img]="Zap" class="w-3.5 h-3.5"></lucide-icon>
              <span>Flash Lite</span>
              <div class="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-56 p-2.5 bg-slate-800 text-slate-100 text-xs text-left rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none border border-slate-700 font-normal tracking-wide">
                Tối ưu cho tốc độ dịch từ khóa, hợp cho các từ khóa đơn giản.
                <div class="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 border-t border-l border-slate-700 rotate-45 transform origin-center"></div>
              </div>
            </button>
            <button 
              type="button"
              role="radio"
              [attr.aria-checked]="searchModelControl.value === 'gemini-flash-latest'"
              (click)="searchModelControl.setValue('gemini-flash-latest')"
              class="group relative flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer"
              [ngClass]="searchModelControl.value === 'gemini-flash-latest' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-900/5' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'"
            >
              <lucide-icon [img]="Brain" class="w-3.5 h-3.5"></lucide-icon>
              <span>Flash</span>
              <div class="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-56 p-2.5 bg-slate-800 text-slate-100 text-xs text-left rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none border border-slate-700 font-normal tracking-wide">
                Tốt cho dịch tìm kiếm từ khóa phức tạp, nhưng cần nhiều thời gian hơn.
                <div class="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 border-t border-l border-slate-700 rotate-45 transform origin-center"></div>
              </div>
            </button>
          </div>
        </div>
        <div class="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button (click)="closeModal.emit()" class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer">
            Hủy
          </button>
          <button (click)="onSave()" class="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer">
            Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  `
})
export class SettingsModalComponent {
    readonly X = X;
  readonly Zap = Zap;
  readonly Brain = Brain;

  @Input() set initialMode(mode: TranslationMode | null) {
    if (mode) {
      this.modeControl.setValue(mode);
    }
  }
  
  @Input() set initialSearchModel(model: SearchModel | null) {
    if (model) {
      this.searchModelControl.setValue(model);
    }
  }

  @Output() save = new EventEmitter<{mode: TranslationMode, searchModel: SearchModel}>();
  @Output() closeModal = new EventEmitter<void>();

  modeControl = new FormControl<TranslationMode>('zero_math', { nonNullable: true });
  searchModelControl = new FormControl<SearchModel>('gemini-flash-lite-latest', { nonNullable: true });

  onSave() {
    this.save.emit({
      mode: this.modeControl.value,
      searchModel: this.searchModelControl.value
    });
  }
}
