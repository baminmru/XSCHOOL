import { enums } from './enums';

export namespace XDict { 
	/* XDict -  Справочник */ 

 export interface   xLevel { // Уровень сложности
	xLevelId:string; // Primary key field
	name:string; // Название
 }

 export interface   xSubject { // Тематика
	xSubjectId:string; // Primary key field
	name:string; // Название
 }

 export interface   xStatus { // Статус инструктора
	xStatusId:string; // Primary key field
	name:string; // Название
 }

 export interface   xSubscriptionType { // Тип подписки
	xSubscriptionTypeId:string; // Primary key field
	name:string; // Название
	timerange:Number; // Длительность подписки
 }

 export interface   xCert { // Сертификаты
	xCertId:string; // Primary key field
	name:string; // Название
 }

 export interface   xUserSkillLevel { // Уровень владения языком
	xUserSkillLevelId:string; // Primary key field
	name:string; // Название
 }
}