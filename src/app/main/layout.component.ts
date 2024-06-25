import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-layout',
    standalone: true,
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css',
    imports: [CommonModule, RouterModule, RouterOutlet]
})
export class LayoutComponent {

    @Input() collapsed = false;
    @Input() screenWidth = 0;

    getBodyClass(): string {
        let styleClass = '';
        if(this.collapsed && this.screenWidth > 768) {
            styleClass = 'body-trimmed';
        } else if(this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
            styleClass = 'body-md-screen'
        }
        return styleClass;
    }

}
