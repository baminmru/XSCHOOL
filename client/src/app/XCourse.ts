import { enums } from './enums';

export namespace XCourse { 
	/* XCourse -  Курс */ 

 export interface   xCourseDesc { // Описание курса
	xCourseDescId:string; // Primary key field
	courseCode:string; // Код курса
	name:string; // Название
	subject:string; //Предмет -> XSubject
	imageUrl:string; // Картинка
	theLevel:string; //Уровень сложности -> XLevel
	certification:string; //Сертификация -> XCert
	theInstructor:string; //Инструктор -> XInstructorInfo
	courseDescription:string; // Описание
	studentGuide:string; // Методические указания
	labGuide:string; // Лабораторные работы
	price:Number; // Цена
	 isActive:enums.enum_YesNo; // Активный курс
	 isActive_name :string; // enum to text for Активный курс
	 isOffline:enums.enum_YesNo; // Оффлайн курс
	 isOffline_name :string; // enum to text for Оффлайн курс
	 isOnline:enums.enum_YesNo; // Онлайн курс
	 isOnline_name :string; // enum to text for Онлайн курс
	// add dereference fields 
	subject_name :string; // dereference for XSubject
	theLevel_name :string; // dereference for XLevel
	certification_name :string; // dereference for XCert
	theInstructor_name :string; // dereference for XInstructorInfo
 }

 export interface   xCourseModule { // Модули курса
	xCourseModuleId:string; // Primary key field
	  xCourseDescId:string; // Описание курса
	moduleNo:Number; // Номер по порядку
	name:string; // Название
	info:string; // Описание
	reglament:string; // Регламент
 }

 export interface   xChepter { // Глава
	xChepterId:string; // Primary key field
	 xCourseModuleId :string // Parent part Id -> Модули курса
	sequence:Number; // Порядок прохождения
	name:string; // Название
	mainText:string; // Основной текст
	refFile:string; // Файл
 }

 export interface   xCoursePrice { // Цены
	xCoursePriceId:string; // Primary key field
	  xCourseDescId:string; // Описание курса
	priceDate:string;  // Дата назначения цены
	price:Number; // Цена
 }
}