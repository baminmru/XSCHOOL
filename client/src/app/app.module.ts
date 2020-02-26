import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { BrowserModule } from '@angular/platform-browser'; 
import { NgModule } from '@angular/core'; 
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule, HttpClient } from '@angular/common/http'; 
import { AmexioWidgetModule, CommonDataService, AmexioChartsModule,  AmexioDashBoardModule } from 'amexio-ng-extensions';
import { AmexioChartD3Module } from 'amexio-chart-d3';
import { FileUploadModule } from 'ng2-file-upload';

import {CookieService} from 'ngx-cookie-service'; 
import { NgxWigModule} from 'ngx-wig';
import { CommonModule } from "@angular/common";
import {AppService} from 'app/app.service'; 


import { RemoveHTMLtagPipe} from 'app/pipes';
 
import {jwtLoginComponent} from 'app/jwtlogin/jwtlogin.component'; 

import { AppGuard} from 'app/app.guard'; 
import { AppComponent } from './app.component'; 
import { ROUTING } from './app.routing'; 
import { AboutComponent } from './about/about.component'; 
import { TopnavComponent } from './topnav/topnav.component'; 

 
import { XInstructorComponent } from './XInstructor/XInstructor.component'; // Инструктор
import { xInstructorInfoComponent } from './XInstructorInfo/XInstructorInfo.component'; // Описание
import { xInstructorInfo_Service } from 'app/XInstructorInfo.service'; 
import { xInstructorStatusComponent } from './XInstructorStatus/XInstructorStatus.component'; // Статусы
import { xInstructorStatus_Service } from 'app/XInstructorStatus.service'; 
 
import { XCourseComponent } from './XCourse/XCourse.component'; // Курс
import { xCourseDescComponent } from './XCourseDesc/XCourseDesc.component'; // Описание курса
import { xCourseDesc_Service } from 'app/XCourseDesc.service'; 
import { xCourseModuleComponent } from './XCourseModule/XCourseModule.component'; // Модули курса
import { xCourseModule_Service } from 'app/XCourseModule.service'; 
import { xChepterComponent } from './XChepter/XChepter.component'; // Глава
import { xChepter_Service } from 'app/XChepter.service'; 
import { xCoursePriceComponent } from './XCoursePrice/XCoursePrice.component'; // Цены
import { xCoursePrice_Service } from 'app/XCoursePrice.service'; 
 
import { XUserComponent } from './XUser/XUser.component'; // Пользователь
import { xUserInfoComponent } from './XUserInfo/XUserInfo.component'; // Описание
import { xUserInfo_Service } from 'app/XUserInfo.service'; 
import { xSubscriptionComponent } from './XSubscription/XSubscription.component'; // Подписки
import { xSubscription_Service } from 'app/XSubscription.service'; 
import { xUserPurchaseComponent } from './XUserPurchase/XUserPurchase.component'; // Покупки пользователя
import { xUserPurchase_Service } from 'app/XUserPurchase.service'; 
import { xUserProfileComponent } from './XUserProfile/XUserProfile.component'; // Результаты обучения
import { xUserProfile_Service } from 'app/XUserProfile.service'; 
import { xUserRegistartionComponent } from './XUserRegistartion/XUserRegistartion.component'; // Запись на  курс
import { xUserRegistartion_Service } from 'app/XUserRegistartion.service'; 
import { xUserCartComponent } from './XUserCart/XUserCart.component'; // Корзина
import { xUserCart_Service } from 'app/XUserCart.service'; 
 
import { XScheduleComponent } from './XSchedule/XSchedule.component'; // Расписание курсов
import { xScheduleItemComponent } from './XScheduleItem/XScheduleItem.component'; // Расписание
import { xScheduleItem_Service } from 'app/XScheduleItem.service'; 
import { xScheduleSubstComponent } from './XScheduleSubst/XScheduleSubst.component'; // Замещения
import { xScheduleSubst_Service } from 'app/XScheduleSubst.service'; 
 
import { XDictComponent } from './XDict/XDict.component'; // Справочник
import { xLevelComponent } from './XLevel/XLevel.component'; // Уровень сложности
import { xLevel_Service } from 'app/XLevel.service'; 
import { xSubjectComponent } from './XSubject/XSubject.component'; // Тематика
import { xSubject_Service } from 'app/XSubject.service'; 
import { xStatusComponent } from './XStatus/XStatus.component'; // Статус инструктора
import { xStatus_Service } from 'app/XStatus.service'; 
import { xSubscriptionTypeComponent } from './XSubscriptionType/XSubscriptionType.component'; // Тип подписки
import { xSubscriptionType_Service } from 'app/XSubscriptionType.service'; 
import { xCertComponent } from './XCert/XCert.component'; // Сертификаты
import { xCert_Service } from 'app/XCert.service'; 
import { xUserSkillLevelComponent } from './XUserSkillLevel/XUserSkillLevel.component'; // Уровень владения языком
import { xUserSkillLevel_Service } from 'app/XUserSkillLevel.service'; 

@NgModule({ 
    declarations: [ 
        AppComponent, 
jwtLoginComponent,



 RemoveHTMLtagPipe,
XInstructorComponent ,  // Инструктор
  xInstructorInfoComponent, // Описание
  xInstructorStatusComponent, // Статусы
 
 XCourseComponent ,  // Курс
  xCourseDescComponent, // Описание курса
  xCourseModuleComponent, // Модули курса
  xChepterComponent, // Глава
  xCoursePriceComponent, // Цены
 
 XUserComponent ,  // Пользователь
  xUserInfoComponent, // Описание
  xSubscriptionComponent, // Подписки
  xUserPurchaseComponent, // Покупки пользователя
  xUserProfileComponent, // Результаты обучения
  xUserRegistartionComponent, // Запись на  курс
  xUserCartComponent, // Корзина
 
 XScheduleComponent ,  // Расписание курсов
  xScheduleItemComponent, // Расписание
  xScheduleSubstComponent, // Замещения
 
 XDictComponent ,  // Справочник
  xLevelComponent, // Уровень сложности
  xSubjectComponent, // Тематика
  xStatusComponent, // Статус инструктора
  xSubscriptionTypeComponent, // Тип подписки
  xCertComponent, // Сертификаты
  xUserSkillLevelComponent, // Уровень владения языком
		 
		 
        AboutComponent, 
        TopnavComponent 
		 
    ], 
    imports: [ 
        BrowserAnimationsModule, 
        BrowserModule, 
        FormsModule, 
        HttpClientModule, 
		
		// AMEXIO 
        AmexioWidgetModule, 
		AmexioChartsModule,  
		AmexioDashBoardModule, 
        AmexioChartD3Module,
        FileUploadModule,
		
        NgxWigModule,
	    CommonModule,
        ROUTING 
    ], 
    providers: [HttpClient 
  ,xInstructorInfo_Service
  ,xInstructorStatus_Service
  ,xCourseDesc_Service
  ,xCourseModule_Service
  ,xChepter_Service
  ,xCoursePrice_Service
  ,xUserInfo_Service
  ,xSubscription_Service
  ,xUserPurchase_Service
  ,xUserProfile_Service
  ,xUserRegistartion_Service
  ,xUserCart_Service
  ,xScheduleItem_Service
  ,xScheduleSubst_Service
  ,xLevel_Service
  ,xSubject_Service
  ,xStatus_Service
  ,xSubscriptionType_Service
  ,xCert_Service
  ,xUserSkillLevel_Service
	,AppService 
	  ,AppGuard
	,CookieService 
	], 
    bootstrap: [AppComponent] 
}) 
export class AppModule { 
} 
