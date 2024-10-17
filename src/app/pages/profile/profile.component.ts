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
      division: [{ value: '', disabled: true }],
      puesto: [{ value: '', disabled: true }],
      area: [{ value: '', disabled: true }],
      municipioTrabajo: [{ value: '', disabled: true }],
      referente: [{ value: '', disabled: true }]
    });

    this.loadUserData();
  }

  loadUserData(): void {
    const idUsuario = localStorage.getItem('usuario1');
    const defaultImageUrl = 'https://encompletadisonancia.com.mx/photo_upload/img00000.jpg';
    
    if (idUsuario) {
      const possibleExtensions = ['jpg', 'png', 'jpeg'];
      this.checkMultipleImageExtensions(idUsuario, possibleExtensions)
        .then((validImageUrl) => {
          this.imageUrl = validImageUrl || defaultImageUrl;
        })
        .catch(() => {
          // Si hay un error en la verificación, usa la imagen por defecto
          this.imageUrl = defaultImageUrl;
        });
    } else {
      this.imageUrl = defaultImageUrl;
    }
  
    this.profileService.getProfileData().subscribe(
      (data: { [key: string]: any; persona?: any; }) => {
        this.profileForm.patchValue(data);
      },
      (error) => {
        console.error('Error al cargar los datos del perfil:', error);
        // Puedes manejar el error de manera más específica aquí si es necesario
      }
    );
  }
  
  private async checkMultipleImageExtensions(idUsuario: string, extensions: string[]): Promise<string | null> {
    for (const ext of extensions) {
      const imageUrl = `https://encompletadisonancia.com.mx/photo_upload/${idUsuario}.${ext}`;
      const exists = await this.checkImageExists(imageUrl);
      if (exists) {
        return imageUrl; // Si se encuentra una imagen válida, retorna su URL
      }
    }
    return null; // Si ninguna imagen es válida, retorna null
  }
  
  private checkImageExists(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }
}