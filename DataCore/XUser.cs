using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace x_srv.models { 
	/* XUser -  Пользователь */ 

 public class  XUserInfo { // Описание
	 public System.Guid  XUserInfoId{ get; set; } // Primary key field
	[Required]
	public string  Family{ get; set; } // Фамилия
	[Required]
	public string  Login{ get; set; } // Имя для входа
	[Required]
	public string  SurName{ get; set; } // Отчество
	public string  EMail{ get; set; } // e-mail
	public string  Phone{ get; set; } // Телефон
	[Required]
	public string  Name{ get; set; } // Имя
	public string  Password{ get; set; } // Пароль
 }

 public class  XSubscription { // Подписки
	 public System.Guid  XSubscriptionId{ get; set; } // Primary key field
	[Required]
	 public System.Guid  XUserInfoId { get; set; } // Id for Описание
	public System.Guid  SubscriptionType { get; set; } //Тип подписки
	[Required]
	public DateTime  FromDate{ get; set; } // С
	[Required]
	public DateTime  ToDate{ get; set; } // По
 }

 public class  XUserPurchase { // Покупки пользователя
	 public System.Guid  XUserPurchaseId{ get; set; } // Primary key field
	[Required]
	 public System.Guid  XUserInfoId { get; set; } // Id for Описание
	public System.Guid  theCourse { get; set; } //Курс
 }

 public class  XUserProfile { // Результаты обучения
	 public System.Guid  XUserProfileId{ get; set; } // Primary key field
	[Required]
	 public System.Guid  XUserInfoId { get; set; } // Id for Описание
	public System.Guid  theCourse { get; set; } //Курс
 }

 public class  XUserRegistartion { // Запись на  курс
	 public System.Guid  XUserRegistartionId{ get; set; } // Primary key field
	[Required]
	 public System.Guid  XUserInfoId { get; set; } // Id for Описание
	public System.Guid  theCourseSchedule { get; set; } //Запись на  курс
 }

 public class  XUserCart { // Корзина
	 public System.Guid  XUserCartId{ get; set; } // Primary key field
	[Required]
	 public System.Guid  XUserInfoId { get; set; } // Id for Описание
	public System.Guid  theCourse { get; set; } //Курс
	public System.Guid  SubscriptionType { get; set; } //Тип подписки
	[Required]
	public DateTime  FromDate{ get; set; } // С
	[Required]
	public DateTime  ToDate{ get; set; } // По
 }
}