import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import { MainComponent } from "../app/main/main.component";



@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [MainComponent,RouterModule, RouterOutlet]
})
export class AppComponent {
  title = 'SEP';
}
