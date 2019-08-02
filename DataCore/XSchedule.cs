using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace x_srv.models { 
	/* XSchedule -  Расписание курсов */ 

 public class  XScheduleItem { // Расписание
	 public System.Guid  XScheduleItemId{ get; set; } // Primary key field
	 public List<XScheduleSubst>  xschedulesubst { get; set; } // Замещения
	public System.Guid  theCourse { get; set; } //Курс
	public System.Guid  theInstructor { get; set; } //Инструктор
	[Required]
	public DateTime  FromDate{ get; set; } // С
	[Required]
	public DateTime  ToDate{ get; set; } // По
 }

 public class  XScheduleSubst { // Замещения
	 public System.Guid  XScheduleSubstId{ get; set; } // Primary key field
	[Required]
	 public System.Guid  XScheduleItemId { get; set; } // Id for Расписание
	public System.Guid  theInstructor { get; set; } //Инструктор
	[Required]
	public DateTime  FromDate{ get; set; } // С
	[Required]
	public DateTime  ToDate{ get; set; } // По
 }
}