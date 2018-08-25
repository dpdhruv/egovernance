import { NgModule  } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { StudentsComponent } from './students/students.component';
import { AdminComponent } from "./admin/admin.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { LogInComponent } from './log-in/log-in.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from "./guards/admin.guard";
import { StudentLeaveAppComponent } from './student-leave-app/student-leave-app.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';

const routes: Routes = [
    { path: 'students/:uname' ,
      canActivate:[AuthGuard],
      component: StudentsComponent, 
      children: [
        {path:'leave-application',component:StudentLeaveAppComponent},
        {path:'profile',component:StudentProfileComponent}
      ]  
    },
    { path:'admin/:uname',canActivate:[AdminGuard], component: AdminComponent},
    { path:'',component:SignUpComponent},
    { path:'login', component:LogInComponent}
];

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
export const routingComponents = [StudentsComponent, AdminComponent]