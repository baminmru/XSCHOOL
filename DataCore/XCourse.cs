using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace x_srv.models { 
	/* XCourse -  Курс */ 

 public class  XCourseDesc { // Описание курса
	 public System.Guid  XCourseDescId{ get; set; } // Идентификатор (первичный ключ)
	 public List<XCourseModule>  XCourseModule { get; set; } // дочерний раздел: Модули курса
	 public List<XCoursePrice>  XCoursePrice { get; set; } // дочерний раздел: Цены
	[Required]
	public string  courseCode{ get; set; } // Код курса
	[Required]
	public string  name{ get; set; } // Название
	public System.Guid  subject { get; set; } //Предмет
	[ForeignKey("subject")]
	public XSubject XSubject { get; set; } // Объект - Предмет
	public string  imageUrl{ get; set; } // Картинка
	public System.Guid  theLevel { get; set; } //Уровень сложности
	[ForeignKey("theLevel")]
	public XLevel XLevel { get; set; } // Объект - Уровень сложности
	public System.Guid  certification { get; set; } //Сертификация
	[ForeignKey("certification")]
	public XCert XCert { get; set; } // Объект - Сертификация
	public System.Guid  theInstructor { get; set; } //Инструктор
	[ForeignKey("theInstructor")]
	public XInstructorInfo XInstructorInfo { get; set; } // Объект - Инструктор
	[Required]
	public string  courseDescription{ get; set; } // Описание
	public string  studentGuide{ get; set; } // Методические указания
	public string  labGuide{ get; set; } // Лабораторные работы
	[Required]
	public double  price{ get; set; } // Цена
	public enum_YesNo  isActive{ get; set; } // Активный курс
	public enum_YesNo  isOffline{ get; set; } // Оффлайн курс
	public enum_YesNo  isOnline{ get; set; } // Онлайн курс
	}

	public class  XCourseModule { // Модули курса
	 public System.Guid  XCourseModuleId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	 public System.Guid  XCourseDescId { get; set; } // обратная ссылка на: Описание курса
	 public List<XChepter>  XChepter { get; set; } // дочерний раздел: Глава
	[Required]
	public int  moduleNo{ get; set; } // Номер по порядку
	[Required]
	public string  name{ get; set; } // Название
	public string  info{ get; set; } // Описание
	public string  reglament{ get; set; } // Регламент
 }

 public class  XChepter { // Глава
	 public System.Guid  XChepterId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	 public System.Guid  XCourseModuleId { get; set; } // обратная ссылка на родителя: Модули курса
	[Required]
	public int  sequence{ get; set; } // Порядок прохождения
	[Required]
	public string  name{ get; set; } // Название
	public string  mainText{ get; set; } // Основной текст
	public string  refFile{ get; set; } // Файл
 }

 public class  XCoursePrice { // Цены
	 public System.Guid  XCoursePriceId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	 public System.Guid  XCourseDescId { get; set; } // обратная ссылка на: Описание курса
	[Required]
	public DateTime  priceDate{ get; set; } // Дата назначения цены
	[Required]
	public double  price{ get; set; } // Цена
 }
}