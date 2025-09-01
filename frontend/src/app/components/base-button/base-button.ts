import { Component, computed, input, signal } from '@angular/core';
import { BaseIcon } from '../base-icon/base-icon';

export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  // OUTLINED = 'outlined',
  TEXT = 'text',
  LINK = 'link',
}

@Component({
  selector: 'base-button',
  imports: [BaseIcon],
  standalone: true,
  templateUrl: './base-button.html',
  styleUrl: './base-button.scss',
})
export class BaseButton {
  variant = input<`${ButtonVariant}`>(ButtonVariant.PRIMARY);
  icon = input<string | undefined>();
  iconSize = input<number>(20);
  iconOnly = input<boolean>(false);

  baseClass = 'base-button';

  variantClass = computed(() => `${this.baseClass}--variant-${this.variant()}`);
  iconOnlyClass = `${this.baseClass}--icon-only`;
}
