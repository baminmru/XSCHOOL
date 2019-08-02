import { enums } from './enums';

export namespace XEDUPROG { 
	/* XEDUPROG -  Программы обучения */ 

 export interface   xeduprog_info { // Описание программы
	xeduprog_infoId:string; // Primary key field
	name:string; // Название
	theDescription:string; // Описание
 }

 export interface   eduprog_course { // Курсы в программе
	eduprog_courseId:string; // Primary key field
	  xeduprog_infoId:string; // Описание программы
	Course:string; //Курс -> XCourseDesc
	// add dereference fields 
	Course_name :string; // dereference for XCourseDesc
 }
}