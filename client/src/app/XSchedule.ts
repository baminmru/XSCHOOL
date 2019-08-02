import { enums } from './enums';

export namespace XSchedule { 
	/* XSchedule -  Расписание курсов */ 

 export interface   XScheduleItem { // Расписание
	XScheduleItemId:string; // Primary key field
	theCourse:string; //Курс -> XCourseDesc
	theInstructor:string; //Инструктор -> XInstructorInfo
	FromDate:string; // С
	ToDate:string; // По
	// add dereference fields 
	theCourse_name :string; // dereference for XCourseDesc
	theInstructor_name :string; // dereference for XInstructorInfo
 }

 export interface   XScheduleSubst { // Замещения
	XScheduleSubstId:string; // Primary key field
	  XScheduleItemId:string; // Расписание
	theInstructor:string; //Инструктор -> XInstructorInfo
	FromDate:string; // С
	ToDate:string; // По
	// add dereference fields 
	theInstructor_name :string; // dereference for XInstructorInfo
 }
}