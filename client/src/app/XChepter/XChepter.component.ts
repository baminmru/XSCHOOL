import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XChepter_Service } from "app/XChepter.service";
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
	   selector: 'app-XChepter',
    styleUrls: ['./XChepter.component.scss'],
    templateUrl: './XChepter.component.html',
})
export class XChepterComponent implements OnInit {

    XChepterArray: Array<XCourse.XChepter> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXChepter: XCourse.XChepter = {} as XCourse.XChepter;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private XChepter_Service: XChepter_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   console.log("Subscribe XChepter"); 
        this.subscription=this.AppService.currentXCourseModule.subscribe(si =>{ this.refreshXChepter(); }, error => { this.ShowError(error.message); } );
        this.refreshXChepter();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
		   console.log("Unsubscribe XChepter"); 
        this.subscription.unsubscribe();
    }

    refreshXChepter() {
		let item:XCourse.XCourseModule;
		item=this.AppService.LastXCourseModule;
		console.log("refreshing XChepter"); 
     this.currentXChepter = {} as XCourse.XChepter;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.XChepter_Service.get_XChepterByParent('00000000-0000-0000-0000-000000000000').subscribe(XChepterArray => { this.XChepterArray = XChepterArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XCourseModuleId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.XChepter_Service.get_XChepterByParent('00000000-0000-0000-0000-000000000000').subscribe(XChepterArray => { this.XChepterArray = XChepterArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XCourseModuleId === 'string' ) {
        this.XChepter_Service.get_XChepterByParent(item.XCourseModuleId).subscribe(XChepterArray => { this.XChepterArray = XChepterArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXChepter();
		return this.XChepterArray ;
	   }

    onSelect(item: XCourse.XChepter) {
        this.currentXChepter = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastXCourseModule.XCourseModuleId) === 'string' ) {
        this.currentXChepter = {} as XCourse.XChepter;
        this.currentXChepter.XCourseModuleId = this.AppService.LastXCourseModule.XCourseModuleId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XCourse.XChepter) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXChepter = item;
    }

    onDelete(item: XCourse.XChepter) {
        this.confirmOpened = true;
        this.currentXChepter = item;
    }

    onConfirmDeletion() {
        this.XChepter_Service.delete_XChepterById(this.currentXChepter.XChepterId).subscribe(data => {this.refreshXChepter()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XCourse.XChepter) {
        this.valid=true; 
     if(this.currentXChepter.name == undefined || this.currentXChepter.name=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XChepter_Service.create_XChepter(item)
                        .subscribe(data =>{ this.refreshXChepter()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XChepter_Service.update_XChepter( item)
                        .subscribe(data => {this.refreshXChepter()}, error => { this.ShowError(error.message); });
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
            aoa[0][0]='Название';
            aoa[0][1]='Основной текст';
/* fill data to array */
        for(var i = 0; i < this.XChepterArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.XChepterArray[i].name;
            aoa[i+1][1]=this.XChepterArray[i].mainText;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
,            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'XChepter');
        

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
		XLSX.writeFile(wb, 'XChepter.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentXChepter = {} as XCourse.XChepter;
    }
}
 
