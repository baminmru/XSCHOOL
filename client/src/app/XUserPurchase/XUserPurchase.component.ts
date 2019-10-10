import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XUserPurchase_Service } from "app/XUserPurchase.service";
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
	   selector: 'app-XUserPurchase',
    styleUrls: ['./XUserPurchase.component.scss'],
    templateUrl: './XUserPurchase.component.html',
})
export class XUserPurchaseComponent implements OnInit {

    XUserPurchaseArray: Array<XUser.XUserPurchase> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXUserPurchase: XUser.XUserPurchase = {} as XUser.XUserPurchase;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private XUserPurchase_Service: XUserPurchase_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   console.log("Subscribe XUserPurchase"); 
        this.subscription=this.AppService.currentXUserInfo.subscribe(si =>{ this.refreshXUserPurchase(); }, error => { this.ShowError(error.message); } );
        this.refreshXUserPurchase();
    }
    refreshCombo() {
     this.AppService.refreshComboXCourseDesc();
    }
    ngOnDestroy() {
		   console.log("Unsubscribe XUserPurchase"); 
        this.subscription.unsubscribe();
    }

    refreshXUserPurchase() {
		let item:XUser.XUserInfo;
		item=this.AppService.LastXUserInfo;
		console.log("refreshing XUserPurchase"); 
     this.currentXUserPurchase = {} as XUser.XUserPurchase;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.XUserPurchase_Service.get_XUserPurchaseByParent('00000000-0000-0000-0000-000000000000').subscribe(XUserPurchaseArray => { this.XUserPurchaseArray = XUserPurchaseArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XUserInfoId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.XUserPurchase_Service.get_XUserPurchaseByParent('00000000-0000-0000-0000-000000000000').subscribe(XUserPurchaseArray => { this.XUserPurchaseArray = XUserPurchaseArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XUserInfoId === 'string' ) {
        this.XUserPurchase_Service.get_XUserPurchaseByParent(item.XUserInfoId).subscribe(XUserPurchaseArray => { this.XUserPurchaseArray = XUserPurchaseArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXUserPurchase();
		return this.XUserPurchaseArray ;
	   }

    onSelect(item: XUser.XUserPurchase) {
        this.currentXUserPurchase = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastXUserInfo.XUserInfoId) === 'string' ) {
        this.currentXUserPurchase = {} as XUser.XUserPurchase;
        this.currentXUserPurchase.XUserInfoId = this.AppService.LastXUserInfo.XUserInfoId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XUser.XUserPurchase) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXUserPurchase = item;
    }

    onDelete(item: XUser.XUserPurchase) {
        this.confirmOpened = true;
        this.currentXUserPurchase = item;
    }

    onConfirmDeletion() {
        this.XUserPurchase_Service.delete_XUserPurchaseById(this.currentXUserPurchase.XUserPurchaseId).subscribe(data => {this.refreshXUserPurchase()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XUser.XUserPurchase) {
        this.valid=true; 
     if(this.currentXUserPurchase.theCourse == undefined ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XUserPurchase_Service.create_XUserPurchase(item)
                        .subscribe(data =>{ this.refreshXUserPurchase()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XUserPurchase_Service.update_XUserPurchase( item)
                        .subscribe(data => {this.refreshXUserPurchase()}, error => { this.ShowError(error.message); });
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
        for(var i = 0; i < this.XUserPurchaseArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.XUserPurchaseArray[i].theCourse_name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 50}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'XUserPurchase');
        

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
		XLSX.writeFile(wb, 'XUserPurchase.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentXUserPurchase = {} as XUser.XUserPurchase;
    }
}
 
