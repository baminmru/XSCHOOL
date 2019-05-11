import { enums } from './enums';

export namespace XCourse { 
	/* XCourse -  Курс */ 

 export interface   XCourseDesc { // Описание курса
	XCourseDescId:string; // Primary key field
	name:string; // Название
	theLevel:string; //Уровень сложности -> XLevel
	theVendor:string; //Владелец -> XVendor
	CourseDescription:string; // Описание
	StudentGuide:string; // Регламент
	 IsActive:enums.enum_YesNo; // Активный курс
	 IsActive_name :string; // enum to text for Активный курс
	// add dereference fields 
	theLevel_name :string; // dereference for XLevel
	theVendor_name :string; // dereference for XVendor
 }

 export interface   XCourseModule { // Модули курса
	XCourseModuleId:string; // Primary key field
	  XCourseDescId:string; // Описание курса
	name:string; // Название
	info:string; // Описание
	reglament:string; // Регламент
 }

 export interface   XChepter { // Глава
	XChepterId:string; // Primary key field
	 XCourseModuleId :string // Parent part Id -> Модули курса
	name:string; // Название
	mainText:string; // Основной текст
 }
}