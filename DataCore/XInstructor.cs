using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace x_srv.models { 
	/* XInstructor -  Инструктор */ 

 public class  XInstructorInfo { // Описание
	 public System.Guid  XInstructorInfoId{ get; set; } // Идентификатор (первичный ключ)
	 public List<XInstructorStatus>  XInstructorStatus { get; set; } // дочерний раздел: Статусы
	[Required]
	public string  family{ get; set; } // Фамилия
	[Required]
	public string  name{ get; set; } // Имя
	[Required]
	public string  middleName{ get; set; } // Отчество
	public string  eMail{ get; set; } // e-mail
	public string  phone{ get; set; } // Телефон
	public string  photoUrl{ get; set; } // Фотография
	public string  localPhone{ get; set; } // Местный телефон
 }

 public class  XInstructorStatus { // Статусы
		 public System.Guid  XInstructorStatusId{ get; set; } // Идентификатор (первичный ключ)
		[Required]
		 public System.Guid  XInstructorInfoId { get; set; } // обратная ссылка на: Описание
		public System.Guid  theStatus { get; set; } //Статус
		[ForeignKey("theStatus")]
		public XStatus XStatus { get; set; } // Объект - Статус
	public int?  sequence{ get; set; } // Порядок
	}
}