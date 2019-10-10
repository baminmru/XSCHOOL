import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XUserRegistartion_Service } from "app/XUserRegistartion.service";
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
	   selector: 'app-XUserRegistartion',
    styleUrls: ['./XUserRegistartion.component.scss'],
    templateUrl: './XUserRegistartion.component.html',
})
export class XUserRegistartionComponent implements OnInit {

    XUserRegistartionArray: Array<XUser.XUserRegistartion> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXUserRegistartion: XUser.XUserRegistartion = {} as XUser.XUserRegistartion;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private XUserRegistartion_Service: XUserRegistartion_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   console.log("Subscribe XUserRegistartion"); 
        this.subscription=this.AppService.currentXUserInfo.subscribe(si =>{ this.refreshXUserRegistartion(); }, error => { this.ShowError(error.message); } );
        this.refreshXUserRegistartion();
    }
    refreshCombo() {
     this.AppService.refreshComboXScheduleItem();
    }
    ngOnDestroy() {
		   console.log("Unsubscribe XUserRegistartion"); 
        this.subscription.unsubscribe();
    }

    refreshXUserRegistartion() {
		let item:XUser.XUserInfo;
		item=this.AppService.LastXUserInfo;
		console.log("refreshing XUserRegistartion"); 
     this.currentXUserRegistartion = {} as XUser.XUserRegistartion;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.XUserRegistartion_Service.get_XUserRegistartionByParent('00000000-0000-0000-0000-000000000000').subscribe(XUserRegistartionArray => { this.XUserRegistartionArray = XUserRegistartionArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XUserInfoId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.XUserRegistartion_Service.get_XUserRegistartionByParent('00000000-0000-0000-0000-000000000000').subscribe(XUserRegistartionArray => { this.XUserRegistartionArray = XUserRegistartionArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XUserInfoId === 'string' ) {
        this.XUserRegistartion_Service.get_XUserRegistartionByParent(item.XUserInfoId).subscribe(XUserRegistartionArray => { this.XUserRegistartionArray = XUserRegistartionArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXUserRegistartion();
		return this.XUserRegistartionArray ;
	   }

    onSelect(item: XUser.XUserRegistartion) {
        this.currentXUserRegistartion = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastXUserInfo.XUserInfoId) === 'string' ) {
        this.currentXUserRegistartion = {} as XUser.XUserRegistartion;
        this.currentXUserRegistartion.XUserInfoId = this.AppService.LastXUserInfo.XUserInfoId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XUser.XUserRegistartion) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXUserRegistartion = item;
    }

    onDelete(item: XUser.XUserRegistartion) {
        this.confirmOpened = true;
        this.currentXUserRegistartion = item;
    }

    onConfirmDeletion() {
        this.XUserRegistartion_Service.delete_XUserRegistartionById(this.currentXUserRegistartion.XUserRegistartionId).subscribe(data => {this.refreshXUserRegistartion()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XUser.XUserRegistartion) {
        this.valid=true; 
     if(this.currentXUserRegistartion.theCourseSchedule == undefined ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XUserRegistartion_Service.create_XUserRegistartion(item)
                        .subscribe(data =>{ this.refreshXUserRegistartion()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XUserRegistartion_Service.update_XUserRegistartion( item)
                        .subscribe(data => {this.refreshXUserRegistartion()}, error => { this.ShowError(error.message); });
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
            aoa[0][0]='Запись на  курс';
/* fill data to array */
        for(var i = 0; i < this.XUserRegistartionArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.XUserRegistartionArray[i].theCourseSchedule_name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 50}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'XUserRegistartion');
        

        wb.Props = {
            Title: "Пользователь::Запись на  курс",
            Subject: "Пользователь::Запись на  курс",
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
		XLSX.writeFile(wb, 'XUserRegistartion.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentXUserRegistartion = {} as XUser.XUserRegistartion;
    }
}
 
