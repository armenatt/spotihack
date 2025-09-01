import { Component, computed, input, signal } from '@angular/core';
import { BaseIcon } from '../base-icon/base-icon';
import { BaseButton } from '../base-button/base-button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'base-input',
  styleUrl: './base-input.scss',
  templateUrl: './base-input.html',
  imports: [BaseIcon, BaseButton, ReactiveFormsModule],
})
export class BaseInput {
  label = input<string>();
  type = input<'text' | 'password'>('text');
  error = input<string | boolean>('');
  placeholder = input<string>('');

  showPassword = signal(false);

  id = computed(() => Math.random());

  formControl = input(new FormControl(''));
}
