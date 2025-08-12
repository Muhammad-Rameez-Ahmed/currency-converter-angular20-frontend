import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightNew]',
  standalone: true
})
export class HighlightNewDirective implements OnChanges {
  @Input('appHighlightNew') isNew: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    if (this.isNew) {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#e0f7fa');
    }
  }
}
