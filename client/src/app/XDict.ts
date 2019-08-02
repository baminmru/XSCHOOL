import { enums } from './enums';

export namespace XDict { 
	/* XDict -  Справочник */ 

 export interface   XLevel { // Уровень сложности
	XLevelId:string; // Primary key field
	name:string; // Название
 }

 export interface   XSubject { // Тематика
	XSubjectId:string; // Primary key field
	name:string; // Название
 }

 export interface   XVendor { // Компания-производитель
	XVendorId:string; // Primary key field
	name:string; // Название
 }

 export interface   XStatus { // Статус инструктора
	XStatusId:string; // Primary key field
	name:string; // Название
 }

 export interface   XSubscriptionType { // Тип подписки
	XSubscriptionTypeId:string; // Primary key field
	name:string; // Название
	timerange:Number; // Длительность подписки
 }

 export interface   XCert { // Сертификаты
	XCertId:string; // Primary key field
	name:string; // Название
 }
}