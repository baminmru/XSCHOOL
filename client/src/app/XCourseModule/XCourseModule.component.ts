import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xCourseModule_Service } from "app/XCourseModule.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XCourse } from "app/XCourse";
import * as XLSX from 'xlsx';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-xCourseModule',
    styleUrls: ['./XCourseModule.component.scss'],
    templateUrl: './XCourseModule.component.html',
})
export class xCourseModuleComponent implements OnInit {

    xCourseModuleArray: Array<XCourse.xCourseModule> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxCourseModule: XCourse.xCourseModule = {} as XCourse.xCourseModule;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private xCourseModule_Service: xCourseModule_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   // console.log("Subscribe xCourseModule"); 
        this.subscription=this.AppService.currentxCourseDesc.subscribe(si =>{ this.refreshxCourseModule(); }, error => { this.ShowError(error.message); } );
        this.refreshxCourseModule();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
		   // console.log("Unsubscribe xCourseModule"); 
        this.subscription.unsubscribe();
    }

    refreshxCourseModule() {
		let item:XCourse.xCourseDesc;
		item=this.AppService.LastxCourseDesc;
		console.log("refreshing xCourseModule"); 
     this.currentxCourseModule = {} as XCourse.xCourseModule;
     console.log("clear selection for xCourseModule on refresh");
     this.AppService.pushSelectedxCourseModule(this.currentxCourseModule);
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.xCourseModule_Service.get_xCourseModuleByParent('00000000-0000-0000-0000-000000000000').subscribe(xCourseModuleArray => { this.xCourseModuleArray = xCourseModuleArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xCourseDescId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.xCourseModule_Service.get_xCourseModuleByParent('00000000-0000-0000-0000-000000000000').subscribe(xCourseModuleArray => { this.xCourseModuleArray = xCourseModuleArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xCourseDescId === 'string' ) {
        this.xCourseModule_Service.get_xCourseModuleByParent(item.xCourseDescId).subscribe(xCourseModuleArray => { this.xCourseModuleArray = xCourseModuleArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxCourseModule();
		return this.xCourseModuleArray ;
	   }

    onSelect(item: XCourse.xCourseModule) {
        this.currentxCourseModule = item;
        this.AppService.pushSelectedxCourseModule(item);
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastxCourseDesc.xCourseDescId) === 'string' ) {
        this.currentxCourseModule = {} as XCourse.xCourseModule;
        this.currentxCourseModule.xCourseDescId = this.AppService.LastxCourseDesc.xCourseDescId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XCourse.xCourseModule) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentxCourseModule = item;
    }

    onDelete(item: XCourse.xCourseModule) {
        this.confirmOpened = true;
        this.currentxCourseModule = item;
    }

    onConfirmDeletion() {
        this.xCourseModule_Service.delete_xCourseModuleById(this.currentxCourseModule.xCourseModuleId).subscribe(data => {this.refreshxCourseModule()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XCourse.xCourseModule) {
        this.valid=true; 
     if(this.currentxCourseModule.moduleNo == undefined  ) this.valid=false;
     if(this.currentxCourseModule.name == undefined || this.currentxCourseModule.name=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xCourseModule_Service.create_xCourseModule(item)
                        .subscribe(data =>{ this.refreshxCourseModule()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xCourseModule_Service.update_xCourseModule( item)
                        .subscribe(data => {this.refreshxCourseModule()}, error => { this.ShowError(error.message); });
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
            aoa[0][0]='Номер по порядку';
            aoa[0][1]='Название';
            aoa[0][2]='Описание';
            aoa[0][3]='Регламент';
/* fill data to array */
        for(var i = 0; i < this.xCourseModuleArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xCourseModuleArray[i].moduleNo;
            aoa[i+1][1]=this.xCourseModuleArray[i].name;
            aoa[i+1][2]=this.xCourseModuleArray[i].info;
            aoa[i+1][3]=this.xCourseModuleArray[i].reglament;
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
        XLSX.utils.book_append_sheet(wb, ws, 'xCourseModule');
        

        wb.Props = {
            Title: "Курс::Модули курса",
            Subject: "Курс::Модули курса",
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
		XLSX.writeFile(wb, 'xCourseModule.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxCourseModule = {} as XCourse.xCourseModule;
        console.log("clear selection for xCourseModule");
        this.AppService.pushSelectedxCourseModule(this.currentxCourseModule);
    }
}
 
