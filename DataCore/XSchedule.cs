using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace x_srv.models { 
	/* XSchedule -  Расписание курсов */ 

 public class  XScheduleItem { // Расписание
	 public System.Guid  XScheduleItemId{ get; set; } // Идентификатор (первичный ключ)
	 public List<XScheduleSubst>  XScheduleSubst { get; set; } // дочерний раздел: Замещения
	public System.Guid  theCourse { get; set; } //Курс
	[ForeignKey("theCourse")]
	public XCourseDesc XCourseDesc { get; set; } // Объект - Курс
	public System.Guid  theInstructor { get; set; } //Инструктор
	[ForeignKey("theInstructor")]
	public XInstructorInfo XInstructorInfo { get; set; } // Объект - Инструктор
	[Required]
	public DateTime  fromDate{ get; set; } // С
	[Required]
	public DateTime  toDate{ get; set; } // По
 }

 public class  XScheduleSubst { // Замещения
	 public System.Guid  XScheduleSubstId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	 public System.Guid  XScheduleItemId { get; set; } // обратная ссылка на: Расписание
	public System.Guid  theInstructor { get; set; } //Инструктор
	[ForeignKey("theInstructor")]
	public XInstructorInfo XInstructorInfo { get; set; } // Объект - Инструктор
	[Required]
	public DateTime  fromDate{ get; set; } // С
	[Required]
	public DateTime  toDate{ get; set; } // По
 }
}