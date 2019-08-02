using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace x_srv.models { 
	/* XCourse -  Курс */ 

 public class  XCourseDesc { // Описание курса
	 public System.Guid  XCourseDescId{ get; set; } // Primary key field
	 public List<XCourseModule>  xcoursemodule { get; set; } // Модули курса
	 public List<XCoursePrice>  xcourseprice { get; set; } // Цены
	[Required]
	public string  CourseCode{ get; set; } // Код курса
	[Required]
	public string  name{ get; set; } // Название
	public System.Guid  Subject { get; set; } //Предмет
	public System.Guid  theLevel { get; set; } //Уровень сложности
	public System.Guid  Certification { get; set; } //Сертификация
	public System.Guid  theInstructor { get; set; } //Инструктор
	[Required]
	public string  CourseDescription{ get; set; } // Описание
	public string  StudentGuide{ get; set; } // Методические указания
	public string  LabGuide{ get; set; } // Лабораторные работы
	[Required]
	public double  Price{ get; set; } // Цена
	public enum_YesNo  IsActive{ get; set; } // Активный курс
	public System.Guid  theVendor { get; set; } //Владелец
 }

 public class  XCourseModule { // Модули курса
	 public System.Guid  XCourseModuleId{ get; set; } // Primary key field
	[Required]
	 public System.Guid  XCourseDescId { get; set; } // Id for Описание курса
	[Required]
	public double  ModuleNo{ get; set; } // Номер по порядку
	[Required]
	public string  name{ get; set; } // Название
	public string  info{ get; set; } // Описание
	public string  reglament{ get; set; } // Регламент
 }

    public class XChepter
    { // Глава
        public System.Guid XChepterId { get; set; } // Primary key field
        [Required]
        public System.Guid XCourseModuleId { get; set; } // Parent part Id -> Модули курса
    }

    public class XCoursePrice
    { // Цены
        public System.Guid XCoursePriceId { get; set; } // Primary key field
        [Required]
        public System.Guid XCourseDescId { get; set; } // Id for Описание курса
        [Required]
        public DateTime PriceDate { get; set; } // Дата назначения цены
        [Required]
        public double Price { get; set; } // Цена
    }
    
}