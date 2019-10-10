import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XUserCart_Service } from "app/XUserCart.service";
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
	   selector: 'app-XUserCart',
    styleUrls: ['./XUserCart.component.scss'],
    templateUrl: './XUserCart.component.html',
})
export class XUserCartComponent implements OnInit {

    XUserCartArray: Array<XUser.XUserCart> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXUserCart: XUser.XUserCart = {} as XUser.XUserCart;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private XUserCart_Service: XUserCart_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   console.log("Subscribe XUserCart"); 
        this.subscription=this.AppService.currentXUserInfo.subscribe(si =>{ this.refreshXUserCart(); }, error => { this.ShowError(error.message); } );
        this.refreshXUserCart();
    }
    refreshCombo() {
     this.AppService.refreshComboXCourseDesc();
     this.AppService.refreshComboXSubscriptionType();
    }
    ngOnDestroy() {
		   console.log("Unsubscribe XUserCart"); 
        this.subscription.unsubscribe();
    }

    refreshXUserCart() {
		let item:XUser.XUserInfo;
		item=this.AppService.LastXUserInfo;
		console.log("refreshing XUserCart"); 
     this.currentXUserCart = {} as XUser.XUserCart;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.XUserCart_Service.get_XUserCartByParent('00000000-0000-0000-0000-000000000000').subscribe(XUserCartArray => { this.XUserCartArray = XUserCartArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XUserInfoId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.XUserCart_Service.get_XUserCartByParent('00000000-0000-0000-0000-000000000000').subscribe(XUserCartArray => { this.XUserCartArray = XUserCartArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XUserInfoId === 'string' ) {
        this.XUserCart_Service.get_XUserCartByParent(item.XUserInfoId).subscribe(XUserCartArray => { this.XUserCartArray = XUserCartArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXUserCart();
		return this.XUserCartArray ;
	   }

    onSelect(item: XUser.XUserCart) {
        this.currentXUserCart = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastXUserInfo.XUserInfoId) === 'string' ) {
        this.currentXUserCart = {} as XUser.XUserCart;
        this.currentXUserCart.XUserInfoId = this.AppService.LastXUserInfo.XUserInfoId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XUser.XUserCart) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXUserCart = item;
    }

    onDelete(item: XUser.XUserCart) {
        this.confirmOpened = true;
        this.currentXUserCart = item;
    }

    onConfirmDeletion() {
        this.XUserCart_Service.delete_XUserCartById(this.currentXUserCart.XUserCartId).subscribe(data => {this.refreshXUserCart()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XUser.XUserCart) {
        this.valid=true; 
     if(this.currentXUserCart.theCourse == undefined ) this.valid=false;
     if(this.currentXUserCart.SubscriptionType == undefined ) this.valid=false;
     if(this.currentXUserCart.Price == undefined  ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XUserCart_Service.create_XUserCart(item)
                        .subscribe(data =>{ this.refreshXUserCart()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XUserCart_Service.update_XUserCart( item)
                        .subscribe(data => {this.refreshXUserCart()}, error => { this.ShowError(error.message); });
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
            aoa[0][2]='Цена';
            aoa[0][3]='С';
            aoa[0][4]='По';
/* fill data to array */
        for(var i = 0; i < this.XUserCartArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.XUserCartArray[i].theCourse_name;
            aoa[i+1][1]=this.XUserCartArray[i].SubscriptionType_name;
            aoa[i+1][2]=this.XUserCartArray[i].Price;
            aoa[i+1][3]=this.XUserCartArray[i].FromDate;
            aoa[i+1][4]=this.XUserCartArray[i].ToDate;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 50}
,            {wch: 50}
,            {wch: 20}
,            {wch: 18}
,            {wch: 18}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'XUserCart');
        

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
		XLSX.writeFile(wb, 'XUserCart.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentXUserCart = {} as XUser.XUserCart;
    }
}
 
