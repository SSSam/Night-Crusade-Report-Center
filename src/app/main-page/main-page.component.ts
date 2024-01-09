import { Component } from '@angular/core';
import { Router, NavigationExtras} from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  title = 'night-crusade-app';
  constructor( private router: Router){  }

  openForm() {
    this.router.navigate(["/report"])
  }

}
