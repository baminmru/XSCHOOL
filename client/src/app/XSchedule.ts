import { enums } from './enums';

export namespace XSchedule { 
	/* XSchedule -  Расписание курсов */ 

 export interface   xScheduleItem { // Расписание
	xScheduleItemId:string; // Primary key field
	theCourse:string; //Курс -> XCourseDesc
	theInstructor:string; //Инструктор -> XInstructorInfo
	fromDate:string; // С
	toDate:string; // По
	// add dereference fields 
	theCourse_name :string; // dereference for XCourseDesc
	theInstructor_name :string; // dereference for XInstructorInfo
 }

 export interface   xScheduleSubst { // Замещения
	xScheduleSubstId:string; // Primary key field
	  xScheduleItemId:string; // Расписание
	theInstructor:string; //Инструктор -> XInstructorInfo
	fromDate:string; // С
	toDate:string; // По
	// add dereference fields 
	theInstructor_name :string; // dereference for XInstructorInfo
 }
}