import { animate, style, transition, trigger } from "@angular/animations";

export interface INavbarData {
    allowedRoles: number[];
    routeLink: string;
    icon?: string;
    Label: string;
    expanded?: boolean;
    items?: INavbarData[];
}

export const fadeInOut = trigger('fadeInOut', [
    transition(':enter', [
      style({opacity: 0}),
      animate('350ms', 
        style({opacity: 1})
      )
    ]),
    transition(':leave', [
      style({opacity: 1}),
      animate('350ms', 
        style({opacity: 0})
      )
    ])
  ])