using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace x_srv.models { 
	/* XEDUPROG -  Программы обучения */ 

 public class  xeduprog_info { // Описание программы
	 public System.Guid  xeduprog_infoId{ get; set; } // Primary key field
	 public List<eduprog_course>  eduprog_course { get; set; } // Курсы в программе
	[Required]
	public string  name{ get; set; } // Название
	[Required]
	public string  theDescription{ get; set; } // Описание
 }

 public class  eduprog_course { // Курсы в программе
	 public System.Guid  eduprog_courseId{ get; set; } // Primary key field
	[Required]
	 public System.Guid  xeduprog_infoId { get; set; } // Id for Описание программы
	public System.Guid  Course { get; set; } //Курс
 }
}