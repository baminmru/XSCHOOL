import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xUserProfile_Service } from "app/XUserProfile.service";
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
	   selector: 'app-xUserProfile',
    styleUrls: ['./XUserProfile.component.scss'],
    templateUrl: './XUserProfile.component.html',
})
export class xUserProfileComponent implements OnInit {

    xUserProfileArray: Array<XUser.xUserProfile> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxUserProfile: XUser.xUserProfile = {} as XUser.xUserProfile;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private xUserProfile_Service: xUserProfile_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   // console.log("Subscribe xUserProfile"); 
        this.subscription=this.AppService.currentxUserInfo.subscribe(si =>{ this.refreshxUserProfile(); }, error => { this.ShowError(error.message); } );
        this.refreshxUserProfile();
    }
    refreshCombo() {
     this.AppService.refreshComboXCourseDesc();
     this.AppService.refreshComboXCourseModule();
    }
    ngOnDestroy() {
		   // console.log("Unsubscribe xUserProfile"); 
        this.subscription.unsubscribe();
    }

    refreshxUserProfile() {
		let item:XUser.xUserInfo;
		item=this.AppService.LastxUserInfo;
		console.log("refreshing xUserProfile"); 
     this.currentxUserProfile = {} as XUser.xUserProfile;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.xUserProfile_Service.get_xUserProfileByParent('00000000-0000-0000-0000-000000000000').subscribe(xUserProfileArray => { this.xUserProfileArray = xUserProfileArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xUserInfoId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.xUserProfile_Service.get_xUserProfileByParent('00000000-0000-0000-0000-000000000000').subscribe(xUserProfileArray => { this.xUserProfileArray = xUserProfileArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xUserInfoId === 'string' ) {
        this.xUserProfile_Service.get_xUserProfileByParent(item.xUserInfoId).subscribe(xUserProfileArray => { this.xUserProfileArray = xUserProfileArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxUserProfile();
		return this.xUserProfileArray ;
	   }

    onSelect(item: XUser.xUserProfile) {
        this.currentxUserProfile = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastxUserInfo.xUserInfoId) === 'string' ) {
        this.currentxUserProfile = {} as XUser.xUserProfile;
        this.currentxUserProfile.xUserInfoId = this.AppService.LastxUserInfo.xUserInfoId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XUser.xUserProfile) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentxUserProfile = item;
    }

    onDelete(item: XUser.xUserProfile) {
        this.confirmOpened = true;
        this.currentxUserProfile = item;
    }

    onConfirmDeletion() {
        this.xUserProfile_Service.delete_xUserProfileById(this.currentxUserProfile.xUserProfileId).subscribe(data => {this.refreshxUserProfile()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XUser.xUserProfile) {
        this.valid=true; 
     if(this.currentxUserProfile.theCourse == undefined ) this.valid=false;
     if(this.currentxUserProfile.complModule == undefined ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xUserProfile_Service.create_xUserProfile(item)
                        .subscribe(data =>{ this.refreshxUserProfile()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xUserProfile_Service.update_xUserProfile( item)
                        .subscribe(data => {this.refreshxUserProfile()}, error => { this.ShowError(error.message); });
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
            aoa[0][1]='Завершенный модуль';
/* fill data to array */
        for(var i = 0; i < this.xUserProfileArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xUserProfileArray[i].theCourse_name;
            aoa[i+1][1]=this.xUserProfileArray[i].complModule_name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 50}
,            {wch: 50}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'xUserProfile');
        

        wb.Props = {
            Title: "Пользователь::Результаты обучения",
            Subject: "Пользователь::Результаты обучения",
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
		XLSX.writeFile(wb, 'xUserProfile.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxUserProfile = {} as XUser.xUserProfile;
    }
}
 
