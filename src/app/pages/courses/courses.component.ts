import { Component, OnInit } from '@angular/core';
import { Course } from '../../components/interfaces/course.model';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.courses = [
      /* { id: 1, title: 'Curso 1', description: 'Descripción del curso 1', type: 'document', url: 'assets/documento1.pdf' }, */
      { id: 2, title: 'CURSO BÁSICO DE EXCEL', description: 'En este curso básico de Excel aprenderemos  paso a paso desde cero a Utilizar Excel 2020 para principiantes.', type: 'video', url: 'v_R5SaMTlug' } // Solo el ID del vídeo
    ];
  }
}