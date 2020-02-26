import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xUserInfo_Service } from "app/XUserInfo.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../environments/environment';

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XUser } from "app/XUser";
import * as XLSX from 'xlsx';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-xUserInfo',
    styleUrls: ['./XUserInfo.component.scss'],
    templateUrl: './XUserInfo.component.html',
})
export class xUserInfoComponent implements OnInit {

    uploader:FileUploader;
    uploader_response:string;
    xUserInfoArray: Array<XUser.xUserInfo> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxUserInfo: XUser.xUserInfo = {} as XUser.xUserInfo;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private xUserInfo_Service: xUserInfo_Service,  public AppService:AppService ) {
        this.uploader = new FileUploader({
            url: environment.baseAppUrl + '/XUserInfo/Upload' ,
            authToken: 'Bearer '+ sessionStorage.getItem('auth_token') ,
            disableMultipart: false
          });

          this.uploader_response = '';
          this.uploader.response.subscribe( res => {
              this.uploader_response = res;   
              console.log("XUserInfo uploader: " + this.uploader_response);
              this.refreshxUserInfo();}  );
    }

    ngOnInit() {
        this.refreshxUserInfo();
    }
    refreshCombo() {
     this.AppService.refreshComboXUserSkillLevel();
    }
    ngOnDestroy() {
    }

    refreshxUserInfo() {
		   console.log("refreshing xUserInfo"); 
        this.xUserInfo_Service.getAll_xUserInfos().subscribe(xUserInfoArray => { this.xUserInfoArray = xUserInfoArray; }, error => { this.ShowError(error.message); })
        this.currentxUserInfo = {} as XUser.xUserInfo;
        console.log("clear selection for xUserInfo on refresh");
        this.AppService.pushSelectedxUserInfo(this.currentxUserInfo);
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxUserInfo();
		return this.xUserInfoArray ;
	   }

    onSelect(item: XUser.xUserInfo) {
        this.currentxUserInfo = item;
        this.AppService.pushSelectedxUserInfo(item);
    }

    onNew() {
    this.refreshCombo(); 
        this.currentxUserInfo = {} as XUser.xUserInfo;
        this.opened = true;
        this.mode = MODE_NEW;
        this.uploader.clearQueue();
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XUser.xUserInfo) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.uploader.clearQueue();
        this.currentxUserInfo = item;
    }

    onDelete(item: XUser.xUserInfo) {
        this.confirmOpened = true;
        this.currentxUserInfo = item;
    }

    onConfirmDeletion() {
        this.xUserInfo_Service.delete_xUserInfoById(this.currentxUserInfo.xUserInfoId).subscribe(data => {this.refreshxUserInfo()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XUser.xUserInfo) {
        this.valid=true; 
     if(this.currentxUserInfo.family == undefined || this.currentxUserInfo.family=='') this.valid=false;
     if(this.currentxUserInfo.name == undefined || this.currentxUserInfo.name=='') this.valid=false;
     if(this.currentxUserInfo.middleName == undefined || this.currentxUserInfo.middleName=='') this.valid=false;
     if(this.currentxUserInfo.login == undefined || this.currentxUserInfo.login=='') this.valid=false;
     if(this.currentxUserInfo.pIaccept == undefined ) this.valid=false;
     if(this.currentxUserInfo.hRaccept == undefined ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xUserInfo_Service.create_xUserInfo(item)
                        .subscribe(data =>{ 
                            if(this.uploader.queue.length>0){
                                this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
                                    form.append('rowid' , data.xUserInfoId);
                                   };
                                this.uploader.uploadAll();
                            }else{ 
                                this.refreshxUserInfo()
                            }
                        }, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xUserInfo_Service.update_xUserInfo( item)
                        .subscribe(data => {this.refreshxUserInfo()}, error => { this.ShowError(error.message); });
                        if(this.uploader.queue.length>0){
                            this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
                                form.append('rowid' , item.xUserInfoId);
                               };
                            this.uploader.uploadAll();
                        }    
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
            aoa[0][1]='Имя';
            aoa[0][2]='Отчество';
            aoa[0][3]='Имя для входа';
            aoa[0][4]='Пароль';
            aoa[0][5]='Фотография';
            aoa[0][6]='e-mail';
            aoa[0][7]='Телефон';
            aoa[0][8]='Дата рождения';
            aoa[0][9]='Страна';
            aoa[0][10]='Город';
            aoa[0][11]='Родной язык';
            aoa[0][12]='Уровень владения русским';
            aoa[0][13]='Количество лет изучения русского';
            aoa[0][14]='Цель обучения';
            aoa[0][15]='Принята политика ПД';
            aoa[0][16]='Принята политика HR';
/* fill data to array */
        for(var i = 0; i < this.xUserInfoArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xUserInfoArray[i].family;
            aoa[i+1][1]=this.xUserInfoArray[i].name;
            aoa[i+1][2]=this.xUserInfoArray[i].middleName;
            aoa[i+1][3]=this.xUserInfoArray[i].login;
            aoa[i+1][4]=this.xUserInfoArray[i].password;
            aoa[i+1][5]=this.xUserInfoArray[i].photoUrl;
            aoa[i+1][6]=this.xUserInfoArray[i].eMail;
            aoa[i+1][7]=this.xUserInfoArray[i].phone;
            aoa[i+1][8]=this.xUserInfoArray[i].birthday;
            aoa[i+1][9]=this.xUserInfoArray[i].country;
            aoa[i+1][10]=this.xUserInfoArray[i].city;
            aoa[i+1][11]=this.xUserInfoArray[i].nativeLanguage;
            aoa[i+1][12]=this.xUserInfoArray[i].userSkill_name;
            aoa[i+1][13]=this.xUserInfoArray[i].learningYears;
            aoa[i+1][14]=this.xUserInfoArray[i].learningGoal;
            aoa[i+1][15]=this.xUserInfoArray[i].pIaccept_name;
            aoa[i+1][16]=this.xUserInfoArray[i].hRaccept_name;
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
,            {wch: 64}
,            {wch: 64}
,            {wch: 18}
,            {wch: 64}
,            {wch: 64}
,            {wch: 64}
,            {wch: 50}
,            {wch: 20}
,            {wch: 64}
,            {wch: 30}
,            {wch: 30}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'xUserInfo');
        

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
		XLSX.writeFile(wb, 'xUserInfo.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxUserInfo = {} as XUser.xUserInfo;
        console.log("clear selection for xUserInfo");
        this.AppService.pushSelectedxUserInfo(this.currentxUserInfo);
    }
}
 
