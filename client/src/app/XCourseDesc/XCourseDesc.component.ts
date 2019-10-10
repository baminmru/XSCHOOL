import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XCourseDesc_Service } from "app/XCourseDesc.service";
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
	   selector: 'app-XCourseDesc',
    styleUrls: ['./XCourseDesc.component.scss'],
    templateUrl: './XCourseDesc.component.html',
})
export class XCourseDescComponent implements OnInit {

    XCourseDescArray: Array<XCourse.XCourseDesc> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXCourseDesc: XCourse.XCourseDesc = {} as XCourse.XCourseDesc;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private XCourseDesc_Service: XCourseDesc_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshXCourseDesc();
    }
    refreshCombo() {
     this.AppService.refreshComboXSubject();
     this.AppService.refreshComboXLevel();
     this.AppService.refreshComboXCert();
     this.AppService.refreshComboXInstructorInfo();
     this.AppService.refreshComboXVendor();
    }
    ngOnDestroy() {
    }

    refreshXCourseDesc() {
		   console.log("refreshing XCourseDesc"); 
        this.XCourseDesc_Service.getAll_XCourseDescs().subscribe(XCourseDescArray => { this.XCourseDescArray = XCourseDescArray; }, error => { this.ShowError(error.message); })
        this.currentXCourseDesc = {} as XCourse.XCourseDesc;
        console.log("clear selection for XCourseDesc on refresh");
        this.AppService.pushSelectedXCourseDesc(this.currentXCourseDesc);
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXCourseDesc();
		return this.XCourseDescArray ;
	   }

    onSelect(item: XCourse.XCourseDesc) {
        this.currentXCourseDesc = item;
        this.AppService.pushSelectedXCourseDesc(item);
    }

    onNew() {
    this.refreshCombo(); 
        this.currentXCourseDesc = {} as XCourse.XCourseDesc;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XCourse.XCourseDesc) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXCourseDesc = item;
    }

    onDelete(item: XCourse.XCourseDesc) {
        this.confirmOpened = true;
        this.currentXCourseDesc = item;
    }

    onConfirmDeletion() {
        this.XCourseDesc_Service.delete_XCourseDescById(this.currentXCourseDesc.XCourseDescId).subscribe(data => {this.refreshXCourseDesc()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XCourse.XCourseDesc) {
        this.valid=true; 
     if(this.currentXCourseDesc.CourseCode == undefined || this.currentXCourseDesc.CourseCode=='') this.valid=false;
     if(this.currentXCourseDesc.name == undefined || this.currentXCourseDesc.name=='') this.valid=false;
     if(this.currentXCourseDesc.Subject == undefined ) this.valid=false;
     if(this.currentXCourseDesc.CourseDescription == undefined || this.currentXCourseDesc.CourseDescription=='') this.valid=false;
     if(this.currentXCourseDesc.Price == undefined  ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XCourseDesc_Service.create_XCourseDesc(item)
                        .subscribe(data =>{ this.refreshXCourseDesc()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XCourseDesc_Service.update_XCourseDesc( item)
                        .subscribe(data => {this.refreshXCourseDesc()}, error => { this.ShowError(error.message); });
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
            aoa[0][3]='Уровень сложности';
            aoa[0][4]='Сертификация';
            aoa[0][5]='Инструктор';
            aoa[0][6]='Описание';
            aoa[0][7]='Методические указания';
            aoa[0][8]='Лабораторные работы';
            aoa[0][9]='Цена';
            aoa[0][10]='Активный курс';
            aoa[0][11]='Владелец';
/* fill data to array */
        for(var i = 0; i < this.XCourseDescArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.XCourseDescArray[i].CourseCode;
            aoa[i+1][1]=this.XCourseDescArray[i].name;
            aoa[i+1][2]=this.XCourseDescArray[i].Subject_name;
            aoa[i+1][3]=this.XCourseDescArray[i].theLevel_name;
            aoa[i+1][4]=this.XCourseDescArray[i].Certification_name;
            aoa[i+1][5]=this.XCourseDescArray[i].theInstructor_name;
            aoa[i+1][6]=this.XCourseDescArray[i].CourseDescription;
            aoa[i+1][7]=this.XCourseDescArray[i].StudentGuide;
            aoa[i+1][8]=this.XCourseDescArray[i].LabGuide;
            aoa[i+1][9]=this.XCourseDescArray[i].Price;
            aoa[i+1][10]=this.XCourseDescArray[i].IsActive_name;
            aoa[i+1][11]=this.XCourseDescArray[i].theVendor_name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
,            {wch: 64}
,            {wch: 50}
,            {wch: 50}
,            {wch: 50}
,            {wch: 50}
,            {wch: 64}
,            {wch: 64}
,            {wch: 80}
,            {wch: 20}
,            {wch: 30}
,            {wch: 50}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'XCourseDesc');
        

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
		XLSX.writeFile(wb, 'XCourseDesc.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentXCourseDesc = {} as XCourse.XCourseDesc;
        console.log("clear selection for XCourseDesc");
        this.AppService.pushSelectedXCourseDesc(this.currentXCourseDesc);
    }
}
 
