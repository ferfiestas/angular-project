import { Component, Inject, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AccessService } from '../../services/access.service';
import { login } from '../../components/interfaces/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private accessService = inject(AccessService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formLogin: FormGroup = this.formBuild.group({
    userid: ['', Validators.required],
    password: ['', Validators.required],
  })

  LogIn () {
    if(this.formLogin.invalid) return;

    const object:login = {
      userid:this.formLogin.value.userid,
      password:this.formLogin.value.password,
    }

    this.accessService.login(object).subscribe({
      next:(data) => {
        if(data.isSuccess){
          localStorage.setItem("token", data.token)
          this.router.navigate(['profile'])
        }else{
          alert("Credenciales incorrectas")
        }
      },
      error:(error) => {
        console.log(error.message);
      }
    })
  }

}
