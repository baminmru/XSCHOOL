import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XSubscription_Service } from "app/XSubscription.service";
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
	   selector: 'app-XSubscription',
    styleUrls: ['./XSubscription.component.scss'],
    templateUrl: './XSubscription.component.html',
})
export class XSubscriptionComponent implements OnInit {

    XSubscriptionArray: Array<XUser.XSubscription> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXSubscription: XUser.XSubscription = {} as XUser.XSubscription;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private XSubscription_Service: XSubscription_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   console.log("Subscribe XSubscription"); 
        this.subscription=this.AppService.currentXUserInfo.subscribe(si =>{ this.refreshXSubscription(); }, error => { this.ShowError(error.message); } );
        this.refreshXSubscription();
    }
    refreshCombo() {
     this.AppService.refreshComboXSubscriptionType();
    }
    ngOnDestroy() {
		   console.log("Unsubscribe XSubscription"); 
        this.subscription.unsubscribe();
    }

    refreshXSubscription() {
		let item:XUser.XUserInfo;
		item=this.AppService.LastXUserInfo;
		console.log("refreshing XSubscription"); 
     this.currentXSubscription = {} as XUser.XSubscription;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.XSubscription_Service.get_XSubscriptionByParent('00000000-0000-0000-0000-000000000000').subscribe(XSubscriptionArray => { this.XSubscriptionArray = XSubscriptionArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XUserInfoId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.XSubscription_Service.get_XSubscriptionByParent('00000000-0000-0000-0000-000000000000').subscribe(XSubscriptionArray => { this.XSubscriptionArray = XSubscriptionArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XUserInfoId === 'string' ) {
        this.XSubscription_Service.get_XSubscriptionByParent(item.XUserInfoId).subscribe(XSubscriptionArray => { this.XSubscriptionArray = XSubscriptionArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXSubscription();
		return this.XSubscriptionArray ;
	   }

    onSelect(item: XUser.XSubscription) {
        this.currentXSubscription = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastXUserInfo.XUserInfoId) === 'string' ) {
        this.currentXSubscription = {} as XUser.XSubscription;
        this.currentXSubscription.XUserInfoId = this.AppService.LastXUserInfo.XUserInfoId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XUser.XSubscription) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXSubscription = item;
    }

    onDelete(item: XUser.XSubscription) {
        this.confirmOpened = true;
        this.currentXSubscription = item;
    }

    onConfirmDeletion() {
        this.XSubscription_Service.delete_XSubscriptionById(this.currentXSubscription.XSubscriptionId).subscribe(data => {this.refreshXSubscription()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XUser.XSubscription) {
        this.valid=true; 
     if(this.currentXSubscription.SubscriptionType == undefined ) this.valid=false;
     if(this.currentXSubscription.FromDate == undefined ) this.valid=false;
     if(this.currentXSubscription.ToDate == undefined ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XSubscription_Service.create_XSubscription(item)
                        .subscribe(data =>{ this.refreshXSubscription()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XSubscription_Service.update_XSubscription( item)
                        .subscribe(data => {this.refreshXSubscription()}, error => { this.ShowError(error.message); });
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
            aoa[0][0]='Тип подписки';
            aoa[0][1]='С';
            aoa[0][2]='По';
/* fill data to array */
        for(var i = 0; i < this.XSubscriptionArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.XSubscriptionArray[i].SubscriptionType_name;
            aoa[i+1][1]=this.XSubscriptionArray[i].FromDate;
            aoa[i+1][2]=this.XSubscriptionArray[i].ToDate;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 50}
,            {wch: 18}
,            {wch: 18}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'XSubscription');
        

        wb.Props = {
            Title: "Пользователь::Подписки",
            Subject: "Пользователь::Подписки",
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
		XLSX.writeFile(wb, 'XSubscription.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentXSubscription = {} as XUser.XSubscription;
    }
}
 
