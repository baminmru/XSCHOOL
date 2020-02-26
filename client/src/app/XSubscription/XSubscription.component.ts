import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xSubscription_Service } from "app/XSubscription.service";
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
	   selector: 'app-xSubscription',
    styleUrls: ['./XSubscription.component.scss'],
    templateUrl: './XSubscription.component.html',
})
export class xSubscriptionComponent implements OnInit {

    xSubscriptionArray: Array<XUser.xSubscription> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxSubscription: XUser.xSubscription = {} as XUser.xSubscription;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private xSubscription_Service: xSubscription_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   // console.log("Subscribe xSubscription"); 
        this.subscription=this.AppService.currentxUserInfo.subscribe(si =>{ this.refreshxSubscription(); }, error => { this.ShowError(error.message); } );
        this.refreshxSubscription();
    }
    refreshCombo() {
     this.AppService.refreshComboXSubscriptionType();
    }
    ngOnDestroy() {
		   // console.log("Unsubscribe xSubscription"); 
        this.subscription.unsubscribe();
    }

    refreshxSubscription() {
		let item:XUser.xUserInfo;
		item=this.AppService.LastxUserInfo;
		console.log("refreshing xSubscription"); 
     this.currentxSubscription = {} as XUser.xSubscription;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.xSubscription_Service.get_xSubscriptionByParent('00000000-0000-0000-0000-000000000000').subscribe(xSubscriptionArray => { this.xSubscriptionArray = xSubscriptionArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xUserInfoId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.xSubscription_Service.get_xSubscriptionByParent('00000000-0000-0000-0000-000000000000').subscribe(xSubscriptionArray => { this.xSubscriptionArray = xSubscriptionArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xUserInfoId === 'string' ) {
        this.xSubscription_Service.get_xSubscriptionByParent(item.xUserInfoId).subscribe(xSubscriptionArray => { this.xSubscriptionArray = xSubscriptionArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxSubscription();
		return this.xSubscriptionArray ;
	   }

    onSelect(item: XUser.xSubscription) {
        this.currentxSubscription = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastxUserInfo.xUserInfoId) === 'string' ) {
        this.currentxSubscription = {} as XUser.xSubscription;
        this.currentxSubscription.xUserInfoId = this.AppService.LastxUserInfo.xUserInfoId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XUser.xSubscription) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentxSubscription = item;
    }

    onDelete(item: XUser.xSubscription) {
        this.confirmOpened = true;
        this.currentxSubscription = item;
    }

    onConfirmDeletion() {
        this.xSubscription_Service.delete_xSubscriptionById(this.currentxSubscription.xSubscriptionId).subscribe(data => {this.refreshxSubscription()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XUser.xSubscription) {
        this.valid=true; 
     if(this.currentxSubscription.subscriptionType == undefined ) this.valid=false;
     if(this.currentxSubscription.fromDate == undefined ) this.valid=false;
     if(this.currentxSubscription.toDate == undefined ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xSubscription_Service.create_xSubscription(item)
                        .subscribe(data =>{ this.refreshxSubscription()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xSubscription_Service.update_xSubscription( item)
                        .subscribe(data => {this.refreshxSubscription()}, error => { this.ShowError(error.message); });
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
        for(var i = 0; i < this.xSubscriptionArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xSubscriptionArray[i].subscriptionType_name;
            aoa[i+1][1]=this.xSubscriptionArray[i].fromDate;
            aoa[i+1][2]=this.xSubscriptionArray[i].toDate;
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
        XLSX.utils.book_append_sheet(wb, ws, 'xSubscription');
        

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
		XLSX.writeFile(wb, 'xSubscription.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxSubscription = {} as XUser.xSubscription;
    }
}
 
