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
import { XCoursePriceComponent } from './XCoursePrice/XCoursePrice.component'; // Цены
import { XCoursePrice_Service } from 'app/XCoursePrice.service'; 
 
import { XUserComponent } from './XUser/XUser.component'; // Пользователь
import { XUserInfoComponent } from './XUserInfo/XUserInfo.component'; // Описание
import { XUserInfo_Service } from 'app/XUserInfo.service'; 
import { XSubscriptionComponent } from './XSubscription/XSubscription.component'; // Подписки
import { XSubscription_Service } from 'app/XSubscription.service'; 
import { XUserPurchaseComponent } from './XUserPurchase/XUserPurchase.component'; // Покупки пользователя
import { XUserPurchase_Service } from 'app/XUserPurchase.service'; 
import { XUserProfileComponent } from './XUserProfile/XUserProfile.component'; // Результаты обучения
import { XUserProfile_Service } from 'app/XUserProfile.service'; 
import { XUserRegistartionComponent } from './XUserRegistartion/XUserRegistartion.component'; // Запись на  курс
import { XUserRegistartion_Service } from 'app/XUserRegistartion.service'; 
import { XUserCartComponent } from './XUserCart/XUserCart.component'; // Корзина
import { XUserCart_Service } from 'app/XUserCart.service'; 
 
import { XEDUPROGComponent } from './XEDUPROG/XEDUPROG.component'; // Программы обучения
import { xeduprog_infoComponent } from './xeduprog_info/xeduprog_info.component'; // Описание программы
import { xeduprog_info_Service } from 'app/xeduprog_info.service'; 
import { eduprog_courseComponent } from './eduprog_course/eduprog_course.component'; // Курсы в программе
import { eduprog_course_Service } from 'app/eduprog_course.service'; 
 
import { XScheduleComponent } from './XSchedule/XSchedule.component'; // Расписание курсов
import { XScheduleItemComponent } from './XScheduleItem/XScheduleItem.component'; // Расписание
import { XScheduleItem_Service } from 'app/XScheduleItem.service'; 
import { XScheduleSubstComponent } from './XScheduleSubst/XScheduleSubst.component'; // Замещения
import { XScheduleSubst_Service } from 'app/XScheduleSubst.service'; 
 
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
import { XCertComponent } from './XCert/XCert.component'; // Сертификаты
import { XCert_Service } from 'app/XCert.service'; 
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
  XCoursePriceComponent, // Цены
 
 XUserComponent ,  // Пользователь
  XUserInfoComponent, // Описание
  XSubscriptionComponent, // Подписки
  XUserPurchaseComponent, // Покупки пользователя
  XUserProfileComponent, // Результаты обучения
  XUserRegistartionComponent, // Запись на  курс
  XUserCartComponent, // Корзина
 
 XEDUPROGComponent ,  // Программы обучения
  xeduprog_infoComponent, // Описание программы
  eduprog_courseComponent, // Курсы в программе
 
 XScheduleComponent ,  // Расписание курсов
  XScheduleItemComponent, // Расписание
  XScheduleSubstComponent, // Замещения
 
 XDictComponent ,  // Справочник
  XLevelComponent, // Уровень сложности
  XSubjectComponent, // Тематика
  XVendorComponent, // Компания-производитель
  XStatusComponent, // Статус инструктора
  XSubscriptionTypeComponent, // Тип подписки
  XCertComponent, // Сертификаты
		 
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
  ,XCoursePrice_Service
  ,XUserInfo_Service
  ,XSubscription_Service
  ,XUserPurchase_Service
  ,XUserProfile_Service
  ,XUserRegistartion_Service
  ,XUserCart_Service
  ,xeduprog_info_Service
  ,eduprog_course_Service
  ,XScheduleItem_Service
  ,XScheduleSubst_Service
  ,XLevel_Service
  ,XSubject_Service
  ,XVendor_Service
  ,XStatus_Service
  ,XSubscriptionType_Service
  ,XCert_Service
	,AppService 
	  ,AppGuard
	,CookieService 
	], 
    bootstrap: [AppComponent] 
}) 
export class AppModule { 
} 
