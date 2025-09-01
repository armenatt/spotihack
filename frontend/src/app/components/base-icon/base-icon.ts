import { Component, computed, input } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'base-icon',
  template: `
    <div
      class="base-icon"
      [style]="{
        width: size() + 'px',
        height: size() + 'px',
        'font-size': size() + 'px',
        fill: color() ? color() : 'currentColor'
      }"
    >
      <svg-icon style="display: block;" [src]="iconSrc()" />
    </div>
  `,
  imports: [AngularSvgIconModule],
})
export class BaseIcon {
  icon = input<string>();
  size = input<string | number>(20);
  color = input<string>();

  iconSrc = computed(() => `/assets/icons/${this.icon()}.svg`);
}
