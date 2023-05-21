import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function forbiddenDate(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // aqui va la validacion de la fecha
    const currentDate = new Date();
    const inputDate = new Date(control.value);
    const forbidden = (inputDate >= currentDate);
    return forbidden ? { forbiddenDate: { value: control.value } } : null;
  };
}