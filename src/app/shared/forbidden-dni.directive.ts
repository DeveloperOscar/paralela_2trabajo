import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function forbiddenDni(): ValidatorFn {
  const dniRe: RegExp = /^(\d{8})$/
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = !dniRe.test(control.value);
    return forbidden ? {forbiddenDni: {value: control.value}} : null;
  };
}