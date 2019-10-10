import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XUserProfile_Service } from "app/XUserProfile.service";
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
	   selector: 'app-XUserProfile',
    styleUrls: ['./XUserProfile.component.scss'],
    templateUrl: './XUserProfile.component.html',
})
export class XUserProfileComponent implements OnInit {

    XUserProfileArray: Array<XUser.XUserProfile> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXUserProfile: XUser.XUserProfile = {} as XUser.XUserProfile;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private XUserProfile_Service: XUserProfile_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   console.log("Subscribe XUserProfile"); 
        this.subscription=this.AppService.currentXUserInfo.subscribe(si =>{ this.refreshXUserProfile(); }, error => { this.ShowError(error.message); } );
        this.refreshXUserProfile();
    }
    refreshCombo() {
     this.AppService.refreshComboXCourseDesc();
     this.AppService.refreshComboXCourseModule();
    }
    ngOnDestroy() {
		   console.log("Unsubscribe XUserProfile"); 
        this.subscription.unsubscribe();
    }

    refreshXUserProfile() {
		let item:XUser.XUserInfo;
		item=this.AppService.LastXUserInfo;
		console.log("refreshing XUserProfile"); 
     this.currentXUserProfile = {} as XUser.XUserProfile;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.XUserProfile_Service.get_XUserProfileByParent('00000000-0000-0000-0000-000000000000').subscribe(XUserProfileArray => { this.XUserProfileArray = XUserProfileArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XUserInfoId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.XUserProfile_Service.get_XUserProfileByParent('00000000-0000-0000-0000-000000000000').subscribe(XUserProfileArray => { this.XUserProfileArray = XUserProfileArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XUserInfoId === 'string' ) {
        this.XUserProfile_Service.get_XUserProfileByParent(item.XUserInfoId).subscribe(XUserProfileArray => { this.XUserProfileArray = XUserProfileArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXUserProfile();
		return this.XUserProfileArray ;
	   }

    onSelect(item: XUser.XUserProfile) {
        this.currentXUserProfile = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastXUserInfo.XUserInfoId) === 'string' ) {
        this.currentXUserProfile = {} as XUser.XUserProfile;
        this.currentXUserProfile.XUserInfoId = this.AppService.LastXUserInfo.XUserInfoId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XUser.XUserProfile) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXUserProfile = item;
    }

    onDelete(item: XUser.XUserProfile) {
        this.confirmOpened = true;
        this.currentXUserProfile = item;
    }

    onConfirmDeletion() {
        this.XUserProfile_Service.delete_XUserProfileById(this.currentXUserProfile.XUserProfileId).subscribe(data => {this.refreshXUserProfile()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XUser.XUserProfile) {
        this.valid=true; 
     if(this.currentXUserProfile.theCourse == undefined ) this.valid=false;
     if(this.currentXUserProfile.ComplModule == undefined ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XUserProfile_Service.create_XUserProfile(item)
                        .subscribe(data =>{ this.refreshXUserProfile()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XUserProfile_Service.update_XUserProfile( item)
                        .subscribe(data => {this.refreshXUserProfile()}, error => { this.ShowError(error.message); });
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
        for(var i = 0; i < this.XUserProfileArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.XUserProfileArray[i].theCourse_name;
            aoa[i+1][1]=this.XUserProfileArray[i].ComplModule_name;
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
        XLSX.utils.book_append_sheet(wb, ws, 'XUserProfile');
        

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
		XLSX.writeFile(wb, 'XUserProfile.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentXUserProfile = {} as XUser.XUserProfile;
    }
}
 
