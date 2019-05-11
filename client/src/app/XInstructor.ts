import { enums } from './enums';

export namespace XInstructor { 
	/* XInstructor -  Инструктор */ 

 export interface   XInstructorInfo { // Описание
	XInstructorInfoId:string; // Primary key field
	Family:string; // Фамилия
	Name:string; // Имя
	SurName:string; // Отчество
	EMail:string; // e-mail
	Phone:string; // Телефон
	LocalPhone:string; // Местный телефон
 }

 export interface   XInstructorStatus { // Статусы
	XInstructorStatusId:string; // Primary key field
	  XInstructorInfoId:string; // Описание
	theStatus:string; //Статус -> XStatus
	// add dereference fields 
	theStatus_name :string; // dereference for XStatus
 }
}