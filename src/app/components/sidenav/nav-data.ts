import { INavbarData } from "./helper";


export const navbarData: INavbarData[] = [
      {
    icon: 'fal fa-user',
    Label: 'Mi Perfil',
    routeLink: 'profile',
      },
      {
        icon: 'fal fa-users',
        Label: 'Empleados',
        routeLink: 'people',
      },
      {
        icon: 'fal fa-tasks',
        Label: 'Cursos y Noticias',
        routeLink: 'courses',
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
        icon: 'fal fa-clipboard-user',
        Label: 'Pasar Lista',
        routeLink: 'checkin',
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
            routeLink: 'signout',
            Label: 'Salir',
            icon: 'fal fa-sign-out',
          }
        ]
      },
];