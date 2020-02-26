import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xUserCart_Service } from "app/XUserCart.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XUser } from "app/XUser";
import * as XLSX from 'xlsx';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-xUserCart',
    styleUrls: ['./XUserCart.component.scss'],
    templateUrl: './XUserCart.component.html',
})
export class xUserCartComponent implements OnInit {

    xUserCartArray: Array<XUser.xUserCart> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxUserCart: XUser.xUserCart = {} as XUser.xUserCart;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private xUserCart_Service: xUserCart_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   // console.log("Subscribe xUserCart"); 
        this.subscription=this.AppService.currentxUserInfo.subscribe(si =>{ this.refreshxUserCart(); }, error => { this.ShowError(error.message); } );
        this.refreshxUserCart();
    }
    refreshCombo() {
     this.AppService.refreshComboXCourseDesc();
     this.AppService.refreshComboXSubscriptionType();
    }
    ngOnDestroy() {
		   // console.log("Unsubscribe xUserCart"); 
        this.subscription.unsubscribe();
    }

    refreshxUserCart() {
		let item:XUser.xUserInfo;
		item=this.AppService.LastxUserInfo;
		console.log("refreshing xUserCart"); 
     this.currentxUserCart = {} as XUser.xUserCart;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.xUserCart_Service.get_xUserCartByParent('00000000-0000-0000-0000-000000000000').subscribe(xUserCartArray => { this.xUserCartArray = xUserCartArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xUserInfoId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.xUserCart_Service.get_xUserCartByParent('00000000-0000-0000-0000-000000000000').subscribe(xUserCartArray => { this.xUserCartArray = xUserCartArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xUserInfoId === 'string' ) {
        this.xUserCart_Service.get_xUserCartByParent(item.xUserInfoId).subscribe(xUserCartArray => { this.xUserCartArray = xUserCartArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxUserCart();
		return this.xUserCartArray ;
	   }

    onSelect(item: XUser.xUserCart) {
        this.currentxUserCart = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastxUserInfo.xUserInfoId) === 'string' ) {
        this.currentxUserCart = {} as XUser.xUserCart;
        this.currentxUserCart.xUserInfoId = this.AppService.LastxUserInfo.xUserInfoId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XUser.xUserCart) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentxUserCart = item;
    }

    onDelete(item: XUser.xUserCart) {
        this.confirmOpened = true;
        this.currentxUserCart = item;
    }

    onConfirmDeletion() {
        this.xUserCart_Service.delete_xUserCartById(this.currentxUserCart.xUserCartId).subscribe(data => {this.refreshxUserCart()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XUser.xUserCart) {
        this.valid=true; 
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xUserCart_Service.create_xUserCart(item)
                        .subscribe(data =>{ this.refreshxUserCart()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xUserCart_Service.update_xUserCart( item)
                        .subscribe(data => {this.refreshxUserCart()}, error => { this.ShowError(error.message); });
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
            aoa[0][0]='Курс';
            aoa[0][1]='Тип подписки';
/* fill data to array */
        for(var i = 0; i < this.xUserCartArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xUserCartArray[i].theCourse_name;
            aoa[i+1][1]=this.xUserCartArray[i].subscriptionType_name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 50}
,            {wch: 50}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'xUserCart');
        

        wb.Props = {
            Title: "Пользователь::Корзина",
            Subject: "Пользователь::Корзина",
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
		XLSX.writeFile(wb, 'xUserCart.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxUserCart = {} as XUser.xUserCart;
    }
}
 
