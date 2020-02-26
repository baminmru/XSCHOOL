import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xScheduleItem_Service } from "app/XScheduleItem.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XSchedule } from "app/XSchedule";
import * as XLSX from 'xlsx';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-xScheduleItem',
    styleUrls: ['./XScheduleItem.component.scss'],
    templateUrl: './XScheduleItem.component.html',
})
export class xScheduleItemComponent implements OnInit {

    xScheduleItemArray: Array<XSchedule.xScheduleItem> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxScheduleItem: XSchedule.xScheduleItem = {} as XSchedule.xScheduleItem;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private xScheduleItem_Service: xScheduleItem_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshxScheduleItem();
    }
    refreshCombo() {
     this.AppService.refreshComboXCourseDesc();
     this.AppService.refreshComboXInstructorInfo();
    }
    ngOnDestroy() {
    }

    refreshxScheduleItem() {
		   console.log("refreshing xScheduleItem"); 
        this.xScheduleItem_Service.getAll_xScheduleItems().subscribe(xScheduleItemArray => { this.xScheduleItemArray = xScheduleItemArray; }, error => { this.ShowError(error.message); })
        this.currentxScheduleItem = {} as XSchedule.xScheduleItem;
        console.log("clear selection for xScheduleItem on refresh");
        this.AppService.pushSelectedxScheduleItem(this.currentxScheduleItem);
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxScheduleItem();
		return this.xScheduleItemArray ;
	   }

    onSelect(item: XSchedule.xScheduleItem) {
        this.currentxScheduleItem = item;
        this.AppService.pushSelectedxScheduleItem(item);
    }

    onNew() {
    this.refreshCombo(); 
        this.currentxScheduleItem = {} as XSchedule.xScheduleItem;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XSchedule.xScheduleItem) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentxScheduleItem = item;
    }

    onDelete(item: XSchedule.xScheduleItem) {
        this.confirmOpened = true;
        this.currentxScheduleItem = item;
    }

    onConfirmDeletion() {
        this.xScheduleItem_Service.delete_xScheduleItemById(this.currentxScheduleItem.xScheduleItemId).subscribe(data => {this.refreshxScheduleItem()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XSchedule.xScheduleItem) {
        this.valid=true; 
     if(this.currentxScheduleItem.theCourse == undefined ) this.valid=false;
     if(this.currentxScheduleItem.fromDate == undefined ) this.valid=false;
     if(this.currentxScheduleItem.toDate == undefined ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xScheduleItem_Service.create_xScheduleItem(item)
                        .subscribe(data =>{ this.refreshxScheduleItem()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xScheduleItem_Service.update_xScheduleItem( item)
                        .subscribe(data => {this.refreshxScheduleItem()}, error => { this.ShowError(error.message); });
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

 exportXSLX(): void {
        var aoa = [];
/* set column headers at first line */
        if(!aoa[0]) aoa[0] = [];
            aoa[0][0]='Курс';
            aoa[0][1]='Инструктор';
            aoa[0][2]='С';
            aoa[0][3]='По';
/* fill data to array */
        for(var i = 0; i < this.xScheduleItemArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xScheduleItemArray[i].theCourse_name;
            aoa[i+1][1]=this.xScheduleItemArray[i].theInstructor_name;
            aoa[i+1][2]=this.xScheduleItemArray[i].fromDate;
            aoa[i+1][3]=this.xScheduleItemArray[i].toDate;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 50}
,            {wch: 50}
,            {wch: 18}
,            {wch: 18}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'xScheduleItem');
        

        wb.Props = {
            Title: "Расписание курсов::Расписание",
            Subject: "Расписание курсов::Расписание",
            Company: "master.bami",
            Category: "Experimentation",
            Keywords: "Export service",
            Author: "master.bami",
	           Manager: "master.bami",
	           Comments: "Raw data export",
	           LastAuthor: "master.bami",
            CreatedDate: new Date(Date.now())
        }

		/* save to file */
		XLSX.writeFile(wb, 'xScheduleItem.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxScheduleItem = {} as XSchedule.xScheduleItem;
        console.log("clear selection for xScheduleItem");
        this.AppService.pushSelectedxScheduleItem(this.currentxScheduleItem);
    }
}
 
