import { INavbarData } from "./helper";



export const navbarData: INavbarData[] = [

      {
        icon: 'fal fa-user',
        Label: 'Mi Perfil',
        routeLink: 'profile',
        allowedRoles: [1, 2, 3, 4, 5],
      },  
      {
        icon: 'fal fa-clipboard-user',
        Label: 'Pasar Lista',
        routeLink: 'checkin',
        allowedRoles: [1, 2, 3, 4, 5],
      },
      {
        icon: 'fal fa-users',
        Label: 'Empleados',
        routeLink: 'people',
        allowedRoles: [1, 2, 3],
      },
      {
        icon: 'fal fa-graduation-cap',
        Label: 'Cursos',
        routeLink: 'courses',
        allowedRoles: [1, 2, 3, 4, 5],
      },
      {
        icon: 'fal fa-envelope',
        Label: 'Notificaciones',
        routeLink: 'news',
        allowedRoles: [1],
      },
      {
        icon: 'fal fa-newspaper',
        Label: 'Noticias Admin',
        routeLink: 'noticias',
        allowedRoles: [1, 2],
        items: [
          {
            routeLink: 'ticker',
            Label: 'Noticias Admin',
            icon: 'fal fa-comments',
            allowedRoles: [1, 2],
          },
          {
            routeLink: 'adminnews',
            Label: 'Notificaciones Admin',
            icon: 'fal fa-bell',
            allowedRoles: [1, 2],
          }
        ]
      },
      {
        icon: 'fal fa-calendar',
        Label: 'Dias Festivos',
        routeLink: 'holidays',
        allowedRoles: [1, 2, 3, 4, 5],
      },
      {
        icon: 'fal fa-chart-bar',
        Label: 'Reportes',
        routeLink: 'reports',
        allowedRoles: [1, 2, 5],
        items: [
          {
            routeLink: 'unusualities',
            Label: 'Inusualidades',
            icon: 'fal fa-exclamation',
            allowedRoles: [1, 2, 5],
          },
          {
            routeLink: 'attendance',
            Label: 'Asistencias',
            icon: 'fal fa-check-square',
            allowedRoles: [1, 2, 5],
          }
        ]
      },
      {
        icon: 'fal fa-cog',
        Label: 'Configuración',
        routeLink: 'settings',
        allowedRoles: [1, 2, 3, 4, 5],
        items: [
          {
            routeLink: 'passwordreset',
            Label: 'Cambiar contraseña',
            icon: 'fal fa-key',
            allowedRoles: [1, 2, 3, 4, 5],
          },
          {
            routeLink: 'logout',
            Label: 'Salir',
            icon: 'fal fa-sign-out',
            allowedRoles: [1, 2, 3, 4, 5],
          }
        ]
      },
];


