import { enums } from './enums';

export namespace XDict { 
	/* XDict -  Справочник */ 

 export interface   XLevel { // Уровень сложности
	XLevelId:string; // Primary key field
	name:string; // Название
 }

 export interface   XSubject { // Предмет
	XSubjectId:string; // Primary key field
	name:string; // Название
 }

 export interface   XVendor { // Владелец
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
 }
}