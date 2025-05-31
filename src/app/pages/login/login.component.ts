import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/security/auth.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { HTTP_STATUS } from '../../util/constant';
import Swal from 'sweetalert2';
import { StorageService } from '../../service/util/storage.service';
import { UserRequest } from '../../model/api/request/UserRequest';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule]
})
export class LoginComponent {

  userRequest: UserRequest = {} as UserRequest;
  userForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService) {
    this.userForm = new FormGroup({
      login: new FormControl('', [Validators.required]),
      clave: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.userForm.reset();
  }

  setUserRequest(): void {
    this.userRequest.cuenta = this.userForm.get('login')?.value;
    this.userRequest.clave = this.userForm.get('clave')?.value;
  }

  onSubmit() {
    this.setUserRequest();
    this.authService.login(this.userRequest).subscribe(
      (result: any) => {
        this.storageService.updateSession(result?.object);
        this.router.navigate(['/home']);
      },
      (err: any) => {
        switch (err.status) {
          case HTTP_STATUS.NOT_FOUND:
            Swal.close();
            Swal.fire({
              icon: 'error',
              title: '¡Error!',
              text: err.error,
            });
            break;
          case HTTP_STATUS.BAD_REQUEST:
            Swal.close();
            Swal.fire({
              icon: 'warning',
              title: '¡Advertencia!',
              text: err.error,
            });
            break;
          default:
            Swal.close();
            Swal.fire({
              icon: 'warning',
              title: '¡Advertencia!',
              text: err.error,
            });
            break;
        }
      }
    );
  }
}