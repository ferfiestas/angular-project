import { INavbarData } from "./helper";



export const navbarData: INavbarData[] = [

      {
        icon: 'fal fa-user',
        Label: 'Mi Perfil',
        routeLink: 'profile',
      },  
      {
        icon: 'fal fa-clipboard-user',
        Label: 'Pasar Lista',
        routeLink: 'checkin',
      },
      {
        icon: 'fal fa-users',
        Label: 'Empleados',
        routeLink: 'people',
      },
      {
        icon: 'fal fa-graduation-cap',
        Label: 'Cursos',
        routeLink: 'courses',
      },
      {
        icon: 'fal fa-envelope',
        Label: 'Notificaciones',
        routeLink: 'news',
      },
      {
        icon: 'fal fa-newspaper',
        Label: 'Noticias Admin',
        routeLink: 'noticias',
        items: [
          {
            routeLink: 'ticker',
            Label: 'Noticias Admin',
            icon: 'fal fa-comments',
          },
          {
            routeLink: 'adminnews',
            Label: 'Notificaciones Admin',
            icon: 'fal fa-bell',
          }
        ]
      },
      {
        icon: 'fal fa-calendar',
        Label: 'Dias Festivos',
        routeLink: 'holidays',
      },
      {
        icon: 'fal fa-chart-bar',
        Label: 'Reportes',
        routeLink: 'reports',
        items: [
          {
            routeLink: 'unusualities',
            Label: 'Inusualidades',
            icon: 'fal fa-exclamation',
          },
          {
            routeLink: 'attendance',
            Label: 'Asistencias',
            icon: 'fal fa-check-square',
          }
        ]
      },
      {
        icon: 'fal fa-cog',
        Label: 'Configuración',
        routeLink: 'settings',
        items: [
          {
            routeLink: 'passwordreset',
            Label: 'Cambiar contraseña',
            icon: 'fal fa-key',
          },
          {
            routeLink: 'logout',
            Label: 'Salir',
            icon: 'fal fa-sign-out',
          }
        ]
      },
];


