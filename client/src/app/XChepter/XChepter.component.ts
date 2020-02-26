import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xChepter_Service } from "app/XChepter.service";
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
	   selector: 'app-xChepter',
    styleUrls: ['./XChepter.component.scss'],
    templateUrl: './XChepter.component.html',
})
export class xChepterComponent implements OnInit {

    uploader:FileUploader;
    uploader_response:string;

    xChepterArray: Array<XCourse.xChepter> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxChepter: XCourse.xChepter = {} as XCourse.xChepter;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private xChepter_Service: xChepter_Service,  public AppService:AppService ) {
        this.uploader = new FileUploader({
            url: environment.baseAppUrl + '/XChepter/Upload' ,
            authToken: 'Bearer '+ sessionStorage.getItem('auth_token') ,
            disableMultipart: false
          });

          this.uploader_response = '';
          this.uploader.response.subscribe( res => { 
              this.uploader_response = res; 
              console.log("xChepter uploader: " + this.uploader_response);
              this.refreshxChepter();
            } );
    }

    ngOnInit() {
		   // console.log("Subscribe xChepter"); 
        this.subscription=this.AppService.currentxCourseModule.subscribe(si =>{ this.refreshxChepter(); }, error => { this.ShowError(error.message); } );
        this.refreshxChepter();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
		   // console.log("Unsubscribe xChepter"); 
        this.subscription.unsubscribe();
    }

    refreshxChepter() {
		let item:XCourse.xCourseModule;
		item=this.AppService.LastxCourseModule;
		console.log("refreshing xChepter"); 
     this.currentxChepter = {} as XCourse.xChepter;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.xChepter_Service.get_xChepterByParent('00000000-0000-0000-0000-000000000000').subscribe(xChepterArray => { this.xChepterArray = xChepterArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xCourseModuleId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.xChepter_Service.get_xChepterByParent('00000000-0000-0000-0000-000000000000').subscribe(xChepterArray => { this.xChepterArray = xChepterArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xCourseModuleId === 'string' ) {
        this.xChepter_Service.get_xChepterByParent(item.xCourseModuleId).subscribe(xChepterArray => { this.xChepterArray = xChepterArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxChepter();
		return this.xChepterArray ;
	   }

    onSelect(item: XCourse.xChepter) {
        this.currentxChepter = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastxCourseModule.xCourseModuleId) === 'string' ) {
        this.currentxChepter = {} as XCourse.xChepter;
        this.currentxChepter.xCourseModuleId = this.AppService.LastxCourseModule.xCourseModuleId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XCourse.xChepter) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentxChepter = item;
    }

    onDelete(item: XCourse.xChepter) {
        this.confirmOpened = true;
        this.currentxChepter = item;
    }

    onConfirmDeletion() {
        this.xChepter_Service.delete_xChepterById(this.currentxChepter.xChepterId).subscribe(data => {this.refreshxChepter()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XCourse.xChepter) {
        this.valid=true; 
     if(this.currentxChepter.sequence == undefined  ) this.valid=false;
     if(this.currentxChepter.name == undefined || this.currentxChepter.name=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xChepter_Service.create_xChepter(item)
                        .subscribe(data =>{ 
                            if(this.uploader.queue.length>0){
                                this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
                                    form.append('rowid' , data.xChepterId);
                                   };
                                this.uploader.uploadAll();
                            } else {
                                this.refreshxChepter();
                            }
                        }, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xChepter_Service.update_xChepter( item)
                        .subscribe(data => {this.refreshxChepter()}, error => { this.ShowError(error.message); });
                    if(this.uploader.queue.length>0){
                        this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
                            form.append('rowid' , item.xChepterId);
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
            aoa[0][0]='Порядок прохождения';
            aoa[0][1]='Название';
            aoa[0][2]='Основной текст';
            aoa[0][3]='Файл';
/* fill data to array */
        for(var i = 0; i < this.xChepterArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xChepterArray[i].sequence;
            aoa[i+1][1]=this.xChepterArray[i].name;
            aoa[i+1][2]=this.xChepterArray[i].mainText;
            aoa[i+1][3]=this.xChepterArray[i].refFile;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 20}
,            {wch: 64}
,            {wch: 64}
,            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'xChepter');
        

        wb.Props = {
            Title: "Курс::Глава",
            Subject: "Курс::Глава",
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
		XLSX.writeFile(wb, 'xChepter.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxChepter = {} as XCourse.xChepter;
    }
}
 
