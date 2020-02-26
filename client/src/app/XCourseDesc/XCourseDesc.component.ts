import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xCourseDesc_Service } from "app/XCourseDesc.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../environments/environment';

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XCourse } from "app/XCourse";
import * as XLSX from 'xlsx';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-xCourseDesc',
    styleUrls: ['./XCourseDesc.component.scss'],
    templateUrl: './XCourseDesc.component.html',
})
export class xCourseDescComponent implements OnInit {

    uploader:FileUploader;
    uploader_response:string;
    xCourseDescArray: Array<XCourse.xCourseDesc> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxCourseDesc: XCourse.xCourseDesc = {} as XCourse.xCourseDesc;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private xCourseDesc_Service: xCourseDesc_Service,  public AppService:AppService ) {
        this.uploader = new FileUploader({
            url: environment.baseAppUrl + '/XCourseDesc/Upload' ,
            authToken: 'Bearer '+ sessionStorage.getItem('auth_token') ,
            disableMultipart: false
          });

          this.uploader_response = '';
          this.uploader.response.subscribe( res => { 
              this.uploader_response = res; 
              console.log("XCourseDesc uploader: " + this.uploader_response);
              this.refreshxCourseDesc();
            } );
    }

    ngOnInit() {
        this.refreshxCourseDesc();
    }
    refreshCombo() {
     this.AppService.refreshComboXSubject();
     this.AppService.refreshComboXLevel();
     this.AppService.refreshComboXCert();
     this.AppService.refreshComboXInstructorInfo();
    }
    ngOnDestroy() {
    }

    refreshxCourseDesc() {
		   console.log("refreshing xCourseDesc"); 
        this.xCourseDesc_Service.getAll_xCourseDescs().subscribe(xCourseDescArray => { this.xCourseDescArray = xCourseDescArray; }, error => { this.ShowError(error.message); })
        this.currentxCourseDesc = {} as XCourse.xCourseDesc;
        console.log("clear selection for xCourseDesc on refresh");
        this.AppService.pushSelectedxCourseDesc(this.currentxCourseDesc);
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxCourseDesc();
		return this.xCourseDescArray ;
	   }

    onSelect(item: XCourse.xCourseDesc) {
        this.currentxCourseDesc = item;
        this.AppService.pushSelectedxCourseDesc(item);
    }

    onNew() {
    this.refreshCombo(); 
        this.currentxCourseDesc = {} as XCourse.xCourseDesc;
        this.opened = true;
        this.mode = MODE_NEW;
        this.uploader.clearQueue();
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XCourse.xCourseDesc) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.uploader.clearQueue();
        this.currentxCourseDesc = item;
    }

    onDelete(item: XCourse.xCourseDesc) {
        this.confirmOpened = true;
        this.currentxCourseDesc = item;
    }

    onConfirmDeletion() {
        this.xCourseDesc_Service.delete_xCourseDescById(this.currentxCourseDesc.xCourseDescId).subscribe(data => {this.refreshxCourseDesc()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XCourse.xCourseDesc) {
        this.valid=true; 
     if(this.currentxCourseDesc.courseCode == undefined || this.currentxCourseDesc.courseCode=='') this.valid=false;
     if(this.currentxCourseDesc.name == undefined || this.currentxCourseDesc.name=='') this.valid=false;
     if(this.currentxCourseDesc.subject == undefined ) this.valid=false;
     if(this.currentxCourseDesc.courseDescription == undefined || this.currentxCourseDesc.courseDescription=='') this.valid=false;
     if(this.currentxCourseDesc.price == undefined  ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xCourseDesc_Service.create_xCourseDesc(item)
                        .subscribe(data =>{ 
                            if(this.uploader.queue.length>0){
                                this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
                                    form.append('rowid' , data.xCourseDescId);
                                   };
                                this.uploader.uploadAll();
                            } else {   
                                this.refreshxCourseDesc();
                            }

                        }, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xCourseDesc_Service.update_xCourseDesc( item)
                        .subscribe(data => {this.refreshxCourseDesc()}, error => { this.ShowError(error.message); });
                    if(this.uploader.queue.length>0){
                        this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
                            form.append('rowid' , item.xCourseDescId);
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
            aoa[0][0]='Код курса';
            aoa[0][1]='Название';
            aoa[0][2]='Предмет';
            aoa[0][3]='Картинка';
            aoa[0][4]='Уровень сложности';
            aoa[0][5]='Сертификация';
            aoa[0][6]='Инструктор';
            aoa[0][7]='Описание';
            aoa[0][8]='Методические указания';
            aoa[0][9]='Лабораторные работы';
            aoa[0][10]='Цена';
            aoa[0][11]='Активный курс';
            aoa[0][12]='Оффлайн курс';
            aoa[0][13]='Онлайн курс';
/* fill data to array */
        for(var i = 0; i < this.xCourseDescArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xCourseDescArray[i].courseCode;
            aoa[i+1][1]=this.xCourseDescArray[i].name;
            aoa[i+1][2]=this.xCourseDescArray[i].subject_name;
            aoa[i+1][3]=this.xCourseDescArray[i].imageUrl;
            aoa[i+1][4]=this.xCourseDescArray[i].theLevel_name;
            aoa[i+1][5]=this.xCourseDescArray[i].certification_name;
            aoa[i+1][6]=this.xCourseDescArray[i].theInstructor_name;
            aoa[i+1][7]=this.xCourseDescArray[i].courseDescription;
            aoa[i+1][8]=this.xCourseDescArray[i].studentGuide;
            aoa[i+1][9]=this.xCourseDescArray[i].labGuide;
            aoa[i+1][10]=this.xCourseDescArray[i].price;
            aoa[i+1][11]=this.xCourseDescArray[i].isActive_name;
            aoa[i+1][12]=this.xCourseDescArray[i].isOffline_name;
            aoa[i+1][13]=this.xCourseDescArray[i].isOnline_name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
,            {wch: 64}
,            {wch: 50}
,            {wch: 64}
,            {wch: 50}
,            {wch: 50}
,            {wch: 50}
,            {wch: 64}
,            {wch: 64}
,            {wch: 80}
,            {wch: 20}
,            {wch: 30}
,            {wch: 30}
,            {wch: 30}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'xCourseDesc');
        

        wb.Props = {
            Title: "Курс::Описание курса",
            Subject: "Курс::Описание курса",
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
		XLSX.writeFile(wb, 'xCourseDesc.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxCourseDesc = {} as XCourse.xCourseDesc;
        console.log("clear selection for xCourseDesc");
        this.AppService.pushSelectedxCourseDesc(this.currentxCourseDesc);
    }
}
 
