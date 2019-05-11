import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XInstructorInfo_Service } from "app/XInstructorInfo.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XInstructor } from "app/XInstructor";


const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-XInstructorInfo',
    styleUrls: ['./XInstructorInfo.component.scss'],
    templateUrl: './XInstructorInfo.component.html',
})
export class XInstructorInfoComponent implements OnInit {

    XInstructorInfoArray: Array<XInstructor.XInstructorInfo> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXInstructorInfo: XInstructor.XInstructorInfo = {} as XInstructor.XInstructorInfo;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private XInstructorInfo_Service: XInstructorInfo_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshXInstructorInfo();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshXInstructorInfo() {
		   console.log("refreshing XInstructorInfo"); 
        this.XInstructorInfo_Service.getAll_XInstructorInfos().subscribe(XInstructorInfoArray => { this.XInstructorInfoArray = XInstructorInfoArray; }, error => { this.ShowError(error.message); })
        this.currentXInstructorInfo = {} as XInstructor.XInstructorInfo;
        console.log("clear selection for XInstructorInfo on refresh");
        this.AppService.pushSelectedXInstructorInfo(this.currentXInstructorInfo);
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXInstructorInfo();
		return this.XInstructorInfoArray ;
	   }

    onSelect(item: XInstructor.XInstructorInfo) {
        this.currentXInstructorInfo = item;
        this.AppService.pushSelectedXInstructorInfo(item);
    }

    onNew() {
    this.refreshCombo(); 
        this.currentXInstructorInfo = {} as XInstructor.XInstructorInfo;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XInstructor.XInstructorInfo) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXInstructorInfo = item;
    }

    onDelete(item: XInstructor.XInstructorInfo) {
        this.confirmOpened = true;
        this.currentXInstructorInfo = item;
    }

    onConfirmDeletion() {
        this.XInstructorInfo_Service.delete_XInstructorInfoById(this.currentXInstructorInfo.XInstructorInfoId).subscribe(data => {this.refreshXInstructorInfo()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XInstructor.XInstructorInfo) {
        this.valid=true; 
     if(this.currentXInstructorInfo.EMail == undefined || this.currentXInstructorInfo.EMail=='') this.valid=false;
     if(this.currentXInstructorInfo.Phone == undefined || this.currentXInstructorInfo.Phone=='') this.valid=false;
     if(this.currentXInstructorInfo.LocalPhone == undefined || this.currentXInstructorInfo.LocalPhone=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XInstructorInfo_Service.create_XInstructorInfo(item)
                        .subscribe(data =>{ this.refreshXInstructorInfo()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XInstructorInfo_Service.update_XInstructorInfo( item)
                        .subscribe(data => {this.refreshXInstructorInfo()}, error => { this.ShowError(error.message); });
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
        this.currentXInstructorInfo = {} as XInstructor.XInstructorInfo;
        console.log("clear selection for XInstructorInfo");
        this.AppService.pushSelectedXInstructorInfo(this.currentXInstructorInfo);
    }
}
 
