import { Component } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserService } from './services/user.service';
import { User } from './models/user';
import { Subject, concat, last } from 'rxjs';
import { forbiddenDni } from './shared/forbidden-dni.directive';

// Realizar el control del formulario con FormsBuilder
// Campo Nombre -> required
// Campo Apellido -> required
// Campo Fecha Nacimiento -> calendario
// Campo Dni -> validación con expresion regular
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  user!: FormGroup;
  users: User[] = [];
  private refreshTable = new Subject<any>();

  constructor(private readonly fb: FormBuilder, private userService: UserService) { }

  ngOnInit() {
    this.user = this.initForm();
    this.refreshTable.subscribe(_ => {
      this.userService.getCountUsers(5,1).subscribe(paginationData => this.users = paginationData.users);
    });
    this.refreshTable.next({});
  }
  onSubmit(): void {
    this.user.markAllAsTouched();
    if (this.user.valid) {
      concat(
        this.userService.addUser(this.getUser()),
        this.userService.getCountUsers(1,5),
      ).subscribe( _ => this.user.reset())
    }
  }

  deleteUser(user: User){
    this.userService.removeUser(user).subscribe();
  }

  initForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      dni: ['', [Validators.required, forbiddenDni(), Validators.minLength(8)]],
    }, { updateOn: "submit" })
  }

  getUser(): User {
    return {
      firstName: this.firstName ? this.firstName.value : "",
      lastName: this.lastName ? this.lastName.value : "",
      birthDate: this.birthDate ? this.birthDate.value : "",
      dni: this.dni ? this.dni.value : "",
    };
  }

  get firstName() {
    return this.user.get("firstName");
  }

  get lastName() {
    return this.user.get("lastName");
  }

  get birthDate() {
    return this.user.get("birthDate");
  }

  get dni() {
    return this.user.get("dni");
  }
}
