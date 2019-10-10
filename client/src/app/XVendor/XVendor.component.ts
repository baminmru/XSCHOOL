import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XVendor_Service } from "app/XVendor.service";
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
	   selector: 'app-XVendor',
    styleUrls: ['./XVendor.component.scss'],
    templateUrl: './XVendor.component.html',
})
export class XVendorComponent implements OnInit {

    XVendorArray: Array<XDict.XVendor> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXVendor: XDict.XVendor = {} as XDict.XVendor;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private XVendor_Service: XVendor_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshXVendor();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshXVendor() {
		   console.log("refreshing XVendor"); 
        this.XVendor_Service.getAll_XVendors().subscribe(XVendorArray => { this.XVendorArray = XVendorArray; }, error => { this.ShowError(error.message); })
        this.currentXVendor = {} as XDict.XVendor;
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXVendor();
		return this.XVendorArray ;
	   }

    onSelect(item: XDict.XVendor) {
        this.currentXVendor = item;
    }

    onNew() {
    this.refreshCombo(); 
        this.currentXVendor = {} as XDict.XVendor;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XDict.XVendor) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXVendor = item;
    }

    onDelete(item: XDict.XVendor) {
        this.confirmOpened = true;
        this.currentXVendor = item;
    }

    onConfirmDeletion() {
        this.XVendor_Service.delete_XVendorById(this.currentXVendor.XVendorId).subscribe(data => {this.refreshXVendor()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XDict.XVendor) {
        this.valid=true; 
     if(this.currentXVendor.name == undefined || this.currentXVendor.name=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XVendor_Service.create_XVendor(item)
                        .subscribe(data =>{ this.refreshXVendor()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XVendor_Service.update_XVendor( item)
                        .subscribe(data => {this.refreshXVendor()}, error => { this.ShowError(error.message); });
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
        for(var i = 0; i < this.XVendorArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.XVendorArray[i].name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'XVendor');
        

        wb.Props = {
            Title: "Справочник::Компания-производитель",
            Subject: "Справочник::Компания-производитель",
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
		XLSX.writeFile(wb, 'XVendor.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentXVendor = {} as XDict.XVendor;
    }
}
 
