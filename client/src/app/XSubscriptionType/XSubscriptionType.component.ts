import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XSubscriptionType_Service } from "app/XSubscriptionType.service";
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
	   selector: 'app-XSubscriptionType',
    styleUrls: ['./XSubscriptionType.component.scss'],
    templateUrl: './XSubscriptionType.component.html',
})
export class XSubscriptionTypeComponent implements OnInit {

    XSubscriptionTypeArray: Array<XDict.XSubscriptionType> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXSubscriptionType: XDict.XSubscriptionType = {} as XDict.XSubscriptionType;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private XSubscriptionType_Service: XSubscriptionType_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshXSubscriptionType();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshXSubscriptionType() {
		   console.log("refreshing XSubscriptionType"); 
        this.XSubscriptionType_Service.getAll_XSubscriptionTypes().subscribe(XSubscriptionTypeArray => { this.XSubscriptionTypeArray = XSubscriptionTypeArray; }, error => { this.ShowError(error.message); })
        this.currentXSubscriptionType = {} as XDict.XSubscriptionType;
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXSubscriptionType();
		return this.XSubscriptionTypeArray ;
	   }

    onSelect(item: XDict.XSubscriptionType) {
        this.currentXSubscriptionType = item;
    }

    onNew() {
    this.refreshCombo(); 
        this.currentXSubscriptionType = {} as XDict.XSubscriptionType;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XDict.XSubscriptionType) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXSubscriptionType = item;
    }

    onDelete(item: XDict.XSubscriptionType) {
        this.confirmOpened = true;
        this.currentXSubscriptionType = item;
    }

    onConfirmDeletion() {
        this.XSubscriptionType_Service.delete_XSubscriptionTypeById(this.currentXSubscriptionType.XSubscriptionTypeId).subscribe(data => {this.refreshXSubscriptionType()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XDict.XSubscriptionType) {
        this.valid=true; 
     if(this.currentXSubscriptionType.name == undefined || this.currentXSubscriptionType.name=='') this.valid=false;
     if(this.currentXSubscriptionType.timerange == undefined  ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XSubscriptionType_Service.create_XSubscriptionType(item)
                        .subscribe(data =>{ this.refreshXSubscriptionType()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XSubscriptionType_Service.update_XSubscriptionType( item)
                        .subscribe(data => {this.refreshXSubscriptionType()}, error => { this.ShowError(error.message); });
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
            aoa[0][1]='Длительность подписки';
/* fill data to array */
        for(var i = 0; i < this.XSubscriptionTypeArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.XSubscriptionTypeArray[i].name;
            aoa[i+1][1]=this.XSubscriptionTypeArray[i].timerange;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
,            {wch: 20}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'XSubscriptionType');
        

        wb.Props = {
            Title: "Справочник::Тип подписки",
            Subject: "Справочник::Тип подписки",
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
		XLSX.writeFile(wb, 'XSubscriptionType.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentXSubscriptionType = {} as XDict.XSubscriptionType;
    }
}
 
