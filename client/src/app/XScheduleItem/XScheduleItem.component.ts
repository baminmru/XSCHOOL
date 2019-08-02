﻿import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XScheduleItem_Service } from "app/XScheduleItem.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XSchedule } from "app/XSchedule";


const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-XScheduleItem',
    styleUrls: ['./XScheduleItem.component.scss'],
    templateUrl: './XScheduleItem.component.html',
})
export class XScheduleItemComponent implements OnInit {

    XScheduleItemArray: Array<XSchedule.XScheduleItem> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXScheduleItem: XSchedule.XScheduleItem = {} as XSchedule.XScheduleItem;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private XScheduleItem_Service: XScheduleItem_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshXScheduleItem();
    }
    refreshCombo() {
     this.AppService.refreshComboXCourseDesc();
     this.AppService.refreshComboXInstructorInfo();
    }
    ngOnDestroy() {
    }

    refreshXScheduleItem() {
		   console.log("refreshing XScheduleItem"); 
        this.XScheduleItem_Service.getAll_XScheduleItems().subscribe(XScheduleItemArray => { this.XScheduleItemArray = XScheduleItemArray; }, error => { this.ShowError(error.message); })
        this.currentXScheduleItem = {} as XSchedule.XScheduleItem;
        console.log("clear selection for XScheduleItem on refresh");
        this.AppService.pushSelectedXScheduleItem(this.currentXScheduleItem);
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXScheduleItem();
		return this.XScheduleItemArray ;
	   }

    onSelect(item: XSchedule.XScheduleItem) {
        this.currentXScheduleItem = item;
        this.AppService.pushSelectedXScheduleItem(item);
    }

    onNew() {
    this.refreshCombo(); 
        this.currentXScheduleItem = {} as XSchedule.XScheduleItem;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XSchedule.XScheduleItem) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXScheduleItem = item;
    }

    onDelete(item: XSchedule.XScheduleItem) {
        this.confirmOpened = true;
        this.currentXScheduleItem = item;
    }

    onConfirmDeletion() {
        this.XScheduleItem_Service.delete_XScheduleItemById(this.currentXScheduleItem.XScheduleItemId).subscribe(data => {this.refreshXScheduleItem()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XSchedule.XScheduleItem) {
        this.valid=true; 
     if(this.currentXScheduleItem.theCourse == undefined ) this.valid=false;
     if(this.currentXScheduleItem.theInstructor == undefined ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XScheduleItem_Service.create_XScheduleItem(item)
                        .subscribe(data =>{ this.refreshXScheduleItem()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XScheduleItem_Service.update_XScheduleItem( item)
                        .subscribe(data => {this.refreshXScheduleItem()}, error => { this.ShowError(error.message); });
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
        this.currentXScheduleItem = {} as XSchedule.XScheduleItem;
        console.log("clear selection for XScheduleItem");
        this.AppService.pushSelectedXScheduleItem(this.currentXScheduleItem);
    }
}
 
