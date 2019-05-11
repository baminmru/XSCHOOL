import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { BrowserModule } from '@angular/platform-browser'; 
import { NgModule } from '@angular/core'; 
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule, HttpClient } from '@angular/common/http'; 
import { AmexioWidgetModule, CommonDataService, AmexioChartsModule,  AmexioDashBoardModule } from 'amexio-ng-extensions';
import { AmexioChartD3Module } from 'amexio-chart-d3';


import {CookieService} from 'ngx-cookie-service'; 
import { NgxWigModule} from 'ngx-wig';
import { CommonModule } from "@angular/common";
import {AppService} from 'app/app.service'; 

import { RemoveHTMLtagPipe} from 'app/pipes';
 
import { AppGuard} from 'app/app.guard'; 
import { AppComponent } from './app.component'; 
import { ROUTING } from './app.routing'; 
import { AboutComponent } from './about/about.component'; 
import { TopnavComponent } from './topnav/topnav.component'; 

import { XInstructorComponent } from './XInstructor/XInstructor.component'; // Инструктор
import { XInstructorInfoComponent } from './XInstructorInfo/XInstructorInfo.component'; // Описание
import { XInstructorInfo_Service } from 'app/XInstructorInfo.service'; 
import { XInstructorStatusComponent } from './XInstructorStatus/XInstructorStatus.component'; // Статусы
import { XInstructorStatus_Service } from 'app/XInstructorStatus.service'; 
 
import { XCourseComponent } from './XCourse/XCourse.component'; // Курс
import { XCourseDescComponent } from './XCourseDesc/XCourseDesc.component'; // Описание курса
import { XCourseDesc_Service } from 'app/XCourseDesc.service'; 
import { XCourseModuleComponent } from './XCourseModule/XCourseModule.component'; // Модули курса
import { XCourseModule_Service } from 'app/XCourseModule.service'; 
import { XChepterComponent } from './XChepter/XChepter.component'; // Глава
import { XChepter_Service } from 'app/XChepter.service'; 
 
import { XUserComponent } from './XUser/XUser.component'; // Пользователь
import { XSubscriptionComponent } from './XSubscription/XSubscription.component'; // Подписки
import { XSubscription_Service } from 'app/XSubscription.service'; 
import { XUserInfoComponent } from './XUserInfo/XUserInfo.component'; // Пользователи
import { XUserInfo_Service } from 'app/XUserInfo.service'; 
import { XUserPurchaseComponent } from './XUserPurchase/XUserPurchase.component'; // Покупки пользователя
import { XUserPurchase_Service } from 'app/XUserPurchase.service'; 
import { XUserProfileComponent } from './XUserProfile/XUserProfile.component'; // Результаты обучения
import { XUserProfile_Service } from 'app/XUserProfile.service'; 
import { XUserCartComponent } from './XUserCart/XUserCart.component'; // Корзина
import { XUserCart_Service } from 'app/XUserCart.service'; 
import { XUserRegistartionComponent } from './XUserRegistartion/XUserRegistartion.component'; // Запись на  курс
import { XUserRegistartion_Service } from 'app/XUserRegistartion.service'; 
 
import { XScheduleComponent } from './XSchedule/XSchedule.component'; // Расписание курсов
import { XScheduleItemComponent } from './XScheduleItem/XScheduleItem.component'; // Расписание
import { XScheduleItem_Service } from 'app/XScheduleItem.service'; 
 
import { XDictComponent } from './XDict/XDict.component'; // Справочник
import { XLevelComponent } from './XLevel/XLevel.component'; // Уровень сложности
import { XLevel_Service } from 'app/XLevel.service'; 
import { XSubjectComponent } from './XSubject/XSubject.component'; // Предмет
import { XSubject_Service } from 'app/XSubject.service'; 
import { XVendorComponent } from './XVendor/XVendor.component'; // Владелец
import { XVendor_Service } from 'app/XVendor.service'; 
import { XStatusComponent } from './XStatus/XStatus.component'; // Статус инструктора
import { XStatus_Service } from 'app/XStatus.service'; 
import { XSubscriptionTypeComponent } from './XSubscriptionType/XSubscriptionType.component'; // Тип подписки
import { XSubscriptionType_Service } from 'app/XSubscriptionType.service'; 
 import { jwtLoginComponent } from './jwtlogin/jwtlogin.component';

@NgModule({ 
    declarations: [ 
        AppComponent, 
jwtLoginComponent,



 RemoveHTMLtagPipe,
 XInstructorComponent ,  // Инструктор
  XInstructorInfoComponent, // Описание
  XInstructorStatusComponent, // Статусы
 
 XCourseComponent ,  // Курс
  XCourseDescComponent, // Описание курса
  XCourseModuleComponent, // Модули курса
  XChepterComponent, // Глава
 
 XUserComponent ,  // Пользователь
  XSubscriptionComponent, // Подписки
  XUserInfoComponent, // Пользователи
  XUserPurchaseComponent, // Покупки пользователя
  XUserProfileComponent, // Результаты обучения
  XUserCartComponent, // Корзина
  XUserRegistartionComponent, // Запись на  курс
 
 XScheduleComponent ,  // Расписание курсов
  XScheduleItemComponent, // Расписание
 
 XDictComponent ,  // Справочник
  XLevelComponent, // Уровень сложности
  XSubjectComponent, // Предмет
  XVendorComponent, // Владелец
  XStatusComponent, // Статус инструктора
  XSubscriptionTypeComponent, // Тип подписки
		 
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
		
 NgxWigModule,
	CommonModule,
        ROUTING 
    ], 
    providers: [HttpClient 
  ,XInstructorInfo_Service
  ,XInstructorStatus_Service
  ,XCourseDesc_Service
  ,XCourseModule_Service
  ,XChepter_Service
  ,XSubscription_Service
  ,XUserInfo_Service
  ,XUserPurchase_Service
  ,XUserProfile_Service
  ,XUserCart_Service
  ,XUserRegistartion_Service
  ,XScheduleItem_Service
  ,XLevel_Service
  ,XSubject_Service
  ,XVendor_Service
  ,XStatus_Service
  ,XSubscriptionType_Service
	,AppService 
	  ,AppGuard
	,CookieService 
	], 
    bootstrap: [AppComponent] 
}) 
export class AppModule { 
} 
