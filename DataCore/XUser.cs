using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace x_srv.models { 
	/* XUser -  Пользователь */ 

 public class  XUserInfo { // Описание
	 public System.Guid  XUserInfoId{ get; set; } // Идентификатор (первичный ключ)
	 public List<XSubscription>  XSubscription { get; set; } // дочерний раздел: Подписки
	 public List<XUserPurchase>  XUserPurchase { get; set; } // дочерний раздел: Покупки пользователя
	 public List<XUserProfile>  XUserProfile { get; set; } // дочерний раздел: Результаты обучения
	 public List<XUserRegistartion>  XUserRegistartion { get; set; } // дочерний раздел: Запись на  курс
	 public List<XUserCart>  XUserCart { get; set; } // дочерний раздел: Корзина
	[Required]
	public string  family{ get; set; } // Фамилия
	[Required]
	public string  name{ get; set; } // Имя
	[Required]
	public string  middleName{ get; set; } // Отчество
	[Required]
	public string  login{ get; set; } // Имя для входа
	public string  password{ get; set; } // Пароль
	public string  photoUrl{ get; set; } // Фотография
	public string  eMail{ get; set; } // e-mail
	public string  phone{ get; set; } // Телефон
	public DateTime?  birthday{ get; set; } // Дата рождения
	public string  country{ get; set; } // Страна
	public string  city{ get; set; } // Город
	public string  nativeLanguage{ get; set; } // Родной язык
	public System.Guid  userSkill { get; set; } //Уровень владения русским
	[ForeignKey("userSkill")]
	public XUserSkillLevel XUserSkillLevel { get; set; } // Объект - Уровень владения русским
	public int?  learningYears{ get; set; } // Количество лет изучения русского
	public string  learningGoal{ get; set; } // Цель обучения
	public enum_YesNo  pIaccept{ get; set; } // Принята политика ПД
	public enum_YesNo  hRaccept{ get; set; } // Принята политика HR
 }

 public class  XSubscription { // Подписки
	 public System.Guid  XSubscriptionId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	 public System.Guid  XUserInfoId { get; set; } // обратная ссылка на: Описание
	public System.Guid  subscriptionType { get; set; } //Тип подписки
	[ForeignKey("subscriptionType")]
	public XSubscriptionType XSubscriptionType { get; set; } // Объект - Тип подписки
	[Required]
	public DateTime  fromDate{ get; set; } // С
	[Required]
	public DateTime  toDate{ get; set; } // По
 }

 public class  XUserPurchase { // Покупки пользователя
	 public System.Guid  XUserPurchaseId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	 public System.Guid  XUserInfoId { get; set; } // обратная ссылка на: Описание
	public System.Guid  theCourse { get; set; } //Курс
	[ForeignKey("theCourse")]
	public XCourseDesc XCourseDesc { get; set; } // Объект - Курс
 }

 public class  XUserProfile { // Результаты обучения
	 public System.Guid  XUserProfileId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	 public System.Guid  XUserInfoId { get; set; } // обратная ссылка на: Описание
	public System.Guid  theCourse { get; set; } //Курс
	[ForeignKey("theCourse")]
	public XCourseDesc XCourseDesc { get; set; } // Объект - Курс
	public System.Guid  complModule { get; set; } //Завершенный модуль
	[ForeignKey("complModule")]
	public XCourseModule XCourseModule { get; set; } // Объект - Завершенный модуль
 }

 public class  XUserRegistartion { // Запись на  курс
	 public System.Guid  XUserRegistartionId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	 public System.Guid  XUserInfoId { get; set; } // обратная ссылка на: Описание
	public System.Guid  theCourseSchedule { get; set; } //Запись на  курс
	[ForeignKey("theCourseSchedule")]
	public XScheduleItem XScheduleItem { get; set; } // Объект - Запись на  курс
 }

 public class  XUserCart { // Корзина
	 public System.Guid  XUserCartId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	 public System.Guid  XUserInfoId { get; set; } // обратная ссылка на: Описание
	public System.Guid  theCourse { get; set; } //Курс
	[ForeignKey("theCourse")]
	public XCourseDesc XCourseDesc { get; set; } // Объект - Курс
	public System.Guid  subscriptionType { get; set; } //Тип подписки
	[ForeignKey("subscriptionType")]
	public XSubscriptionType XSubscriptionType { get; set; } // Объект - Тип подписки
 }
}