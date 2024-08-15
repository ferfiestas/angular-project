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
      gradoEstudio: [{ value: '', disabled: true }],
      municipio: [{ value: '', disabled: true }],
      telefono: [{ value: '', disabled: true }],
      telEmergencia: [{ value: '', disabled: true }],
      dependencia: [{ value: '', disabled: true }],
      tipoContratacion: [{ value: '', disabled: true }],
      fechaContratacion: [{ value: '', disabled: true }],
      domicilio: [{ value: '', disabled: true }],
      cuadrante: [{ value: '', disabled: true }],
      puesto: [{ value: '', disabled: true }],
      area: [{ value: '', disabled: true }],
      municipioTrabajo: [{ value: '', disabled: true }],
      referente: [{ value: '', disabled: true }]
    });

    this.loadUserData();
  }

  loadUserData(): void {
    const idUsuario = localStorage.getItem('usuario1');
    if (idUsuario) {
      const imageUrl = `http://auditoriainterna.com.mx/photo_upload/${idUsuario}.jpg`;
      this.checkImageExists(imageUrl).then(exists => {
        this.imageUrl = exists ? imageUrl : 'http://auditoriainterna.com.mx/photo_upload/img00000.jpg';
      });
    } else {
      this.imageUrl = 'http://auditoriainterna.com.mx/photo_upload/img00000.jpg';
    }

    this.profileService.getProfileData().subscribe((data: { [x: string]: any; persona?: any; }) => {
      this.profileForm.patchValue(data);
    });
  }

  checkImageExists(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }
}