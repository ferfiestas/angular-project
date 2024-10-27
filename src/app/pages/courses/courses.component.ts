import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../components/interfaces/course.model';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];

  constructor(private courseService: CourseService) { }

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    const userRole = localStorage.getItem('userRole');
    const idPuesto = localStorage.getItem('idPuesto');

    this.courseService.getCourses().subscribe(
      (courses: Course[]) => {
        if (userRole === '1') {
          // Si userRole es 1, mostrar todos los videos
          this.filteredCourses = courses;
        } else {
          // Obtener el nombre del puesto basado en el idPuesto
          this.courseService.getPuesto(Number(idPuesto)).subscribe(
            (puestoData: any) => {
              const puestoNombre = puestoData.nombre;

              // Filtrar los cursos que coincidan con el puesto
              this.filteredCourses = courses.filter(course => course.puesto === puestoNombre);
            },
            (error) => console.error('Error al obtener el puesto', error)
          );
        }
      },
      (error) => console.error('Error al cargar los cursos', error)
    );
  }
}