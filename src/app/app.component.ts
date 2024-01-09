import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'night-crusade-app';
  constructor( private router: Router){

  }
  openForm() {
    this.router.navigate(["/report"])
  }
}
