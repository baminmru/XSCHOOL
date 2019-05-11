import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 
import { XUser } from "app/XUser"; 
import { AppService } from "app/app.service"; 
 
@Component({ 
  selector: 'app-XUser', 
  templateUrl: './XUser.component.html', 
  styleUrls: ['./XUser.component.scss'] 
}) 
export class XUserComponent implements OnInit { 
 
  constructor(public AppService:AppService) { } 
 
  ngOnInit() { 
  } 
 
}
