import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightCard]',
  standalone: true,
})
export class HighlightCardDirective {
  @Input() appHighlightCard = '#eef4ff';
  @Input() highlightBorder = '#c7d8ff';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.renderer.setStyle(this.el.nativeElement, 'background', this.appHighlightCard);
    this.renderer.setStyle(this.el.nativeElement, 'borderColor', this.highlightBorder);
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(-2px)');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'all 0.2s ease');
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.renderer.removeStyle(this.el.nativeElement, 'background');
    this.renderer.removeStyle(this.el.nativeElement, 'borderColor');
    this.renderer.removeStyle(this.el.nativeElement, 'transform');
  }
}