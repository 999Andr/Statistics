import { Component } from '@angular/core';
import { UsersService } from './users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
 
  constructor(private usersService: UsersService) { }

  goUsersList(): void {
  	this.usersService.goUsersList();
  }
}