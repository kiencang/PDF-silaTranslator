import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Settings, AlertCircle, ArrowDown, Loader2, Play } from 'lucide-angular';
import { TranslationMode } from './app';

@Component({
  selector: 'app-config-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="bg-white rounded-2xl ring-1 ring-slate-900/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative transition-opacity duration-300"
             [class.opacity-50]="isProcessing" 
             [class.pointer-events-none]="isProcessing">
      <div class="min-h-[60px] px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 rounded-t-2xl">
        <h2 class="text-sm font-semibold text-slate-900 uppercase tracking-wider">2. Phong cách dịch</h2>
        <div class="flex items-center gap-3 ml-auto">
          <div class="relative group">
            <button (click)="openSettings.emit()" class="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
              <lucide-icon [img]="Settings" class="w-4.5 h-4.5" aria-hidden="true"></lucide-icon>
            </button>
            <div class="absolute bottom-full right-0 mb-2 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
              Thay đổi phong cách mặc định.
              <div class="absolute top-full right-1.5 border-[5px] border-transparent border-t-slate-800"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-6 space-y-5">
        
        <!-- Mode Selection -->
        <div class="space-y-3">
          <fieldset class="space-y-2">
            <legend class="sr-only">Chọn phong cách dịch</legend>
            <label class="flex items-start gap-3 p-3 border rounded-xl transition-colors"
                   [class.cursor-pointer]="!isHtmlUploaded"
                   [class.cursor-not-allowed]="isHtmlUploaded"
                   [class.opacity-50]="isHtmlUploaded"
                   [class.bg-slate-50]="isHtmlUploaded"
                   [class.hover:bg-slate-50]="!isHtmlUploaded"
                   [class.border-indigo-600]="modeControl.value === 'zero_math'"
                   [class.bg-indigo-50]="modeControl.value === 'zero_math'">
              <input type="radio" name="mode" value="zero_math" [formControl]="modeControl" [attr.disabled]="isHtmlUploaded ? true : null" class="mt-1 text-indigo-600 focus:ring-indigo-600 disabled:opacity-50" aria-describedby="desc-zero-math">
              <div>
                <div class="text-sm font-medium text-slate-900">Tài liệu khoa học xã hội</div>
                <div id="desc-zero-math" class="text-xs text-slate-600 mt-0.5">PDF -> HTML (VI). <strong>Không công thức toán. Không đồ thị toán</strong>.</div>
                @if (isHtmlUploaded) {
                  <div class="text-[11px] font-medium text-amber-600 mt-1 flex items-center gap-1"><lucide-icon [img]="AlertCircle" class="w-3.5 h-3.5"></lucide-icon> Chỉ hỗ trợ file PDF</div>
                }
              </div>
            </label>

            <label class="flex items-start gap-3 p-3 border rounded-xl transition-colors"
                   [class.cursor-pointer]="!isHtmlUploaded"
                   [class.cursor-not-allowed]="isHtmlUploaded"
                   [class.opacity-50]="isHtmlUploaded"
                   [class.bg-slate-50]="isHtmlUploaded"
                   [class.hover:bg-slate-50]="!isHtmlUploaded"
                   [class.border-indigo-600]="modeControl.value === 'zero_svg'"
                   [class.bg-indigo-50]="modeControl.value === 'zero_svg'">
              <input type="radio" name="mode" value="zero_svg" [formControl]="modeControl" [attr.disabled]="isHtmlUploaded ? true : null" class="mt-1 text-indigo-600 focus:ring-indigo-600 disabled:opacity-50" aria-describedby="desc-zero-svg">
              <div>
                <div class="text-sm font-medium text-slate-900">Tài liệu khoa học nói chung</div>
                <div id="desc-zero-svg" class="text-xs text-slate-600 mt-0.5">PDF -> HTML (VI). Có công thức toán nhưng không gồm đồ thị toán phức tạp. <strong>Đa phần các tài liệu khoa học nên chọn tùy chọn này</strong>.</div>
                @if (isHtmlUploaded) {
                  <div class="text-[11px] font-medium text-amber-600 mt-1 flex items-center gap-1"><lucide-icon [img]="AlertCircle" class="w-3.5 h-3.5"></lucide-icon> Chỉ hỗ trợ file PDF</div>
                }
              </div>
            </label>

            <label class="flex items-start gap-3 p-3 border rounded-xl transition-colors"
                   [class.cursor-pointer]="!isHtmlUploaded"
                   [class.cursor-not-allowed]="isHtmlUploaded"
                   [class.opacity-50]="isHtmlUploaded"
                   [class.bg-slate-50]="isHtmlUploaded"
                   [class.hover:bg-slate-50]="!isHtmlUploaded"
                   [class.border-indigo-600]="modeControl.value === 'normal'"
                   [class.bg-indigo-50]="modeControl.value === 'normal'">
              <input type="radio" name="mode" value="normal" [formControl]="modeControl" [attr.disabled]="isHtmlUploaded ? true : null" class="mt-1 text-indigo-600 focus:ring-indigo-600 disabled:opacity-50" aria-describedby="desc-normal">
              <div>
                <div class="text-sm font-medium text-slate-900">Tài liệu toán chuyên ngành</div>
                <div id="desc-normal" class="text-xs text-slate-600 mt-0.5">PDF -> HTML (VI). Có công thức toán và cả đồ thị toán.</div>
                @if (isHtmlUploaded) {
                  <div class="text-[11px] font-medium text-amber-600 mt-1 flex items-center gap-1"><lucide-icon [img]="AlertCircle" class="w-3.5 h-3.5"></lucide-icon> Chỉ hỗ trợ file PDF</div>
                }
              </div>
            </label>                

            <div class="relative border rounded-xl transition-colors duration-200"
                 [class.hover:bg-slate-50]="!isTwoPhaseMode"
                 [class.bg-indigo-50]="isTwoPhaseMode"
                 [class.border-indigo-600]="isTwoPhaseMode">
              
              <label class="flex items-start gap-3 p-3 cursor-pointer"
                     (click)="selectTwoPhaseMode()"
                     (keydown.enter)="selectTwoPhaseMode()"
                     tabindex="0">
                <input type="radio" name="main_mode" [checked]="isTwoPhaseMode" class="mt-1 text-indigo-600 focus:ring-indigo-600" aria-describedby="desc-two-phase" tabindex="-1">
                <div>
                  <div class="text-sm font-medium text-slate-900">Dịch 2 giai đoạn (cho tài liệu bố cục phức tạp)</div>
                  <div id="desc-two-phase" class="text-xs text-slate-600 mt-0.5">Chia quá trình dịch thành 2 bước (phase). <strong>Áp dụng được với mọi kiểu tài liệu. Chất lượng dịch có thể tốt hơn</strong>, nhưng tốn thời gian &amp; token hơn đáng kể (gấp đôi).</div>
                </div>
              </label>

              @if (isTwoPhaseMode) {
                <div class="p-3 pt-0 pl-11 space-y-2">
                  <label class="flex items-start gap-3 p-3 border rounded-xl transition-colors bg-white"
                         [class.cursor-pointer]="!isHtmlUploaded"
                         [class.cursor-not-allowed]="isHtmlUploaded"
                         [class.opacity-50]="isHtmlUploaded"
                         [class.bg-slate-50]="isHtmlUploaded"
                         [class.hover:bg-slate-50]="!isHtmlUploaded"
                         [class.border-indigo-600]="modeControl.value === 'phase1'"
                         [class.ring-1]="modeControl.value === 'phase1'"
                         [class.ring-indigo-600]="modeControl.value === 'phase1'">
                    <input type="radio" name="mode" value="phase1" [formControl]="modeControl" [attr.disabled]="isHtmlUploaded ? true : null" class="mt-1 text-indigo-600 focus:ring-indigo-600 disabled:opacity-50" aria-describedby="desc-phase1">
                    <div>
                      <div class="text-sm font-medium text-slate-900">Phase 1: PDF sang HTML (EN)</div>
                      <div id="desc-phase1" class="text-xs text-slate-600 mt-0.5">Trích layout và nội dung tiếng Anh.</div>
                      @if (isHtmlUploaded) {
                        <div class="text-[11px] font-medium text-amber-600 mt-1 flex items-center gap-1"><lucide-icon [img]="AlertCircle" class="w-3.5 h-3.5"></lucide-icon> Chỉ hỗ trợ file PDF</div>
                      }
                    </div>
                  </label>

                  <div class="flex justify-center">
                    <lucide-icon [img]="ArrowDown" class="w-5 h-5 text-slate-500" aria-hidden="true"></lucide-icon>
                  </div>

                  <label class="flex items-start gap-3 p-3 border rounded-xl transition-colors bg-white"
                         [class.cursor-pointer]="!isPdfUploaded"
                         [class.cursor-not-allowed]="isPdfUploaded"
                         [class.opacity-50]="isPdfUploaded"
                         [class.bg-slate-50]="isPdfUploaded"
                         [class.hover:bg-slate-50]="!isPdfUploaded"
                         [class.border-indigo-600]="modeControl.value === 'phase2'"
                         [class.ring-1]="modeControl.value === 'phase2'"
                         [class.ring-indigo-600]="modeControl.value === 'phase2'">
                    <input type="radio" name="mode" value="phase2" [formControl]="modeControl" [attr.disabled]="isPdfUploaded ? true : null" class="mt-1 text-indigo-600 focus:ring-indigo-600 disabled:opacity-50" aria-describedby="desc-phase2">
                    <div>
                      <div class="text-sm font-medium text-slate-900">Phase 2: HTML (EN) sang HTML (VI)</div>
                      <div id="desc-phase2" class="text-xs text-slate-600 mt-0.5">Yêu cầu tải lên file HTML có được từ Phase 1.</div>
                      @if (isPdfUploaded) {
                        <div class="text-[11px] font-medium text-amber-600 mt-1 flex items-center gap-1"><lucide-icon [img]="AlertCircle" class="w-3.5 h-3.5"></lucide-icon> Chỉ hỗ trợ file HTML</div>
                      }
                    </div>
                  </label>
                </div>
              }
            </div>
          </fieldset>
        </div>

        <!-- Action Button -->
        <button 
          (click)="processFile.emit()"
          [disabled]="!canProcess || hasResultHtml"
          class="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed cursor-pointer text-white rounded-2xl font-medium flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          @if (isProcessing) {
            <lucide-icon [img]="Loader2" class="w-5 h-5 animate-spin" aria-hidden="true"></lucide-icon>
            <span>Đang xử lý...</span>
          } @else {
            <lucide-icon [img]="Play" class="w-5 h-5" aria-hidden="true"></lucide-icon>
            <span>Bắt đầu ngay</span>
          }
        </button>

        @if (isProcessing) {
          <p class="text-center text-sm text-indigo-600 font-medium animate-pulse" aria-live="polite">
            {{ progressMessage }}
          </p>
        }
      </div>
    </section>
  `
})
export class ConfigSectionComponent {
  readonly Settings = Settings;
  readonly AlertCircle = AlertCircle;
  readonly ArrowDown = ArrowDown;
  readonly Loader2 = Loader2;
  readonly Play = Play;

  @Input() modeControl!: FormControl<TranslationMode>;
  @Input() useGoogleSearchControl!: FormControl<boolean>;
  @Input() isHtmlUploaded = false;
  @Input() isPdfUploaded = false;
  @Input() isTwoPhaseMode = false;
  @Input() isProcessing = false;
  @Input() canProcess = false;
  @Input() hasResultHtml = false;
  @Input() progressMessage = '';

  @Output() openSettings = new EventEmitter<void>();
  @Output() processFile = new EventEmitter<void>();

  selectTwoPhaseMode() {
    if (!this.isTwoPhaseMode) {
      this.modeControl.setValue(this.isHtmlUploaded ? 'phase2' : 'phase1');
    }
  }
}
