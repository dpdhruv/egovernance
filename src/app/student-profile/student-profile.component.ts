import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Member } from '../member';
import { AngularFireList } from 'angularfire2/database';
import { AngularFireDatabase } from 'angularfire2/database';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {
memberList: AngularFireList<any>;
members:any;
counsellorName:any[];
flag:boolean=true;
activeStudent;
activeStudentCounsellor;
  constructor(private authservice:AuthService,private db:AngularFireDatabase,private toastr : ToastrService) {
      this.authservice.getCounsellor();
      this.counsellorName = this.authservice.counsellor;
   }
 

  
  ngOnInit() {
  console.log(this.authservice.activeStudentKey);
  this.authservice.getDataByKey().subscribe(res =>{
     this.activeStudent = res.json();
     this.activeStudentCounsellor = res.json().counsellor;
   //  console.log(this.activeStudentCounsellor);
     if(this.activeStudentCounsellor =="null"){
       this.flag = false;
     //  console.log(this.flag);
     }
   });
   
    }
  updateCounsellor(form){
    //this.flag = true;
    this.authservice.insertCounsellor(form.value);
    this.toastr.success("Counsellor name updated");
    //this.activeStudent = this.form.value;
  }
}
