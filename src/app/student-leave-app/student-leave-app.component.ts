import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { ToastrService } from 'ngx-toastr';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";


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
  file:File;
  private basePath:string = '/uploads';
  uploads: AngularFireList<any>;
  Url:string;
  fileLength=0;
  progress;
  truthValue:boolean=false;
  studentDataByKey:any;
 
  constructor(private authservice:AuthService,private toastr: ToastrService ,private db:AngularFireDatabase) {
    this.applicationList = db.list('/leave-application');

    db.list(`/leave-application`).valueChanges().subscribe(list =>{  
      this.list=list;
     // console.log(this.list);
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
     });
  }

  ngOnInit() {
   // console.log(this.authservice.activeStudentKey);
  }

 private submitApplication(data){
    this.id = this.authservice.activeStudentKey;
    this.status = "Pending";
    this.authservice.getDataByKey().subscribe(res=>{
     this.studentDataByKey = res.json(); 
     //console.log(this.studentDataByKey)  
    });
    //console.log(data.value);
     if(this.fileLength==0){
      this.Url="null";
     // console.log(this.fileLength);
     // console.log(this.Url);
     } 
    this.authservice.submitApplication(data.value,this.id,this.status,this.Url,this.studentDataByKey.name,this.studentDataByKey.email);
    //console.log(this.Url);
    this.toastr.success("Application Successfully Submited!!!");
  }

  trigger(){
    var upload =document.getElementById("file");
    upload.click();
  }

  fileSelected(event:any){
    
    this.file = event.target.files[0];
    
      this.fileLength = event.target.files.length;

    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`${this.authservice.activeStudentKey}/${this.file.name}`).put(this.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
      //  console.log("uploading the file...");
        this.truthValue=true;
        this.progress = Math.floor((uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100);
      },
      (error)=>{
       // console.log(error);
      },
      () =>{
   //     this.Url = uploadTask.snapshot.downloadURL;
   //     console.log(uploadTask.snapshot.downloadURL);
        storageRef.child(`${this.authservice.activeStudentKey}/${this.file.name}`).getDownloadURL().then(url =>{
          this.Url = url;
       //   console.log(this.Url);
        }); 
      }
    );
  }

  
}
