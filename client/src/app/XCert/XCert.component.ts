import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xCert_Service } from "app/XCert.service";
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
	   selector: 'app-xCert',
    styleUrls: ['./XCert.component.scss'],
    templateUrl: './XCert.component.html',
})
export class xCertComponent implements OnInit {

    xCertArray: Array<XDict.xCert> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxCert: XDict.xCert = {} as XDict.xCert;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private xCert_Service: xCert_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshxCert();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshxCert() {
		   console.log("refreshing xCert"); 
        this.xCert_Service.getAll_xCerts().subscribe(xCertArray => { this.xCertArray = xCertArray; }, error => { this.ShowError(error.message); })
        this.currentxCert = {} as XDict.xCert;
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxCert();
		return this.xCertArray ;
	   }

    onSelect(item: XDict.xCert) {
        this.currentxCert = item;
    }

    onNew() {
    this.refreshCombo(); 
        this.currentxCert = {} as XDict.xCert;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XDict.xCert) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentxCert = item;
    }

    onDelete(item: XDict.xCert) {
        this.confirmOpened = true;
        this.currentxCert = item;
    }

    onConfirmDeletion() {
        this.xCert_Service.delete_xCertById(this.currentxCert.xCertId).subscribe(data => {this.refreshxCert()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XDict.xCert) {
        this.valid=true; 
     if(this.currentxCert.name == undefined || this.currentxCert.name=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xCert_Service.create_xCert(item)
                        .subscribe(data =>{ this.refreshxCert()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xCert_Service.update_xCert( item)
                        .subscribe(data => {this.refreshxCert()}, error => { this.ShowError(error.message); });
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
        for(var i = 0; i < this.xCertArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xCertArray[i].name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'xCert');
        

        wb.Props = {
            Title: "Справочник::Сертификаты",
            Subject: "Справочник::Сертификаты",
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
		XLSX.writeFile(wb, 'xCert.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxCert = {} as XDict.xCert;
    }
}
 
