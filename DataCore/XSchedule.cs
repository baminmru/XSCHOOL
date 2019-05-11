using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace x_srv.models { 
	/* XSchedule -  Расписание курсов */ 

 public class  XScheduleItem { // Расписание
	 public System.Guid  XScheduleItemId{ get; set; } // Primary key field
	public System.Guid  theCourse { get; set; } //Курс
	public System.Guid  theInstructor { get; set; } //Инструктор
	[Required]
	public DateTime  FromDate{ get; set; } // С
	[Required]
	public DateTime  ToDate{ get; set; } // По
 }
}