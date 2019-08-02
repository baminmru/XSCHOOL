import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module'; 
import { Routes, RouterModule } from '@angular/router'; 
 
import { AboutComponent } from './about/about.component'; 
import { XInstructorComponent } from './XInstructor/XInstructor.component'; 
import { XCourseComponent } from './XCourse/XCourse.component'; 
import { XUserComponent } from './XUser/XUser.component'; 
import { XEDUPROGComponent } from './XEDUPROG/XEDUPROG.component'; 
import { XScheduleComponent } from './XSchedule/XSchedule.component'; 
import { XDictComponent } from './XDict/XDict.component'; 
export const ROUTES: Routes = [ 
    {path: '', redirectTo: 'home', pathMatch: 'full'}, 
	 
	{path: 'XInstructor', component:  XInstructorComponent}, 
	{path: 'XCourse', component:  XCourseComponent}, 
	{path: 'XUser', component:  XUserComponent}, 
	{path: 'XEDUPROG', component:  XEDUPROGComponent}, 
	{path: 'XSchedule', component:  XScheduleComponent}, 
	{path: 'XDict', component:  XDictComponent}, 
	{path: 'home', component: AboutComponent} 
]; 
 
export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES);
