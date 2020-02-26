import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xStatus_Service } from "app/XStatus.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XDict } from "app/XDict";
import * as XLSX from 'xlsx';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-xStatus',
    styleUrls: ['./XStatus.component.scss'],
    templateUrl: './XStatus.component.html',
})
export class xStatusComponent implements OnInit {

    xStatusArray: Array<XDict.xStatus> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxStatus: XDict.xStatus = {} as XDict.xStatus;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private xStatus_Service: xStatus_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshxStatus();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshxStatus() {
		   console.log("refreshing xStatus"); 
        this.xStatus_Service.getAll_xStatuss().subscribe(xStatusArray => { this.xStatusArray = xStatusArray; }, error => { this.ShowError(error.message); })
        this.currentxStatus = {} as XDict.xStatus;
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxStatus();
		return this.xStatusArray ;
	   }

    onSelect(item: XDict.xStatus) {
        this.currentxStatus = item;
    }

    onNew() {
    this.refreshCombo(); 
        this.currentxStatus = {} as XDict.xStatus;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XDict.xStatus) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentxStatus = item;
    }

    onDelete(item: XDict.xStatus) {
        this.confirmOpened = true;
        this.currentxStatus = item;
    }

    onConfirmDeletion() {
        this.xStatus_Service.delete_xStatusById(this.currentxStatus.xStatusId).subscribe(data => {this.refreshxStatus()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XDict.xStatus) {
        this.valid=true; 
     if(this.currentxStatus.name == undefined || this.currentxStatus.name=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xStatus_Service.create_xStatus(item)
                        .subscribe(data =>{ this.refreshxStatus()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xStatus_Service.update_xStatus( item)
                        .subscribe(data => {this.refreshxStatus()}, error => { this.ShowError(error.message); });
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
            aoa[0][0]='Название';
/* fill data to array */
        for(var i = 0; i < this.xStatusArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xStatusArray[i].name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'xStatus');
        

        wb.Props = {
            Title: "Справочник::Статус инструктора",
            Subject: "Справочник::Статус инструктора",
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
		XLSX.writeFile(wb, 'xStatus.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxStatus = {} as XDict.xStatus;
    }
}
 
