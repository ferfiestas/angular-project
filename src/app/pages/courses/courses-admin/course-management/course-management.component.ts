import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { CourseService } from '../../../../services/course.service';
import { Course } from '../../../../components/interfaces/course.model';
import { CourseEditDialogComponent } from '../course-edit-dialog/course-edit-dialog/course-edit-dialog/course-edit-dialog.component';


@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.css']
})
export class CourseManagementComponent implements OnInit {
  courseForm!: FormGroup;
  courses: Course[] = [];
  puestos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadPuestos();
    this.loadCourses();
  }

  initializeForm() {
    this.courseForm = this.fb.group({
      idCurso: [null], // Solo para PUT
      titulo: ['', Validators.required],
      subtitulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      nota: ['', Validators.required],
      rutaImagen: [''],
      liga: ['', Validators.required],
      idpuesto: [null, Validators.required] // Campo oculto que se llena con el ID del puesto
    });
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

  loadCourses() {
    this.courseService.getCourses().subscribe(
      (courses: Course[]) => {
        this.courses = courses;
      },
      (error) => {
        console.error('Error al cargar los cursos', error);
      }
    );
  }

  onSubmit() {
    if (this.courseForm.valid) {
      const formValue = this.courseForm.value;
      if (formValue.idCurso) {
        this.updateCourse(formValue);
      } else {
        this.createCourse(formValue);
      }
    }
  }

  createCourse(courseData: any) {
    this.courseService.createCourse(courseData).subscribe(
      (response) => {
        console.log('Curso creado con éxito', response);
        this.loadCourses(); // Recargar la lista de cursos
        this.courseForm.reset(); // Limpiar el formulario después de guardar
      },
      (error) => {
        console.error('Error al crear el curso', error);
      }
    );
  }
  
  updateCourse(courseData: any) {
    this.courseService.updateCourse(courseData).subscribe(
      (response) => {
        console.log('Curso actualizado con éxito', response);
        this.loadCourses(); // Recargar la lista de cursos
        this.courseForm.reset(); // Limpiar el formulario después de actualizar
      },
      (error) => {
        console.error('Error al actualizar el curso', error);
      }
    );
  }

  deleteCourse(idCurso: number) {
    this.courseService.deleteCourse(idCurso).subscribe(
      (response) => {
        console.log('Curso eliminado con éxito', response);
        this.loadCourses(); // Recargar la lista de cursos
      },
      (error) => {
        console.error('Error al eliminar el curso', error);
      }
    );
  }

  editCourse(course: Course) {
    // Detectar el tamaño de la pantalla
    const screenWidth = window.innerWidth;
  
    // Definir un tamaño del diálogo basado en el tamaño de la pantalla
    let dialogWidth = '500px'; // Valor por defecto
  
    if (screenWidth <= 300) {
      dialogWidth = '105px'; // Pantallas muy pequeñas (máximo 300px)
    } else if (screenWidth <= 400) {
      dialogWidth = '220px'; // Pantallas más pequeñas (máximo 400px)
    } else if (screenWidth <= 500) {
      dialogWidth = '280px'; // Pantallas muy pequeñas (máximo 500px)
    } else if (screenWidth <= 600) {
      dialogWidth = '350px'; // Pantallas muy pequeñas (máximo 600px)
    } else if (screenWidth <= 800) {
      dialogWidth = '400px'; // Pantallas pequeñas (máximo 800px)
    }
  
    // Abrir el diálogo con el tamaño dinámico y la posición ajustada al lado derecho
    const dialogRef = this.dialog.open(CourseEditDialogComponent, {
      width: dialogWidth,
      maxHeight: '90vh', // Limitar la altura al 90% del viewport
      position: { right: '10%' },
      data: course
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCourses(); // Recargar la lista de cursos si se actualizó correctamente
      }
    });
}

}