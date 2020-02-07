import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  arr: any[];
  user: any;
  
  constructor(
    private db: AngularFirestore,
    private location: Location
  ) { } 

  getUsers(n: number) { 
    return this.db.collection<any>(
      'users', 
      ref => ref.orderBy("id").startAt(n * 50 + 1).limit(50)
    )
      .valueChanges()
  }

  getStatistics(n: number) { 
    return this.db.collection<any>(
      'users_statistic', 
      ref => ref.where("user_id", "<", n * 50 + 51).orderBy("user_id")
        .startAt(n * 50 + 1)
    ) 
      .valueChanges()
}



  getUserData(id:number){
    return this.db.collection<any>(
      'users_statistic',
      ref => ref.where("user_id", "==", id).orderBy("date")
    )
      .valueChanges()
  } 
  
  setUser(user) {
      this.user = user;
  } 
  
  getUser() {
     return this.user;
  } 

  setArr(arg: any[]) {
     this.arr = arg;
  }

  getArr(){
    return this.arr;
  }
  
  goUsersList(): void {
    this.location.back();
 }


}
