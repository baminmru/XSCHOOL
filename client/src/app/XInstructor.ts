import { enums } from './enums';

export namespace XInstructor { 
	/* XInstructor -  Инструктор */ 

 export interface   xInstructorInfo { // Описание
	xInstructorInfoId:string; // Primary key field
	family:string; // Фамилия
	name:string; // Имя
	middleName:string; // Отчество
	eMail:string; // e-mail
	phone:string; // Телефон
	photoUrl:string; // Фотография
	localPhone:string; // Местный телефон
 }

 export interface   xInstructorStatus { // Статусы
	xInstructorStatusId:string; // Primary key field
	  xInstructorInfoId:string; // Описание
	theStatus:string; //Статус -> XStatus
	sequence:Number; // Порядок
	// add dereference fields 
	theStatus_name :string; // dereference for XStatus
 }
}