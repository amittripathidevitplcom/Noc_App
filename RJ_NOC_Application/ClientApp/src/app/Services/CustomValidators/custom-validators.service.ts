import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
export function DropdownValidators(control: AbstractControl): { [key: string]: boolean } | null {
  if (control.value !== undefined && (isNaN(control.value) || control.value < 1)) {
    return { 'dropdown': true };
  }
  return null;
}
export function createPasswordStrengthValidator(control: AbstractControl): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;
    return !passwordValid ? { passwordStrength: true } : null;
  }
}
export function MustMatch(controlName: string, matchingControlName: string) {
  return (group: AbstractControl): { [key: string]: boolean } | null => {
    const control = group.get(controlName);
    const matchingControl = group.get(matchingControlName);
    if (!control || !matchingControl) {
      return null;
    }
    // return if another validator has already found an error on the matchingControl
    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      return null;
    }
    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
    return null;
  }
}

