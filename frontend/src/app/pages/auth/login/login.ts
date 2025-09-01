import { Component } from '@angular/core';
import { BaseButton } from '@/app/components/base-button/base-button';
import { BaseIcon } from '@/app/components/base-icon/base-icon';
import { BaseInput } from '@/app/components/base-input/base-input';

@Component({
  templateUrl: './login.html',
  imports: [BaseButton, BaseIcon, BaseInput],
})
export class Login {}
