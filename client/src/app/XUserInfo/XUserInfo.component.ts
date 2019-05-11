import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XUserInfo_Service } from "app/XUserInfo.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XUser } from "app/XUser";


const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-XUserInfo',
    styleUrls: ['./XUserInfo.component.scss'],
    templateUrl: './XUserInfo.component.html',
})
export class XUserInfoComponent implements OnInit {

    XUserInfoArray: Array<XUser.XUserInfo> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXUserInfo: XUser.XUserInfo = {} as XUser.XUserInfo;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private XUserInfo_Service: XUserInfo_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshXUserInfo();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshXUserInfo() {
		   console.log("refreshing XUserInfo"); 
        this.XUserInfo_Service.getAll_XUserInfos().subscribe(XUserInfoArray => { this.XUserInfoArray = XUserInfoArray; }, error => { this.ShowError(error.message); })
        this.currentXUserInfo = {} as XUser.XUserInfo;
        console.log("clear selection for XUserInfo on refresh");
        this.AppService.pushSelectedXUserInfo(this.currentXUserInfo);
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXUserInfo();
		return this.XUserInfoArray ;
	   }

    onSelect(item: XUser.XUserInfo) {
        this.currentXUserInfo = item;
        this.AppService.pushSelectedXUserInfo(item);
    }

    onNew() {
    this.refreshCombo(); 
        this.currentXUserInfo = {} as XUser.XUserInfo;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XUser.XUserInfo) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXUserInfo = item;
    }

    onDelete(item: XUser.XUserInfo) {
        this.confirmOpened = true;
        this.currentXUserInfo = item;
    }

    onConfirmDeletion() {
        this.XUserInfo_Service.delete_XUserInfoById(this.currentXUserInfo.XUserInfoId).subscribe(data => {this.refreshXUserInfo()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XUser.XUserInfo) {
        this.valid=true; 
     if(this.currentXUserInfo.EMail == undefined || this.currentXUserInfo.EMail=='') this.valid=false;
     if(this.currentXUserInfo.Phone == undefined || this.currentXUserInfo.Phone=='') this.valid=false;
     if(this.currentXUserInfo.Password == undefined || this.currentXUserInfo.Password=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XUserInfo_Service.create_XUserInfo(item)
                        .subscribe(data =>{ this.refreshXUserInfo()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XUserInfo_Service.update_XUserInfo( item)
                        .subscribe(data => {this.refreshXUserInfo()}, error => { this.ShowError(error.message); });
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

    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentXUserInfo = {} as XUser.XUserInfo;
        console.log("clear selection for XUserInfo");
        this.AppService.pushSelectedXUserInfo(this.currentXUserInfo);
    }
}
 
