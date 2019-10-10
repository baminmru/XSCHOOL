import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XCoursePrice_Service } from "app/XCoursePrice.service";
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
	   selector: 'app-XCoursePrice',
    styleUrls: ['./XCoursePrice.component.scss'],
    templateUrl: './XCoursePrice.component.html',
})
export class XCoursePriceComponent implements OnInit {

    XCoursePriceArray: Array<XCourse.XCoursePrice> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXCoursePrice: XCourse.XCoursePrice = {} as XCourse.XCoursePrice;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private XCoursePrice_Service: XCoursePrice_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   console.log("Subscribe XCoursePrice"); 
        this.subscription=this.AppService.currentXCourseDesc.subscribe(si =>{ this.refreshXCoursePrice(); }, error => { this.ShowError(error.message); } );
        this.refreshXCoursePrice();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
		   console.log("Unsubscribe XCoursePrice"); 
        this.subscription.unsubscribe();
    }

    refreshXCoursePrice() {
		let item:XCourse.XCourseDesc;
		item=this.AppService.LastXCourseDesc;
		console.log("refreshing XCoursePrice"); 
     this.currentXCoursePrice = {} as XCourse.XCoursePrice;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.XCoursePrice_Service.get_XCoursePriceByParent('00000000-0000-0000-0000-000000000000').subscribe(XCoursePriceArray => { this.XCoursePriceArray = XCoursePriceArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XCourseDescId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.XCoursePrice_Service.get_XCoursePriceByParent('00000000-0000-0000-0000-000000000000').subscribe(XCoursePriceArray => { this.XCoursePriceArray = XCoursePriceArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XCourseDescId === 'string' ) {
        this.XCoursePrice_Service.get_XCoursePriceByParent(item.XCourseDescId).subscribe(XCoursePriceArray => { this.XCoursePriceArray = XCoursePriceArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXCoursePrice();
		return this.XCoursePriceArray ;
	   }

    onSelect(item: XCourse.XCoursePrice) {
        this.currentXCoursePrice = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastXCourseDesc.XCourseDescId) === 'string' ) {
        this.currentXCoursePrice = {} as XCourse.XCoursePrice;
        this.currentXCoursePrice.XCourseDescId = this.AppService.LastXCourseDesc.XCourseDescId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XCourse.XCoursePrice) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXCoursePrice = item;
    }

    onDelete(item: XCourse.XCoursePrice) {
        this.confirmOpened = true;
        this.currentXCoursePrice = item;
    }

    onConfirmDeletion() {
        this.XCoursePrice_Service.delete_XCoursePriceById(this.currentXCoursePrice.XCoursePriceId).subscribe(data => {this.refreshXCoursePrice()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XCourse.XCoursePrice) {
        this.valid=true; 
     if(this.currentXCoursePrice.PriceDate == undefined ) this.valid=false;
     if(this.currentXCoursePrice.Price == undefined  ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XCoursePrice_Service.create_XCoursePrice(item)
                        .subscribe(data =>{ this.refreshXCoursePrice()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XCoursePrice_Service.update_XCoursePrice( item)
                        .subscribe(data => {this.refreshXCoursePrice()}, error => { this.ShowError(error.message); });
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
            aoa[0][0]='Дата назначения цены';
            aoa[0][1]='Цена';
/* fill data to array */
        for(var i = 0; i < this.XCoursePriceArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.XCoursePriceArray[i].PriceDate;
            aoa[i+1][1]=this.XCoursePriceArray[i].Price;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 18}
,            {wch: 20}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'XCoursePrice');
        

        wb.Props = {
            Title: "Курс::Цены",
            Subject: "Курс::Цены",
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
		XLSX.writeFile(wb, 'XCoursePrice.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentXCoursePrice = {} as XCourse.XCoursePrice;
    }
}
 
