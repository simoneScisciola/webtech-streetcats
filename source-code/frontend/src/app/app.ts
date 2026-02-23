import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';

import { Header } from '#features/header/header';

@Component({
  selector: 'app-root',
  imports: [Header, NgxSonnerToaster, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

}
