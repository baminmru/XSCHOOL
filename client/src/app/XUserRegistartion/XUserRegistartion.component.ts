import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xUserRegistartion_Service } from "app/XUserRegistartion.service";
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
	   selector: 'app-xUserRegistartion',
    styleUrls: ['./XUserRegistartion.component.scss'],
    templateUrl: './XUserRegistartion.component.html',
})
export class xUserRegistartionComponent implements OnInit {

    xUserRegistartionArray: Array<XUser.xUserRegistartion> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxUserRegistartion: XUser.xUserRegistartion = {} as XUser.xUserRegistartion;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private xUserRegistartion_Service: xUserRegistartion_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   // console.log("Subscribe xUserRegistartion"); 
        this.subscription=this.AppService.currentxUserInfo.subscribe(si =>{ this.refreshxUserRegistartion(); }, error => { this.ShowError(error.message); } );
        this.refreshxUserRegistartion();
    }
    refreshCombo() {
     this.AppService.refreshComboXScheduleItem();
    }
    ngOnDestroy() {
		   // console.log("Unsubscribe xUserRegistartion"); 
        this.subscription.unsubscribe();
    }

    refreshxUserRegistartion() {
		let item:XUser.xUserInfo;
		item=this.AppService.LastxUserInfo;
		console.log("refreshing xUserRegistartion"); 
     this.currentxUserRegistartion = {} as XUser.xUserRegistartion;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.xUserRegistartion_Service.get_xUserRegistartionByParent('00000000-0000-0000-0000-000000000000').subscribe(xUserRegistartionArray => { this.xUserRegistartionArray = xUserRegistartionArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xUserInfoId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.xUserRegistartion_Service.get_xUserRegistartionByParent('00000000-0000-0000-0000-000000000000').subscribe(xUserRegistartionArray => { this.xUserRegistartionArray = xUserRegistartionArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xUserInfoId === 'string' ) {
        this.xUserRegistartion_Service.get_xUserRegistartionByParent(item.xUserInfoId).subscribe(xUserRegistartionArray => { this.xUserRegistartionArray = xUserRegistartionArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxUserRegistartion();
		return this.xUserRegistartionArray ;
	   }

    onSelect(item: XUser.xUserRegistartion) {
        this.currentxUserRegistartion = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastxUserInfo.xUserInfoId) === 'string' ) {
        this.currentxUserRegistartion = {} as XUser.xUserRegistartion;
        this.currentxUserRegistartion.xUserInfoId = this.AppService.LastxUserInfo.xUserInfoId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XUser.xUserRegistartion) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentxUserRegistartion = item;
    }

    onDelete(item: XUser.xUserRegistartion) {
        this.confirmOpened = true;
        this.currentxUserRegistartion = item;
    }

    onConfirmDeletion() {
        this.xUserRegistartion_Service.delete_xUserRegistartionById(this.currentxUserRegistartion.xUserRegistartionId).subscribe(data => {this.refreshxUserRegistartion()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XUser.xUserRegistartion) {
        this.valid=true; 
     if(this.currentxUserRegistartion.theCourseSchedule == undefined ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xUserRegistartion_Service.create_xUserRegistartion(item)
                        .subscribe(data =>{ this.refreshxUserRegistartion()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xUserRegistartion_Service.update_xUserRegistartion( item)
                        .subscribe(data => {this.refreshxUserRegistartion()}, error => { this.ShowError(error.message); });
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
        for(var i = 0; i < this.xUserRegistartionArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xUserRegistartionArray[i].theCourseSchedule_name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 50}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'xUserRegistartion');
        

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
		XLSX.writeFile(wb, 'xUserRegistartion.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxUserRegistartion = {} as XUser.xUserRegistartion;
    }
}
 
