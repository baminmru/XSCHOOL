import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xInstructorInfo_Service } from "app/XInstructorInfo.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XInstructor } from "app/XInstructor";
import * as XLSX from 'xlsx';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../environments/environment';


const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-xInstructorInfo',
    styleUrls: ['./XInstructorInfo.component.scss'],
    templateUrl: './XInstructorInfo.component.html',
})
export class xInstructorInfoComponent implements OnInit {

    uploader:FileUploader;
    uploader_response:string;

    xInstructorInfoArray: Array<XInstructor.xInstructorInfo> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxInstructorInfo: XInstructor.xInstructorInfo = {} as XInstructor.xInstructorInfo;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private xInstructorInfo_Service: xInstructorInfo_Service,  public AppService:AppService ) {
        this.uploader = new FileUploader({
            url: environment.baseAppUrl + '/XInstructorInfo/Upload' ,
            authToken: 'Bearer '+ sessionStorage.getItem('auth_token') ,
            disableMultipart: false
          });

          this.uploader_response = '';
          this.uploader.response.subscribe( res =>{ 
            this.uploader_response = res;  
            console.log("XInstructorInfo uploader: " + this.uploader_response);
            this.refreshxInstructorInfo();
        } );
    }

    ngOnInit() {
        this.refreshxInstructorInfo();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshxInstructorInfo() {
		   console.log("refreshing xInstructorInfo"); 
        this.xInstructorInfo_Service.getAll_xInstructorInfos().subscribe(xInstructorInfoArray => { this.xInstructorInfoArray = xInstructorInfoArray; }, error => { this.ShowError(error.message); })
        this.currentxInstructorInfo = {} as XInstructor.xInstructorInfo;
        console.log("clear selection for xInstructorInfo on refresh");
        this.AppService.pushSelectedxInstructorInfo(this.currentxInstructorInfo);
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxInstructorInfo();
		return this.xInstructorInfoArray ;
	   }

    onSelect(item: XInstructor.xInstructorInfo) {
        this.currentxInstructorInfo = item;
        this.AppService.pushSelectedxInstructorInfo(item);
    }

    onNew() {
    this.refreshCombo(); 
        this.currentxInstructorInfo = {} as XInstructor.xInstructorInfo;
        this.opened = true;
        this.mode = MODE_NEW;
        this.uploader.clearQueue();
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XInstructor.xInstructorInfo) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.uploader.clearQueue();
        this.currentxInstructorInfo = item;
    }

    onDelete(item: XInstructor.xInstructorInfo) {
        this.confirmOpened = true;
        this.currentxInstructorInfo = item;
    }

    onConfirmDeletion() {
        this.xInstructorInfo_Service.delete_xInstructorInfoById(this.currentxInstructorInfo.xInstructorInfoId).subscribe(data => {this.refreshxInstructorInfo()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XInstructor.xInstructorInfo) {
        this.valid=true; 
     if(this.currentxInstructorInfo.family == undefined || this.currentxInstructorInfo.family=='') this.valid=false;
     if(this.currentxInstructorInfo.name == undefined || this.currentxInstructorInfo.name=='') this.valid=false;
     if(this.currentxInstructorInfo.middleName == undefined || this.currentxInstructorInfo.middleName=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xInstructorInfo_Service.create_xInstructorInfo(item)
                        .subscribe(data =>{ 
                           
                            if(this.uploader.queue.length>0){
                                this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
                                    form.append('rowid' , data.xInstructorInfoId);
                                   };
                                this.uploader.uploadAll();
                            }  else{  
                            this.refreshxInstructorInfo();
                            }
                        
                        }, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xInstructorInfo_Service.update_xInstructorInfo( item)
                        .subscribe(data => {this.refreshxInstructorInfo()}, error => { this.ShowError(error.message); });
                    if(this.uploader.queue.length>0){
                        this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
                            form.append('rowid' , item.xInstructorInfoId);
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
            aoa[0][3]='e-mail';
            aoa[0][4]='Телефон';
            aoa[0][5]='Фотография';
            aoa[0][6]='Местный телефон';
/* fill data to array */
        for(var i = 0; i < this.xInstructorInfoArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xInstructorInfoArray[i].family;
            aoa[i+1][1]=this.xInstructorInfoArray[i].name;
            aoa[i+1][2]=this.xInstructorInfoArray[i].middleName;
            aoa[i+1][3]=this.xInstructorInfoArray[i].eMail;
            aoa[i+1][4]=this.xInstructorInfoArray[i].phone;
            aoa[i+1][5]=this.xInstructorInfoArray[i].photoUrl;
            aoa[i+1][6]=this.xInstructorInfoArray[i].localPhone;
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
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'xInstructorInfo');
        

        wb.Props = {
            Title: "Инструктор::Описание",
            Subject: "Инструктор::Описание",
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
		XLSX.writeFile(wb, 'xInstructorInfo.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxInstructorInfo = {} as XInstructor.xInstructorInfo;
        console.log("clear selection for xInstructorInfo");
        this.AppService.pushSelectedxInstructorInfo(this.currentxInstructorInfo);
    }
}
 
