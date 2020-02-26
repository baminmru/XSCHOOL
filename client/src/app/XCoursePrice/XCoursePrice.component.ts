import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xCoursePrice_Service } from "app/XCoursePrice.service";
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
	   selector: 'app-xCoursePrice',
    styleUrls: ['./XCoursePrice.component.scss'],
    templateUrl: './XCoursePrice.component.html',
})
export class xCoursePriceComponent implements OnInit {

    xCoursePriceArray: Array<XCourse.xCoursePrice> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxCoursePrice: XCourse.xCoursePrice = {} as XCourse.xCoursePrice;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private xCoursePrice_Service: xCoursePrice_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   // console.log("Subscribe xCoursePrice"); 
        this.subscription=this.AppService.currentxCourseDesc.subscribe(si =>{ this.refreshxCoursePrice(); }, error => { this.ShowError(error.message); } );
        this.refreshxCoursePrice();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
		   // console.log("Unsubscribe xCoursePrice"); 
        this.subscription.unsubscribe();
    }

    refreshxCoursePrice() {
		let item:XCourse.xCourseDesc;
		item=this.AppService.LastxCourseDesc;
		console.log("refreshing xCoursePrice"); 
     this.currentxCoursePrice = {} as XCourse.xCoursePrice;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.xCoursePrice_Service.get_xCoursePriceByParent('00000000-0000-0000-0000-000000000000').subscribe(xCoursePriceArray => { this.xCoursePriceArray = xCoursePriceArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xCourseDescId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.xCoursePrice_Service.get_xCoursePriceByParent('00000000-0000-0000-0000-000000000000').subscribe(xCoursePriceArray => { this.xCoursePriceArray = xCoursePriceArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xCourseDescId === 'string' ) {
        this.xCoursePrice_Service.get_xCoursePriceByParent(item.xCourseDescId).subscribe(xCoursePriceArray => { this.xCoursePriceArray = xCoursePriceArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxCoursePrice();
		return this.xCoursePriceArray ;
	   }

    onSelect(item: XCourse.xCoursePrice) {
        this.currentxCoursePrice = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastxCourseDesc.xCourseDescId) === 'string' ) {
        this.currentxCoursePrice = {} as XCourse.xCoursePrice;
        this.currentxCoursePrice.xCourseDescId = this.AppService.LastxCourseDesc.xCourseDescId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XCourse.xCoursePrice) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentxCoursePrice = item;
    }

    onDelete(item: XCourse.xCoursePrice) {
        this.confirmOpened = true;
        this.currentxCoursePrice = item;
    }

    onConfirmDeletion() {
        this.xCoursePrice_Service.delete_xCoursePriceById(this.currentxCoursePrice.xCoursePriceId).subscribe(data => {this.refreshxCoursePrice()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XCourse.xCoursePrice) {
        this.valid=true; 
     if(this.currentxCoursePrice.priceDate == undefined ) this.valid=false;
     if(this.currentxCoursePrice.price == undefined  ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xCoursePrice_Service.create_xCoursePrice(item)
                        .subscribe(data =>{ this.refreshxCoursePrice()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xCoursePrice_Service.update_xCoursePrice( item)
                        .subscribe(data => {this.refreshxCoursePrice()}, error => { this.ShowError(error.message); });
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
        for(var i = 0; i < this.xCoursePriceArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xCoursePriceArray[i].priceDate;
            aoa[i+1][1]=this.xCoursePriceArray[i].price;
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
        XLSX.utils.book_append_sheet(wb, ws, 'xCoursePrice');
        

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
		XLSX.writeFile(wb, 'xCoursePrice.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxCoursePrice = {} as XCourse.xCoursePrice;
    }
}
 
