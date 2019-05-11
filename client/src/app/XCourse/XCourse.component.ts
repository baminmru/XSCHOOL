import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 
import { XCourse } from "app/XCourse"; 
import { AppService } from "app/app.service"; 
 
@Component({ 
  selector: 'app-XCourse', 
  templateUrl: './XCourse.component.html', 
  styleUrls: ['./XCourse.component.scss'] 
}) 
export class XCourseComponent implements OnInit { 
 
  constructor(public AppService:AppService) { } 
 
  ngOnInit() { 
  } 
 
}
