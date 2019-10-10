import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XUserInfo_Service } from "app/XUserInfo.service";
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
	   selector: 'app-XUserInfo',
    styleUrls: ['./XUserInfo.component.scss'],
    templateUrl: './XUserInfo.component.html',
})
export class XUserInfoComponent implements OnInit {

    XUserInfoArray: Array<XUser.XUserInfo> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXUserInfo: XUser.XUserInfo = {} as XUser.XUserInfo;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private XUserInfo_Service: XUserInfo_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshXUserInfo();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshXUserInfo() {
		   console.log("refreshing XUserInfo"); 
        this.XUserInfo_Service.getAll_XUserInfos().subscribe(XUserInfoArray => { this.XUserInfoArray = XUserInfoArray; }, error => { this.ShowError(error.message); })
        this.currentXUserInfo = {} as XUser.XUserInfo;
        console.log("clear selection for XUserInfo on refresh");
        this.AppService.pushSelectedXUserInfo(this.currentXUserInfo);
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXUserInfo();
		return this.XUserInfoArray ;
	   }

    onSelect(item: XUser.XUserInfo) {
        this.currentXUserInfo = item;
        this.AppService.pushSelectedXUserInfo(item);
    }

    onNew() {
    this.refreshCombo(); 
        this.currentXUserInfo = {} as XUser.XUserInfo;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XUser.XUserInfo) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXUserInfo = item;
    }

    onDelete(item: XUser.XUserInfo) {
        this.confirmOpened = true;
        this.currentXUserInfo = item;
    }

    onConfirmDeletion() {
        this.XUserInfo_Service.delete_XUserInfoById(this.currentXUserInfo.XUserInfoId).subscribe(data => {this.refreshXUserInfo()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XUser.XUserInfo) {
        this.valid=true; 
     if(this.currentXUserInfo.Family == undefined || this.currentXUserInfo.Family=='') this.valid=false;
     if(this.currentXUserInfo.Login == undefined || this.currentXUserInfo.Login=='') this.valid=false;
     if(this.currentXUserInfo.SurName == undefined || this.currentXUserInfo.SurName=='') this.valid=false;
     if(this.currentXUserInfo.Name == undefined || this.currentXUserInfo.Name=='') this.valid=false;
     if(this.currentXUserInfo.PIaccept == undefined ) this.valid=false;
     if(this.currentXUserInfo.HRaccept == undefined ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XUserInfo_Service.create_XUserInfo(item)
                        .subscribe(data =>{ this.refreshXUserInfo()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XUserInfo_Service.update_XUserInfo( item)
                        .subscribe(data => {this.refreshXUserInfo()}, error => { this.ShowError(error.message); });
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
            aoa[0][0]='Фамилия';
            aoa[0][1]='Имя для входа';
            aoa[0][2]='Отчество';
            aoa[0][3]='e-mail';
            aoa[0][4]='Телефон';
            aoa[0][5]='Имя';
            aoa[0][6]='Дата рождения';
            aoa[0][7]='Пароль';
            aoa[0][8]='Город';
            aoa[0][9]='Принята политика ПД';
            aoa[0][10]='Принята политика HR';
/* fill data to array */
        for(var i = 0; i < this.XUserInfoArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.XUserInfoArray[i].Family;
            aoa[i+1][1]=this.XUserInfoArray[i].Login;
            aoa[i+1][2]=this.XUserInfoArray[i].SurName;
            aoa[i+1][3]=this.XUserInfoArray[i].EMail;
            aoa[i+1][4]=this.XUserInfoArray[i].Phone;
            aoa[i+1][5]=this.XUserInfoArray[i].Name;
            aoa[i+1][6]=this.XUserInfoArray[i].Birthday;
            aoa[i+1][7]=this.XUserInfoArray[i].Password;
            aoa[i+1][8]=this.XUserInfoArray[i].City;
            aoa[i+1][9]=this.XUserInfoArray[i].PIaccept_name;
            aoa[i+1][10]=this.XUserInfoArray[i].HRaccept_name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
,            {wch: 64}
,            {wch: 64}
,            {wch: 64}
,            {wch: 64}
,            {wch: 64}
,            {wch: 18}
,            {wch: 64}
,            {wch: 64}
,            {wch: 30}
,            {wch: 30}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'XUserInfo');
        

        wb.Props = {
            Title: "Пользователь::Описание",
            Subject: "Пользователь::Описание",
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
		XLSX.writeFile(wb, 'XUserInfo.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentXUserInfo = {} as XUser.XUserInfo;
        console.log("clear selection for XUserInfo");
        this.AppService.pushSelectedXUserInfo(this.currentXUserInfo);
    }
}
 
