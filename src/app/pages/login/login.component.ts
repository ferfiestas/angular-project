import { Component, Inject, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';


import { AccessService } from '../../services/access.service';
import { login } from '../../components/interfaces/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatToolbarModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
hide() {
throw new Error('Method not implemented.');
}
clickEvent(_$event: MouseEvent) {
throw new Error('Method not implemented.');
}

  private accessService = inject(AccessService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formLogin: FormGroup = this.formBuild.group({
    userid: ['', Validators.required],
    password: ['', Validators.required],
  })

  LogIn() {
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
          alert("Credenciales son incorrectas")
        }
      },
      error:(error) => {
        console.log(error.message);
      }
    })
  }

}
