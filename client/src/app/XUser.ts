import { enums } from './enums';

export namespace XUser { 
	/* XUser -  Пользователь */ 

 export interface   XUserInfo { // Описание
	XUserInfoId:string; // Primary key field
	Family:string; // Фамилия
	Login:string; // Имя для входа
	SurName:string; // Отчество
	EMail:string; // e-mail
	Phone:string; // Телефон
	Name:string; // Имя
	Password:string; // Пароль
 }

 export interface   XSubscription { // Подписки
	XSubscriptionId:string; // Primary key field
	  XUserInfoId:string; // Описание
	SubscriptionType:string; //Тип подписки -> XSubscriptionType
	FromDate:string; // С
	ToDate:string; // По
	// add dereference fields 
	SubscriptionType_name :string; // dereference for XSubscriptionType
 }

 export interface   XUserPurchase { // Покупки пользователя
	XUserPurchaseId:string; // Primary key field
	  XUserInfoId:string; // Описание
	theCourse:string; //Курс -> XCourseDesc
	// add dereference fields 
	theCourse_name :string; // dereference for XCourseDesc
 }

 export interface   XUserProfile { // Результаты обучения
	XUserProfileId:string; // Primary key field
	  XUserInfoId:string; // Описание
	theCourse:string; //Курс -> XCourseDesc
	// add dereference fields 
	theCourse_name :string; // dereference for XCourseDesc
 }

 export interface   XUserRegistartion { // Запись на  курс
	XUserRegistartionId:string; // Primary key field
	  XUserInfoId:string; // Описание
	theCourseSchedule:string; //Запись на  курс -> XScheduleItem
	// add dereference fields 
	theCourseSchedule_name :string; // dereference for XScheduleItem
 }

 export interface   XUserCart { // Корзина
	XUserCartId:string; // Primary key field
	  XUserInfoId:string; // Описание
	theCourse:string; //Курс -> XCourseDesc
	SubscriptionType:string; //Тип подписки -> XSubscriptionType
	FromDate:string; // С
	ToDate:string; // По
	// add dereference fields 
	theCourse_name :string; // dereference for XCourseDesc
	SubscriptionType_name :string; // dereference for XSubscriptionType
 }
}