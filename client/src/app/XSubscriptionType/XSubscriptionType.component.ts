import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xSubscriptionType_Service } from "app/XSubscriptionType.service";
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
	   selector: 'app-xSubscriptionType',
    styleUrls: ['./XSubscriptionType.component.scss'],
    templateUrl: './XSubscriptionType.component.html',
})
export class xSubscriptionTypeComponent implements OnInit {

    xSubscriptionTypeArray: Array<XDict.xSubscriptionType> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxSubscriptionType: XDict.xSubscriptionType = {} as XDict.xSubscriptionType;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private xSubscriptionType_Service: xSubscriptionType_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshxSubscriptionType();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshxSubscriptionType() {
		   console.log("refreshing xSubscriptionType"); 
        this.xSubscriptionType_Service.getAll_xSubscriptionTypes().subscribe(xSubscriptionTypeArray => { this.xSubscriptionTypeArray = xSubscriptionTypeArray; }, error => { this.ShowError(error.message); })
        this.currentxSubscriptionType = {} as XDict.xSubscriptionType;
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxSubscriptionType();
		return this.xSubscriptionTypeArray ;
	   }

    onSelect(item: XDict.xSubscriptionType) {
        this.currentxSubscriptionType = item;
    }

    onNew() {
    this.refreshCombo(); 
        this.currentxSubscriptionType = {} as XDict.xSubscriptionType;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XDict.xSubscriptionType) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentxSubscriptionType = item;
    }

    onDelete(item: XDict.xSubscriptionType) {
        this.confirmOpened = true;
        this.currentxSubscriptionType = item;
    }

    onConfirmDeletion() {
        this.xSubscriptionType_Service.delete_xSubscriptionTypeById(this.currentxSubscriptionType.xSubscriptionTypeId).subscribe(data => {this.refreshxSubscriptionType()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XDict.xSubscriptionType) {
        this.valid=true; 
     if(this.currentxSubscriptionType.name == undefined || this.currentxSubscriptionType.name=='') this.valid=false;
     if(this.currentxSubscriptionType.timerange == undefined  ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xSubscriptionType_Service.create_xSubscriptionType(item)
                        .subscribe(data =>{ this.refreshxSubscriptionType()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xSubscriptionType_Service.update_xSubscriptionType( item)
                        .subscribe(data => {this.refreshxSubscriptionType()}, error => { this.ShowError(error.message); });
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
        for(var i = 0; i < this.xSubscriptionTypeArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xSubscriptionTypeArray[i].name;
            aoa[i+1][1]=this.xSubscriptionTypeArray[i].timerange;
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
        XLSX.utils.book_append_sheet(wb, ws, 'xSubscriptionType');
        

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
		XLSX.writeFile(wb, 'xSubscriptionType.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxSubscriptionType = {} as XDict.xSubscriptionType;
    }
}
 
