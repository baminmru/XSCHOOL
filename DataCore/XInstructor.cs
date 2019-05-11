using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace x_srv.models { 
	/* XInstructor -  Инструктор */ 

 public class  XInstructorInfo { // Описание
	 public System.Guid  XInstructorInfoId{ get; set; } // Primary key field
	[Required]
	public string  Family{ get; set; } // Фамилия
	[Required]
	public string  Name{ get; set; } // Имя
	[Required]
	public string  SurName{ get; set; } // Отчество
	public string  EMail{ get; set; } // e-mail
	public string  Phone{ get; set; } // Телефон
	public string  LocalPhone{ get; set; } // Местный телефон
 }

 public class  XInstructorStatus { // Статусы
	 public System.Guid  XInstructorStatusId{ get; set; } // Primary key field
	[Required]
	 public System.Guid  XInstructorInfoId { get; set; } // Id for Описание
	public System.Guid  theStatus { get; set; } //Статус
 }
}