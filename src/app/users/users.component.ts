import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs'; 
import { UsersService } from '../users.service';
import { UserNew } from '../user_new';
import { UserStatistic } from '../user_statistic'; 
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {

  users: any[];  
  statistics: any[]; 
  n: number = 0;
  sT: any[]; 
  user: UserNew;
  pages: number[] = [];

  constructor(private usersService: UsersService ) { }
  
  ngOnInit() { 
    this.getUsers(this.n);
    this.getStatistics(this.n);
    this.setPages(); 
  }

  getUsers(n:number) { 
    this.usersService.getUsers(n)
      .subscribe(users => this.users = users);
  }

  getStatistics(n:number) { 
    this.usersService.getStatistics(n)
      .subscribe(statistics => {
        this.statistics = statistics;
        this.getNewUsers();
      });
  }
  
  sumSt (arr: any[], sum: number): number { 
    
    for (let i in arr) {
      sum += arr[i];
    }
    return sum;
  }

  setNewUser(user:UserNew) { 
    this.sT = this.statistics;
    this.sT = this.sT.filter(st => st.user_id === user.id); 
    user.statistic = this.sT; 
    
    user.total_clicks = this.sT[0] ?
    this.sumSt(this.sT.map(st => st.clicks), 0) : 0;
    
    user.total_page_views = this.sT[0] ?
    this.sumSt(this.sT.map(st => st.page_views) ,0) : 0;
  }
   
  getNewUsers() { 
    this.users.forEach((user: UserNew) => this.setNewUser(user)); 
  }

  getNextPage() {
    this.n++; 
    
    if (this.n < 20) {   
      this.getUsers(this.n);
      this.getStatistics(this.n);
    } else {
      this.n=19;
      return;
    }
  }

  getPreviousPage() {
    this.n--; 
    
    if (this.n >= 0) {
      this.getUsers(this.n);
      this.getStatistics(this.n);
    } else {
      this.n=0; 
      return;
    }
  }

  getPageByNumber(arg: string) {
    
    if (arg === '№ of 20') {
      return;
    }
    
    this.n = +arg - 1;
    this.getUsers(this.n);
    this.getStatistics(this.n);
  }

  setPages() {
    
    for (let i = 0; i < 20; i++) {
      this.pages.push(i + 1);
    } 
    return this.pages;
  }

  setUser(user) { 
    this.usersService.setUser(user);
  }

}