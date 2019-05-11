using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace x_srv.models { 
	/* XDict -  Справочник */ 

 public class  XLevel { // Уровень сложности
	 public System.Guid  XLevelId{ get; set; } // Primary key field
	[Required]
	public string  name{ get; set; } // Название
 }

 public class  XSubject { // Предмет
	 public System.Guid  XSubjectId{ get; set; } // Primary key field
	[Required]
	public string  name{ get; set; } // Название
 }

 public class  XVendor { // Владелец
	 public System.Guid  XVendorId{ get; set; } // Primary key field
	[Required]
	public string  name{ get; set; } // Название
 }

 public class  XStatus { // Статус инструктора
	 public System.Guid  XStatusId{ get; set; } // Primary key field
	[Required]
	public string  name{ get; set; } // Название
 }

 public class  XSubscriptionType { // Тип подписки
	 public System.Guid  XSubscriptionTypeId{ get; set; } // Primary key field
	[Required]
	public string  name{ get; set; } // Название
 }
}