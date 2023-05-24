import { Component } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserService } from './services/user.service';
import { User } from './models/user';
import { Subject, concat, last } from 'rxjs';
import { forbiddenDni } from './shared/forbidden-dni.directive';
import { NotifierService } from './services/notifier.service';
import { forbiddenDate } from './shared/forbidden-date.directive';

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
  showAlert: boolean = false;
  private selectedUser!: User;


  readonly pageSize: number = 5;
  public _pageNumbers: number = 0;
  currentPage: number = 1;

  constructor(private readonly fb: FormBuilder, private userService: UserService, private notifierService: NotifierService) { }

  ngOnInit() {
    this.user = this.initForm();
    this.refreshTable.subscribe(currentPage => {
      this.userService.getCountUsers(this.pageSize, currentPage).subscribe(paginationData => {
        this.currentPage = currentPage;
        this.users = paginationData.users;
        this._pageNumbers = paginationData.totalPages;
      });
    });
    this.refreshTable.next(1);
  }

  onSubmit(): void {
    this.user.markAllAsTouched();
    if (this.user.valid) {
      this.userService.addUser(this.getUser()).subscribe(_ => {
        this.notifierService.show("Se creeo el usuario correctamente :)");
        this.refreshTable.next(this.currentPage);
        this.user.reset();
      });
    }
  }

  setPage(page: number) {
    this.users = [];
    this.refreshTable.next(page);
  }

  get pageNumbers() {
    const [prev, next] = [this.currentPage - 1, this.currentPage + 1];
    return new Set([
      1,
      (prev > 1) ? prev : 1,
      this.currentPage,
      (next <= this._pageNumbers) ? next : 1,
      this._pageNumbers
    ]);
    // return Array.from({ length: this._pageNumbers }, (_, i) => i + 1);
  }

  get centralPages() {
    const rango = 1;
    const centralPages: number[] = [];
    let [prev, next] = [this.currentPage - rango, this.currentPage + rango];
    prev = prev <= 1 ? 2 : prev;
    next = next >= this._pageNumbers ? this._pageNumbers - 1 : next;
    for (let i = prev; (i <= next ) && (i < this._pageNumbers) ; ++i) {
      centralPages.push(i);
    }
    return centralPages;
  }

  confirmDelete(user: User) {
    this.selectedUser = user;
    this.showAlert = true;
  }

  onDeleteConfirmed() {
    this.userService.removeUser(this.selectedUser).subscribe(_ => {
      this.notifierService.show("Se elimino el usario correctamente");
      this.refreshTable.next(this.currentPage);
    });
    this.showAlert = false;
  }

  onCancelDelete() {
    this.showAlert = false;
  }

  initForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', [Validators.required, forbiddenDate()]],
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
