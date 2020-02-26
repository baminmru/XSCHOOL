import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xUserPurchase_Service } from "app/XUserPurchase.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XUser } from "app/XUser";
import * as XLSX from 'xlsx';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-xUserPurchase',
    styleUrls: ['./XUserPurchase.component.scss'],
    templateUrl: './XUserPurchase.component.html',
})
export class xUserPurchaseComponent implements OnInit {

    xUserPurchaseArray: Array<XUser.xUserPurchase> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxUserPurchase: XUser.xUserPurchase = {} as XUser.xUserPurchase;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private xUserPurchase_Service: xUserPurchase_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   // console.log("Subscribe xUserPurchase"); 
        this.subscription=this.AppService.currentxUserInfo.subscribe(si =>{ this.refreshxUserPurchase(); }, error => { this.ShowError(error.message); } );
        this.refreshxUserPurchase();
    }
    refreshCombo() {
     this.AppService.refreshComboXCourseDesc();
    }
    ngOnDestroy() {
		   // console.log("Unsubscribe xUserPurchase"); 
        this.subscription.unsubscribe();
    }

    refreshxUserPurchase() {
		let item:XUser.xUserInfo;
		item=this.AppService.LastxUserInfo;
		console.log("refreshing xUserPurchase"); 
     this.currentxUserPurchase = {} as XUser.xUserPurchase;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.xUserPurchase_Service.get_xUserPurchaseByParent('00000000-0000-0000-0000-000000000000').subscribe(xUserPurchaseArray => { this.xUserPurchaseArray = xUserPurchaseArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xUserInfoId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.xUserPurchase_Service.get_xUserPurchaseByParent('00000000-0000-0000-0000-000000000000').subscribe(xUserPurchaseArray => { this.xUserPurchaseArray = xUserPurchaseArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xUserInfoId === 'string' ) {
        this.xUserPurchase_Service.get_xUserPurchaseByParent(item.xUserInfoId).subscribe(xUserPurchaseArray => { this.xUserPurchaseArray = xUserPurchaseArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxUserPurchase();
		return this.xUserPurchaseArray ;
	   }

    onSelect(item: XUser.xUserPurchase) {
        this.currentxUserPurchase = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastxUserInfo.xUserInfoId) === 'string' ) {
        this.currentxUserPurchase = {} as XUser.xUserPurchase;
        this.currentxUserPurchase.xUserInfoId = this.AppService.LastxUserInfo.xUserInfoId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XUser.xUserPurchase) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentxUserPurchase = item;
    }

    onDelete(item: XUser.xUserPurchase) {
        this.confirmOpened = true;
        this.currentxUserPurchase = item;
    }

    onConfirmDeletion() {
        this.xUserPurchase_Service.delete_xUserPurchaseById(this.currentxUserPurchase.xUserPurchaseId).subscribe(data => {this.refreshxUserPurchase()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XUser.xUserPurchase) {
        this.valid=true; 
     if(this.currentxUserPurchase.theCourse == undefined ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xUserPurchase_Service.create_xUserPurchase(item)
                        .subscribe(data =>{ this.refreshxUserPurchase()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xUserPurchase_Service.update_xUserPurchase( item)
                        .subscribe(data => {this.refreshxUserPurchase()}, error => { this.ShowError(error.message); });
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
            aoa[0][0]='Курс';
/* fill data to array */
        for(var i = 0; i < this.xUserPurchaseArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xUserPurchaseArray[i].theCourse_name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 50}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'xUserPurchase');
        

        wb.Props = {
            Title: "Пользователь::Покупки пользователя",
            Subject: "Пользователь::Покупки пользователя",
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
		XLSX.writeFile(wb, 'xUserPurchase.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxUserPurchase = {} as XUser.xUserPurchase;
    }
}
 
