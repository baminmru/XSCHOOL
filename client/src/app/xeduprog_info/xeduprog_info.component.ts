import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xeduprog_info_Service } from "app/xeduprog_info.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XEDUPROG } from "app/XEDUPROG";
import * as XLSX from 'xlsx';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-xeduprog_info',
    styleUrls: ['./xeduprog_info.component.scss'],
    templateUrl: './xeduprog_info.component.html',
})
export class xeduprog_infoComponent implements OnInit {

    xeduprog_infoArray: Array<XEDUPROG.xeduprog_info> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxeduprog_info: XEDUPROG.xeduprog_info = {} as XEDUPROG.xeduprog_info;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private xeduprog_info_Service: xeduprog_info_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshxeduprog_info();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshxeduprog_info() {
		   console.log("refreshing xeduprog_info"); 
        this.xeduprog_info_Service.getAll_xeduprog_infos().subscribe(xeduprog_infoArray => { this.xeduprog_infoArray = xeduprog_infoArray; }, error => { this.ShowError(error.message); })
        this.currentxeduprog_info = {} as XEDUPROG.xeduprog_info;
        console.log("clear selection for xeduprog_info on refresh");
        this.AppService.pushSelectedxeduprog_info(this.currentxeduprog_info);
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxeduprog_info();
		return this.xeduprog_infoArray ;
	   }

    onSelect(item: XEDUPROG.xeduprog_info) {
        this.currentxeduprog_info = item;
        this.AppService.pushSelectedxeduprog_info(item);
    }

    onNew() {
    this.refreshCombo(); 
        this.currentxeduprog_info = {} as XEDUPROG.xeduprog_info;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XEDUPROG.xeduprog_info) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentxeduprog_info = item;
    }

    onDelete(item: XEDUPROG.xeduprog_info) {
        this.confirmOpened = true;
        this.currentxeduprog_info = item;
    }

    onConfirmDeletion() {
        this.xeduprog_info_Service.delete_xeduprog_infoById(this.currentxeduprog_info.xeduprog_infoId).subscribe(data => {this.refreshxeduprog_info()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XEDUPROG.xeduprog_info) {
        this.valid=true; 
     if(this.currentxeduprog_info.name == undefined || this.currentxeduprog_info.name=='') this.valid=false;
     if(this.currentxeduprog_info.theDescription == undefined || this.currentxeduprog_info.theDescription=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xeduprog_info_Service.create_xeduprog_info(item)
                        .subscribe(data =>{ this.refreshxeduprog_info()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xeduprog_info_Service.update_xeduprog_info( item)
                        .subscribe(data => {this.refreshxeduprog_info()}, error => { this.ShowError(error.message); });
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
            aoa[0][1]='Описание';
/* fill data to array */
        for(var i = 0; i < this.xeduprog_infoArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xeduprog_infoArray[i].name;
            aoa[i+1][1]=this.xeduprog_infoArray[i].theDescription;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
,            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'xeduprog_info');
        

        wb.Props = {
            Title: "Программы обучения::Описание программы",
            Subject: "Программы обучения::Описание программы",
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
		XLSX.writeFile(wb, 'xeduprog_info.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxeduprog_info = {} as XEDUPROG.xeduprog_info;
        console.log("clear selection for xeduprog_info");
        this.AppService.pushSelectedxeduprog_info(this.currentxeduprog_info);
    }
}
 
