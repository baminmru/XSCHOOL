using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace x_srv.models { 
	/* XCourse -  Курс */ 

 public class  XCourseDesc { // Описание курса
	 public System.Guid  XCourseDescId{ get; set; } // Primary key field
	[Required]
	public string  name{ get; set; } // Название
	public System.Guid  theLevel { get; set; } //Уровень сложности
	public System.Guid  theVendor { get; set; } //Владелец
	[Required]
	public string  CourseDescription{ get; set; } // Описание
	public string  StudentGuide{ get; set; } // Регламент
	public enum_YesNo  IsActive{ get; set; } // Активный курс
 }

 public class  XCourseModule { // Модули курса
	 public System.Guid  XCourseModuleId{ get; set; } // Primary key field
	[Required]
	 public System.Guid  XCourseDescId { get; set; } // Id for Описание курса
	[Required]
	public string  name{ get; set; } // Название
	public string  info{ get; set; } // Описание
	public string  reglament{ get; set; } // Регламент
 }

 public class  XChepter { // Глава
	 public System.Guid  XChepterId{ get; set; } // Primary key field
	[Required]
	 public System.Guid  XCourseModuleId { get; set; } // Parent part Id -> Модули курса
	[Required]
	public string  name{ get; set; } // Название
	public string  mainText{ get; set; } // Основной текст
 }
}