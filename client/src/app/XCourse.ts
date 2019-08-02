import { enums } from './enums';

export namespace XCourse { 
	/* XCourse -  Курс */ 

 export interface   XCourseDesc { // Описание курса
	XCourseDescId:string; // Primary key field
	CourseCode:string; // Код курса
	name:string; // Название
	Subject:string; //Предмет -> XSubject
	theLevel:string; //Уровень сложности -> XLevel
	Certification:string; //Сертификация -> XCert
	theInstructor:string; //Инструктор -> XInstructorInfo
	CourseDescription:string; // Описание
	StudentGuide:string; // Методические указания
	LabGuide:string; // Лабораторные работы
	Price:Number; // Цена
	 IsActive:enums.enum_YesNo; // Активный курс
	 IsActive_name :string; // enum to text for Активный курс
	theVendor:string; //Владелец -> XVendor
	// add dereference fields 
	Subject_name :string; // dereference for XSubject
	theLevel_name :string; // dereference for XLevel
	Certification_name :string; // dereference for XCert
	theInstructor_name :string; // dereference for XInstructorInfo
	theVendor_name :string; // dereference for XVendor
 }

 export interface   XCourseModule { // Модули курса
	XCourseModuleId:string; // Primary key field
	  XCourseDescId:string; // Описание курса
	ModuleNo:Number; // Номер по порядку
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

 export interface   XCoursePrice { // Цены
	XCoursePriceId:string; // Primary key field
	  XCourseDescId:string; // Описание курса
	PriceDate:string;  // Дата назначения цены
	Price:Number; // Цена
 }
}