import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 
import { XDict } from "app/XDict"; 
import { AppService } from "app/app.service"; 
 
@Component({ 
  selector: 'app-XDict', 
  templateUrl: './XDict.component.html', 
  styleUrls: ['./XDict.component.scss'] 
}) 
export class XDictComponent implements OnInit { 
 
  constructor(public AppService:AppService) { } 
 
  ngOnInit() { 
  } 
 
}
