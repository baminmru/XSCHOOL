import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xSubject_Service } from "app/XSubject.service";
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
	   selector: 'app-xSubject',
    styleUrls: ['./XSubject.component.scss'],
    templateUrl: './XSubject.component.html',
})
export class xSubjectComponent implements OnInit {

    xSubjectArray: Array<XDict.xSubject> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxSubject: XDict.xSubject = {} as XDict.xSubject;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private xSubject_Service: xSubject_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshxSubject();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshxSubject() {
		   console.log("refreshing xSubject"); 
        this.xSubject_Service.getAll_xSubjects().subscribe(xSubjectArray => { this.xSubjectArray = xSubjectArray; }, error => { this.ShowError(error.message); })
        this.currentxSubject = {} as XDict.xSubject;
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxSubject();
		return this.xSubjectArray ;
	   }

    onSelect(item: XDict.xSubject) {
        this.currentxSubject = item;
    }

    onNew() {
    this.refreshCombo(); 
        this.currentxSubject = {} as XDict.xSubject;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XDict.xSubject) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentxSubject = item;
    }

    onDelete(item: XDict.xSubject) {
        this.confirmOpened = true;
        this.currentxSubject = item;
    }

    onConfirmDeletion() {
        this.xSubject_Service.delete_xSubjectById(this.currentxSubject.xSubjectId).subscribe(data => {this.refreshxSubject()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XDict.xSubject) {
        this.valid=true; 
     if(this.currentxSubject.name == undefined || this.currentxSubject.name=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xSubject_Service.create_xSubject(item)
                        .subscribe(data =>{ this.refreshxSubject()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xSubject_Service.update_xSubject( item)
                        .subscribe(data => {this.refreshxSubject()}, error => { this.ShowError(error.message); });
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
        for(var i = 0; i < this.xSubjectArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xSubjectArray[i].name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'xSubject');
        

        wb.Props = {
            Title: "Справочник::Тематика",
            Subject: "Справочник::Тематика",
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
		XLSX.writeFile(wb, 'xSubject.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxSubject = {} as XDict.xSubject;
    }
}
 
