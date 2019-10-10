import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XStatus_Service } from "app/XStatus.service";
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
	   selector: 'app-XStatus',
    styleUrls: ['./XStatus.component.scss'],
    templateUrl: './XStatus.component.html',
})
export class XStatusComponent implements OnInit {

    XStatusArray: Array<XDict.XStatus> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXStatus: XDict.XStatus = {} as XDict.XStatus;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private XStatus_Service: XStatus_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshXStatus();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshXStatus() {
		   console.log("refreshing XStatus"); 
        this.XStatus_Service.getAll_XStatuss().subscribe(XStatusArray => { this.XStatusArray = XStatusArray; }, error => { this.ShowError(error.message); })
        this.currentXStatus = {} as XDict.XStatus;
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXStatus();
		return this.XStatusArray ;
	   }

    onSelect(item: XDict.XStatus) {
        this.currentXStatus = item;
    }

    onNew() {
    this.refreshCombo(); 
        this.currentXStatus = {} as XDict.XStatus;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XDict.XStatus) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXStatus = item;
    }

    onDelete(item: XDict.XStatus) {
        this.confirmOpened = true;
        this.currentXStatus = item;
    }

    onConfirmDeletion() {
        this.XStatus_Service.delete_XStatusById(this.currentXStatus.XStatusId).subscribe(data => {this.refreshXStatus()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XDict.XStatus) {
        this.valid=true; 
     if(this.currentXStatus.name == undefined || this.currentXStatus.name=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XStatus_Service.create_XStatus(item)
                        .subscribe(data =>{ this.refreshXStatus()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XStatus_Service.update_XStatus( item)
                        .subscribe(data => {this.refreshXStatus()}, error => { this.ShowError(error.message); });
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
        for(var i = 0; i < this.XStatusArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.XStatusArray[i].name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'XStatus');
        

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
		XLSX.writeFile(wb, 'XStatus.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentXStatus = {} as XDict.XStatus;
    }
}
 
