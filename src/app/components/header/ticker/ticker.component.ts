import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css']
})
export class TickerComponent implements OnInit {
  tickerWidth: string = '300%';  // Ajusta el ancho del ticker según tus necesidades
  messages: string[] = [
    'Ejemplo de mensaje 1',
    'Ejemplo de mensaje 2',
    'Ejemplo de mensaje 3'
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
