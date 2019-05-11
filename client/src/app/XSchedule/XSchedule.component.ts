import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 
import { XSchedule } from "app/XSchedule"; 
import { AppService } from "app/app.service"; 
 
@Component({ 
  selector: 'app-XSchedule', 
  templateUrl: './XSchedule.component.html', 
  styleUrls: ['./XSchedule.component.scss'] 
}) 
export class XScheduleComponent implements OnInit { 
 
  constructor(public AppService:AppService) { } 
 
  ngOnInit() { 
  } 
 
}
