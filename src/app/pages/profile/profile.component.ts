import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class profileComponent implements OnInit {
  profileForm!: FormGroup;
  imageUrl: string = '';

  constructor(private fb: FormBuilder, private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      usuario: [{ value: '', disabled: true }],
      nombre: [{ value: '', disabled: true }],
      rfc: [{ value: '', disabled: true }],
      curp: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      estado: [{ value: '', disabled: true }],
      municipio: [{ value: '', disabled: true }],
      estatus: [{ value: '', disabled: true }],
      folio: [{ value: '', disabled: true }],
      tipoContratacion: [{ value: '', disabled: true }],
      fechaContratacion: [{ value: '', disabled: true }],
      domicilio: [{ value: '', disabled: true }],
      cuadrante: [{ value: '', disabled: true }],
      puesto: [{ value: '', disabled: true }],
      referente: [{ value: '', disabled: true }]
    });

    this.loadUserData();
  }

  loadUserData(): void {
    this.profileService.getProfileData().subscribe(data => {
      this.profileForm.patchValue(data);
      this.imageUrl = data.persona.urlImagen;
    });
  }
}