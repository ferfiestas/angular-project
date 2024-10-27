import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { CourseService } from '../../../../../../services/course.service';

@Component({
  selector: 'app-course-edit-dialog',
  templateUrl: './course-edit-dialog.component.html',
  styleUrls: ['./course-edit-dialog.component.css']
})
export class CourseEditDialogComponent implements OnInit {
  editForm: FormGroup;
  puestos: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<CourseEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private courseService: CourseService
  ) {
    console.log('Datos recibidos en el diálogo:', this.data);
    this.editForm = this.fb.group({
      idCurso: [data.id],
      titulo: [data.title, Validators.required],
      subtitulo: [data.subtitulo, Validators.required],
      descripcion: [data.description, Validators.required],
      nota: [data.type, Validators.required],
      rutaImagen: [data.rutaImagen],
      liga: [data.url, Validators.required],
      idpuesto: [data.puestos, Validators.required] // idPuesto será seleccionado del dropdown
    });
  }

  ngOnInit(): void {
    this.loadPuestos();
  }

  loadPuestos() {
    this.courseService.getPuestos().subscribe(
      (puestos: any[]) => {
        this.puestos = puestos;
      },
      (error) => {
        console.error('Error al cargar los puestos', error);
      }
    );
  }

  onSave() {
    if (this.editForm.valid) {
      const courseData = this.editForm.value;

      console.log('Datos del curso a actualizar:', courseData); // Verificar datos antes de enviar

      this.courseService.updateCourse(courseData).subscribe(
        (response) => {
          console.log('Curso actualizado con éxito', response);
          this.dialogRef.close(true); // Cerrar el diálogo después de la actualización
        },
        (error) => {
          console.error('Error al actualizar el curso', error);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}