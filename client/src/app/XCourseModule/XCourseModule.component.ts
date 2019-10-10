import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XCourseModule_Service } from "app/XCourseModule.service";
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
	   selector: 'app-XCourseModule',
    styleUrls: ['./XCourseModule.component.scss'],
    templateUrl: './XCourseModule.component.html',
})
export class XCourseModuleComponent implements OnInit {

    XCourseModuleArray: Array<XCourse.XCourseModule> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXCourseModule: XCourse.XCourseModule = {} as XCourse.XCourseModule;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private XCourseModule_Service: XCourseModule_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   console.log("Subscribe XCourseModule"); 
        this.subscription=this.AppService.currentXCourseDesc.subscribe(si =>{ this.refreshXCourseModule(); }, error => { this.ShowError(error.message); } );
        this.refreshXCourseModule();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
		   console.log("Unsubscribe XCourseModule"); 
        this.subscription.unsubscribe();
    }

    refreshXCourseModule() {
		let item:XCourse.XCourseDesc;
		item=this.AppService.LastXCourseDesc;
		console.log("refreshing XCourseModule"); 
     this.currentXCourseModule = {} as XCourse.XCourseModule;
     console.log("clear selection for XCourseModule on refresh");
     this.AppService.pushSelectedXCourseModule(this.currentXCourseModule);
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.XCourseModule_Service.get_XCourseModuleByParent('00000000-0000-0000-0000-000000000000').subscribe(XCourseModuleArray => { this.XCourseModuleArray = XCourseModuleArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XCourseDescId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.XCourseModule_Service.get_XCourseModuleByParent('00000000-0000-0000-0000-000000000000').subscribe(XCourseModuleArray => { this.XCourseModuleArray = XCourseModuleArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XCourseDescId === 'string' ) {
        this.XCourseModule_Service.get_XCourseModuleByParent(item.XCourseDescId).subscribe(XCourseModuleArray => { this.XCourseModuleArray = XCourseModuleArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXCourseModule();
		return this.XCourseModuleArray ;
	   }

    onSelect(item: XCourse.XCourseModule) {
        this.currentXCourseModule = item;
        this.AppService.pushSelectedXCourseModule(item);
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastXCourseDesc.XCourseDescId) === 'string' ) {
        this.currentXCourseModule = {} as XCourse.XCourseModule;
        this.currentXCourseModule.XCourseDescId = this.AppService.LastXCourseDesc.XCourseDescId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XCourse.XCourseModule) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXCourseModule = item;
    }

    onDelete(item: XCourse.XCourseModule) {
        this.confirmOpened = true;
        this.currentXCourseModule = item;
    }

    onConfirmDeletion() {
        this.XCourseModule_Service.delete_XCourseModuleById(this.currentXCourseModule.XCourseModuleId).subscribe(data => {this.refreshXCourseModule()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XCourse.XCourseModule) {
        this.valid=true; 
     if(this.currentXCourseModule.ModuleNo == undefined  ) this.valid=false;
     if(this.currentXCourseModule.name == undefined || this.currentXCourseModule.name=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XCourseModule_Service.create_XCourseModule(item)
                        .subscribe(data =>{ this.refreshXCourseModule()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XCourseModule_Service.update_XCourseModule( item)
                        .subscribe(data => {this.refreshXCourseModule()}, error => { this.ShowError(error.message); });
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
        for(var i = 0; i < this.XCourseModuleArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.XCourseModuleArray[i].ModuleNo;
            aoa[i+1][1]=this.XCourseModuleArray[i].name;
            aoa[i+1][2]=this.XCourseModuleArray[i].info;
            aoa[i+1][3]=this.XCourseModuleArray[i].reglament;
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
        XLSX.utils.book_append_sheet(wb, ws, 'XCourseModule');
        

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
		XLSX.writeFile(wb, 'XCourseModule.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentXCourseModule = {} as XCourse.XCourseModule;
        console.log("clear selection for XCourseModule");
        this.AppService.pushSelectedXCourseModule(this.currentXCourseModule);
    }
}
 
