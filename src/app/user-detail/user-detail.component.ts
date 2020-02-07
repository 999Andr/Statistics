import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { ActivatedRoute } from '@angular/router';
import { UserStatistic } from '../user_statistic'; 

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})

export class UserDetailComponent implements OnInit {
  
  id: number = +this.route.snapshot.paramMap.get('id');
  userData: UserStatistic[];
  dates: string[] = []; 
  message: string = '';
  arr: any[] = [];
  user;
  oneClick: boolean = false;
  inVis: boolean = false;
  x: number;
 
  view: any[] = [this.x, 300];
  arrClicks: any[] = [];
  arrViews: any[] = [];
  multi: any[];

  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Value';
  timeline: boolean = true;
  legendPosition: string = 'below';
  

  colorScheme = {
    domain: ['#5AA454', '#E44D25']
  }; 
  
  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService
    ) { }
  
  ngOnInit() { 
    this.getUser();
    this.setDates();
    this.getUserData(); 
    this.getView();
    window.onresize = () => {
    this.getView();
    }; 
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }


  getView() {   
    this.x = 0.9 * document.documentElement.clientWidth;
    
    if (this.x > 1360) {
      this.x = 1360;
    };
    return this.view = [this.x, 300];
  }
   
  getUserData() {
    this.usersService.getUserData(this.id)
      .subscribe(userData => {
        this.userData = userData;  
        this.getArr();
      });
    }
  
  getUser() {
    this.user = this.usersService.getUser();
  }  

  setDates() {
    
    for (let i = 1; i < 32; i++) {
      i<10 ? this.dates.push(`2019-10-0${i}`) :
             this.dates.push(`2019-10-${i}`);
    } 
    return this.dates;
  }

  getArr() {
    
    for (let j = 0; j < 31; j++) { 
     
      if (j < this.userData.length) {
        this.arr[+this.userData[j].date.slice(8) - 1] = this.userData[j];
      }
      
      if (!this.arr[j]) {
        this.arr[j] = { 
          date: this.dates[j], clicks: 0, page_views: 0
        };
      }
    }
    
    this.usersService.setArr(this.arr);
    this.userData = this.arr.slice(24, 31);
    this.getMulti(this.userData);
    return this.userData;
  }

  getUserDataSort(startAt: string, endAt: string) {
    this.userData = []; 
    this.arrClicks = [];
    this.arrViews = []; 
    this.multi = [ 
    { "name": "clicks", "series": [] },
    { "name": "page views", "series": [] }
    ];
    this.oneClick = true;
    this.inVis = false;
    
    if (startAt === 'Select start-date') { 
      this.inVis = true;
      this.message ='Start-date required';
      return;
    }

    if ( (+startAt.slice(8)) > (+endAt.slice(8)) ) {
      this.inVis = true;
      this.message = 'Start is required no more than End-date'; 
      return;
    }
    
    this.message = ''; 
    this.usersService.getArr();
    
    if (endAt === 'Select end-date') {
      this.userData = this.arr.slice(+startAt.slice(8) - 1); 
      this.getMulti(this.userData);
      return this.userData;
    } else {
      this.userData = 
      this.arr.slice(+startAt.slice(8)-1, +endAt.slice(8));
      this.getMulti(this.userData);
      return this.userData;
    }
  }

  getMulti(arr: any[]): any[] { 
    
    for (let elem of arr) {
      this.arrClicks.push( { "name": elem.date, "value": elem.clicks } ); 
      this.arrViews.push({ "name": elem.date, "value": elem.page_views} );
    };
    
    return this.multi = [ 
      { "name": "clicks", "series": this.arrClicks },
      { "name": "page views", "series": this.arrViews }
    ];
  }

}