using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace x_srv.models { 
	/* XDict -  Справочник */ 

 public class  XLevel { // Уровень сложности
	 public System.Guid  XLevelId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	public string  name{ get; set; } // Название
 }

 public class  XSubject { // Тематика
	 public System.Guid  XSubjectId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	public string  name{ get; set; } // Название
 }

 public class  XStatus { // Статус инструктора
	 public System.Guid  XStatusId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	public string  name{ get; set; } // Название
 }

 public class  XSubscriptionType { // Тип подписки
	 public System.Guid  XSubscriptionTypeId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	public string  name{ get; set; } // Название
	[Required]
	public int  timerange{ get; set; } // Длительность подписки
 }

 public class  XCert { // Сертификаты
	 public System.Guid  XCertId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	public string  name{ get; set; } // Название
 }

 public class  XUserSkillLevel { // Уровень владения языком
	 public System.Guid  XUserSkillLevelId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	public string  name{ get; set; } // Название
 }
}