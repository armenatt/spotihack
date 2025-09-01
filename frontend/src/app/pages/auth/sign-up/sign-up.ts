import { Component } from '@angular/core';
import { BaseInput } from '@/app/components/base-input/base-input';
import { BaseButton } from '@/app/components/base-button/base-button';
import { BaseLink } from '@/app/components/base-link/base-link';
import {
  FormControl,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';

@Component({
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
  imports: [BaseInput, BaseButton, BaseLink, ɵInternalFormsSharedModule],
})
export class SignUp {
  email = new FormControl([Validators.required, Validators.email]);
  signUpForm = new FormGroup({
    password: new FormControl([Validators.required]),
    passwordConfirm: new FormControl(),
  });
}
