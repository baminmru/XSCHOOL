import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xInstructorStatus_Service } from "app/XInstructorStatus.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XInstructor } from "app/XInstructor";
import * as XLSX from 'xlsx';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-xInstructorStatus',
    styleUrls: ['./XInstructorStatus.component.scss'],
    templateUrl: './XInstructorStatus.component.html',
})
export class xInstructorStatusComponent implements OnInit {

    xInstructorStatusArray: Array<XInstructor.xInstructorStatus> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxInstructorStatus: XInstructor.xInstructorStatus = {} as XInstructor.xInstructorStatus;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private xInstructorStatus_Service: xInstructorStatus_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   // console.log("Subscribe xInstructorStatus"); 
        this.subscription=this.AppService.currentxInstructorInfo.subscribe(si =>{ this.refreshxInstructorStatus(); }, error => { this.ShowError(error.message); } );
        this.refreshxInstructorStatus();
    }
    refreshCombo() {
     this.AppService.refreshComboXStatus();
    }
    ngOnDestroy() {
		   // console.log("Unsubscribe xInstructorStatus"); 
        this.subscription.unsubscribe();
    }

    refreshxInstructorStatus() {
		let item:XInstructor.xInstructorInfo;
		item=this.AppService.LastxInstructorInfo;
		console.log("refreshing xInstructorStatus"); 
     this.currentxInstructorStatus = {} as XInstructor.xInstructorStatus;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.xInstructorStatus_Service.get_xInstructorStatusByParent('00000000-0000-0000-0000-000000000000').subscribe(xInstructorStatusArray => { this.xInstructorStatusArray = xInstructorStatusArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xInstructorInfoId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.xInstructorStatus_Service.get_xInstructorStatusByParent('00000000-0000-0000-0000-000000000000').subscribe(xInstructorStatusArray => { this.xInstructorStatusArray = xInstructorStatusArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xInstructorInfoId === 'string' ) {
        this.xInstructorStatus_Service.get_xInstructorStatusByParent(item.xInstructorInfoId).subscribe(xInstructorStatusArray => { this.xInstructorStatusArray = xInstructorStatusArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxInstructorStatus();
		return this.xInstructorStatusArray ;
	   }

    onSelect(item: XInstructor.xInstructorStatus) {
        this.currentxInstructorStatus = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastxInstructorInfo.xInstructorInfoId) === 'string' ) {
        this.currentxInstructorStatus = {} as XInstructor.xInstructorStatus;
        this.currentxInstructorStatus.xInstructorInfoId = this.AppService.LastxInstructorInfo.xInstructorInfoId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XInstructor.xInstructorStatus) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentxInstructorStatus = item;
    }

    onDelete(item: XInstructor.xInstructorStatus) {
        this.confirmOpened = true;
        this.currentxInstructorStatus = item;
    }

    onConfirmDeletion() {
        this.xInstructorStatus_Service.delete_xInstructorStatusById(this.currentxInstructorStatus.xInstructorStatusId).subscribe(data => {this.refreshxInstructorStatus()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XInstructor.xInstructorStatus) {
        this.valid=true; 
     if(this.currentxInstructorStatus.theStatus == undefined ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xInstructorStatus_Service.create_xInstructorStatus(item)
                        .subscribe(data =>{ this.refreshxInstructorStatus()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xInstructorStatus_Service.update_xInstructorStatus( item)
                        .subscribe(data => {this.refreshxInstructorStatus()}, error => { this.ShowError(error.message); });
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
            aoa[0][0]='Статус';
            aoa[0][1]='Порядок';
/* fill data to array */
        for(var i = 0; i < this.xInstructorStatusArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xInstructorStatusArray[i].theStatus_name;
            aoa[i+1][1]=this.xInstructorStatusArray[i].sequence;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 50}
,            {wch: 20}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'xInstructorStatus');
        

        wb.Props = {
            Title: "Инструктор::Статусы",
            Subject: "Инструктор::Статусы",
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
		XLSX.writeFile(wb, 'xInstructorStatus.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxInstructorStatus = {} as XInstructor.xInstructorStatus;
    }
}
 
