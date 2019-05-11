import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 
import { XInstructor } from "app/XInstructor"; 
import { AppService } from "app/app.service"; 
 
@Component({ 
  selector: 'app-XInstructor', 
  templateUrl: './XInstructor.component.html', 
  styleUrls: ['./XInstructor.component.scss'] 
}) 
export class XInstructorComponent implements OnInit { 
 
  constructor(public AppService:AppService) { } 
 
  ngOnInit() { 
  } 
 
}
