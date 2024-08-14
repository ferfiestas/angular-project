import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import Swal from 'sweetalert2'


import { AccessService } from '../../services/access.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatToolbarModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  private accessService = inject(AccessService);
  private formBuild = inject(FormBuilder);
  private router = inject(Router);

  public formLogin: FormGroup = this.formBuild.group({
    usuario1: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  LogIn() {
    const { usuario1, password } = this.formLogin.value;
  
    this.accessService.login(usuario1, password)
      .subscribe({
        
        error: (message) => {
          Swal.fire('Error', message, 'error');
        }
      });
  }

}
