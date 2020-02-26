import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xScheduleSubst_Service } from "app/XScheduleSubst.service";
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
	   selector: 'app-xScheduleSubst',
    styleUrls: ['./XScheduleSubst.component.scss'],
    templateUrl: './XScheduleSubst.component.html',
})
export class xScheduleSubstComponent implements OnInit {

    xScheduleSubstArray: Array<XSchedule.xScheduleSubst> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxScheduleSubst: XSchedule.xScheduleSubst = {} as XSchedule.xScheduleSubst;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private xScheduleSubst_Service: xScheduleSubst_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   // console.log("Subscribe xScheduleSubst"); 
        this.subscription=this.AppService.currentxScheduleItem.subscribe(si =>{ this.refreshxScheduleSubst(); }, error => { this.ShowError(error.message); } );
        this.refreshxScheduleSubst();
    }
    refreshCombo() {
     this.AppService.refreshComboXInstructorInfo();
    }
    ngOnDestroy() {
		   // console.log("Unsubscribe xScheduleSubst"); 
        this.subscription.unsubscribe();
    }

    refreshxScheduleSubst() {
		let item:XSchedule.xScheduleItem;
		item=this.AppService.LastxScheduleItem;
		console.log("refreshing xScheduleSubst"); 
     this.currentxScheduleSubst = {} as XSchedule.xScheduleSubst;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.xScheduleSubst_Service.get_xScheduleSubstByParent('00000000-0000-0000-0000-000000000000').subscribe(xScheduleSubstArray => { this.xScheduleSubstArray = xScheduleSubstArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xScheduleItemId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.xScheduleSubst_Service.get_xScheduleSubstByParent('00000000-0000-0000-0000-000000000000').subscribe(xScheduleSubstArray => { this.xScheduleSubstArray = xScheduleSubstArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xScheduleItemId === 'string' ) {
        this.xScheduleSubst_Service.get_xScheduleSubstByParent(item.xScheduleItemId).subscribe(xScheduleSubstArray => { this.xScheduleSubstArray = xScheduleSubstArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxScheduleSubst();
		return this.xScheduleSubstArray ;
	   }

    onSelect(item: XSchedule.xScheduleSubst) {
        this.currentxScheduleSubst = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastxScheduleItem.xScheduleItemId) === 'string' ) {
        this.currentxScheduleSubst = {} as XSchedule.xScheduleSubst;
        this.currentxScheduleSubst.xScheduleItemId = this.AppService.LastxScheduleItem.xScheduleItemId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XSchedule.xScheduleSubst) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentxScheduleSubst = item;
    }

    onDelete(item: XSchedule.xScheduleSubst) {
        this.confirmOpened = true;
        this.currentxScheduleSubst = item;
    }

    onConfirmDeletion() {
        this.xScheduleSubst_Service.delete_xScheduleSubstById(this.currentxScheduleSubst.xScheduleSubstId).subscribe(data => {this.refreshxScheduleSubst()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XSchedule.xScheduleSubst) {
        this.valid=true; 
     if(this.currentxScheduleSubst.fromDate == undefined ) this.valid=false;
     if(this.currentxScheduleSubst.toDate == undefined ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xScheduleSubst_Service.create_xScheduleSubst(item)
                        .subscribe(data =>{ this.refreshxScheduleSubst()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xScheduleSubst_Service.update_xScheduleSubst( item)
                        .subscribe(data => {this.refreshxScheduleSubst()}, error => { this.ShowError(error.message); });
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
            aoa[0][0]='Инструктор';
            aoa[0][1]='С';
            aoa[0][2]='По';
/* fill data to array */
        for(var i = 0; i < this.xScheduleSubstArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xScheduleSubstArray[i].theInstructor_name;
            aoa[i+1][1]=this.xScheduleSubstArray[i].fromDate;
            aoa[i+1][2]=this.xScheduleSubstArray[i].toDate;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 50}
,            {wch: 18}
,            {wch: 18}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'xScheduleSubst');
        

        wb.Props = {
            Title: "Расписание курсов::Замещения",
            Subject: "Расписание курсов::Замещения",
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
		XLSX.writeFile(wb, 'xScheduleSubst.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxScheduleSubst = {} as XSchedule.xScheduleSubst;
    }
}
 
