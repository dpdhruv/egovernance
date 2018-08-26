import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-student-leave-app',
  templateUrl: './student-leave-app.component.html',
  styleUrls: ['./student-leave-app.component.css']
})
export class StudentLeaveAppComponent implements OnInit {

  id:string;
  status:string;
  applicationList:AngularFireList<any>;
  list:any[];
  newList:any[];
  lengthCheck;
  isListEmpty:boolean;
  public loading = false;

  constructor(private authservice:AuthService, private db:AngularFireDatabase) {
    this.applicationList = db.list('/leave-application');
    this.loading = true;
    db.list(`/leave-application`).valueChanges().subscribe(list =>{  
      this.list=list;
      console.log(this.list);
      this.newList = [];
      for(let i=0;i<this.list.length;i++){
        if(this.authservice.activeStudentKey == this.list[i].id){
          this.newList.push(this.list[i]);
        }
      }
      this.lengthCheck = this.newList.length;
      if(this.lengthCheck > 0){
        this.isListEmpty = false;
      }
      else{
        this.isListEmpty = true;
      }
      this.loading = false;
     });
   }

  ngOnInit() {
    console.log(this.authservice.activeStudentKey);
  }

  submitApplication(data){
    this.id = this.authservice.activeStudentKey;
    this.status = "Pending";
    //console.log(data.value);
    this.authservice.submitApplication(data.value,this.id,this.status);
  }
}
