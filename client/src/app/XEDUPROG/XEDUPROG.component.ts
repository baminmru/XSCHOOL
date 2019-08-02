import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 
import { XEDUPROG } from "app/XEDUPROG"; 
import { AppService } from "app/app.service"; 
 
@Component({ 
  selector: 'app-XEDUPROG', 
  templateUrl: './XEDUPROG.component.html', 
  styleUrls: ['./XEDUPROG.component.scss'] 
}) 
export class XEDUPROGComponent implements OnInit { 
 
  constructor(public AppService:AppService) { } 
 
  ngOnInit() { 
  } 
 
}
