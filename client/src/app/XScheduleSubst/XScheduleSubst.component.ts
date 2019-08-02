﻿import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XScheduleSubst_Service } from "app/XScheduleSubst.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XSchedule } from "app/XSchedule";


const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-XScheduleSubst',
    styleUrls: ['./XScheduleSubst.component.scss'],
    templateUrl: './XScheduleSubst.component.html',
})
export class XScheduleSubstComponent implements OnInit {

    XScheduleSubstArray: Array<XSchedule.XScheduleSubst> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXScheduleSubst: XSchedule.XScheduleSubst = {} as XSchedule.XScheduleSubst;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private XScheduleSubst_Service: XScheduleSubst_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   console.log("Subscribe XScheduleSubst"); 
        this.subscription=this.AppService.currentXScheduleItem.subscribe(si =>{ this.refreshXScheduleSubst(); }, error => { this.ShowError(error.message); } );
        this.refreshXScheduleSubst();
    }
    refreshCombo() {
     this.AppService.refreshComboXInstructorInfo();
    }
    ngOnDestroy() {
		   console.log("Unsubscribe XScheduleSubst"); 
        this.subscription.unsubscribe();
    }

    refreshXScheduleSubst() {
		let item:XSchedule.XScheduleItem;
		item=this.AppService.LastXScheduleItem;
		console.log("refreshing XScheduleSubst"); 
     this.currentXScheduleSubst = {} as XSchedule.XScheduleSubst;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.XScheduleSubst_Service.get_XScheduleSubstByParent('00000000-0000-0000-0000-000000000000').subscribe(XScheduleSubstArray => { this.XScheduleSubstArray = XScheduleSubstArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XScheduleItemId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.XScheduleSubst_Service.get_XScheduleSubstByParent('00000000-0000-0000-0000-000000000000').subscribe(XScheduleSubstArray => { this.XScheduleSubstArray = XScheduleSubstArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XScheduleItemId === 'string' ) {
        this.XScheduleSubst_Service.get_XScheduleSubstByParent(item.XScheduleItemId).subscribe(XScheduleSubstArray => { this.XScheduleSubstArray = XScheduleSubstArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXScheduleSubst();
		return this.XScheduleSubstArray ;
	   }

    onSelect(item: XSchedule.XScheduleSubst) {
        this.currentXScheduleSubst = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastXScheduleItem.XScheduleItemId) === 'string' ) {
        this.currentXScheduleSubst = {} as XSchedule.XScheduleSubst;
        this.currentXScheduleSubst.XScheduleItemId = this.AppService.LastXScheduleItem.XScheduleItemId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XSchedule.XScheduleSubst) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXScheduleSubst = item;
    }

    onDelete(item: XSchedule.XScheduleSubst) {
        this.confirmOpened = true;
        this.currentXScheduleSubst = item;
    }

    onConfirmDeletion() {
        this.XScheduleSubst_Service.delete_XScheduleSubstById(this.currentXScheduleSubst.XScheduleSubstId).subscribe(data => {this.refreshXScheduleSubst()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XSchedule.XScheduleSubst) {
        this.valid=true; 
     if(this.currentXScheduleSubst.theInstructor == undefined ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XScheduleSubst_Service.create_XScheduleSubst(item)
                        .subscribe(data =>{ this.refreshXScheduleSubst()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XScheduleSubst_Service.update_XScheduleSubst( item)
                        .subscribe(data => {this.refreshXScheduleSubst()}, error => { this.ShowError(error.message); });
                    break;
                }
                default:
                    break;
            }
            this.backToList();
        //} else {
        //    this.ShowError("Ошибка заполнения формы");
        }
    }

    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentXScheduleSubst = {} as XSchedule.XScheduleSubst;
    }
}
 
