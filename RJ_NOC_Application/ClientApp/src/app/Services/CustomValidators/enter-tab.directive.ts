import {
  Directive,
  Renderer2,
  ContentChildren,
  QueryList,
  Input,
  HostListener,
  ElementRef,
  ViewContainerRef,
  HostBinding,
  ContentChild,
} from '@angular/core';
import { NgControl, FormControl } from '@angular/forms';

@Directive({
  selector: '[enter-tab]',
})
export class EnterTabDirective {
  @ContentChild('nextTab') controls;//: QueryList<any>;
  nextTab;

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngAfterViewInit(): void {
    console.log(this.controls)

    this.controls.changes.subscribe((controls) => {
      this.createKeydownEnter(controls);
    });
    if (this.controls.length) {
      this.createKeydownEnter(this.controls);
    }
  }
  private createKeydownEnter(querycontrols) {
    console.log(querycontrols);
    querycontrols.forEach((c) => {
      this.renderer.listen(c.nativeElement, 'keydown.enter', (event) => {
        if (this.controls.last != c) {
          let controls = querycontrols.toArray();
          let index = controls.findIndex((d) => d == c);
          if (index >= 0) {
            let nextControl = controls.find(
              (n, i) => n && !n.nativeElement.attributes.disabled && i > index
            );
            if (nextControl) {
              nextControl.nativeElement.focus();
              event.preventDefault();
            }
          }
        }
      });
    });
  }
}
