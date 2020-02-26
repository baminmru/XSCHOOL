import { enums } from './enums';

export namespace XUser { 
	/* XUser -  Пользователь */ 

 export interface   xUserInfo { // Описание
	xUserInfoId:string; // Primary key field
	family:string; // Фамилия
	name:string; // Имя
	middleName:string; // Отчество
	login:string; // Имя для входа
	password:string; // Пароль
	photoUrl:string; // Фотография
	eMail:string; // e-mail
	phone:string; // Телефон
	birthday:string; // Дата рождения
	country:string; // Страна
	city:string; // Город
	nativeLanguage:string; // Родной язык
	userSkill:string; //Уровень владения русским -> XUserSkillLevel
	learningYears:Number; // Количество лет изучения русского
	learningGoal:string; // Цель обучения
	 pIaccept:enums.enum_YesNo; // Принята политика ПД
	 pIaccept_name :string; // enum to text for Принята политика ПД
	 hRaccept:enums.enum_YesNo; // Принята политика HR
	 hRaccept_name :string; // enum to text for Принята политика HR
	// add dereference fields 
	userSkill_name :string; // dereference for XUserSkillLevel
 }

 export interface   xSubscription { // Подписки
	xSubscriptionId:string; // Primary key field
	  xUserInfoId:string; // Описание
	subscriptionType:string; //Тип подписки -> XSubscriptionType
	fromDate:string; // С
	toDate:string; // По
	// add dereference fields 
	subscriptionType_name :string; // dereference for XSubscriptionType
 }

 export interface   xUserPurchase { // Покупки пользователя
	xUserPurchaseId:string; // Primary key field
	  xUserInfoId:string; // Описание
	theCourse:string; //Курс -> XCourseDesc
	// add dereference fields 
	theCourse_name :string; // dereference for XCourseDesc
 }

 export interface   xUserProfile { // Результаты обучения
	xUserProfileId:string; // Primary key field
	  xUserInfoId:string; // Описание
	theCourse:string; //Курс -> XCourseDesc
	complModule:string; //Завершенный модуль -> XCourseModule
	// add dereference fields 
	theCourse_name :string; // dereference for XCourseDesc
	complModule_name :string; // dereference for XCourseModule
 }

 export interface   xUserRegistartion { // Запись на  курс
	xUserRegistartionId:string; // Primary key field
	  xUserInfoId:string; // Описание
	theCourseSchedule:string; //Запись на  курс -> XScheduleItem
	// add dereference fields 
	theCourseSchedule_name :string; // dereference for XScheduleItem
 }

 export interface   xUserCart { // Корзина
	xUserCartId:string; // Primary key field
	  xUserInfoId:string; // Описание
	theCourse:string; //Курс -> XCourseDesc
	subscriptionType:string; //Тип подписки -> XSubscriptionType
	// add dereference fields 
	theCourse_name :string; // dereference for XCourseDesc
	subscriptionType_name :string; // dereference for XSubscriptionType
 }
}