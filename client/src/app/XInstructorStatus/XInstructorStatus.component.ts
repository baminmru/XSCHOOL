import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XInstructorStatus_Service } from "app/XInstructorStatus.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XInstructor } from "app/XInstructor";


const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-XInstructorStatus',
    styleUrls: ['./XInstructorStatus.component.scss'],
    templateUrl: './XInstructorStatus.component.html',
})
export class XInstructorStatusComponent implements OnInit {

    XInstructorStatusArray: Array<XInstructor.XInstructorStatus> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXInstructorStatus: XInstructor.XInstructorStatus = {} as XInstructor.XInstructorStatus;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private XInstructorStatus_Service: XInstructorStatus_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   console.log("Subscribe XInstructorStatus"); 
        this.subscription=this.AppService.currentXInstructorInfo.subscribe(si =>{ this.refreshXInstructorStatus(); }, error => { this.ShowError(error.message); } );
        this.refreshXInstructorStatus();
    }
    refreshCombo() {
     this.AppService.refreshComboXStatus();
    }
    ngOnDestroy() {
		   console.log("Unsubscribe XInstructorStatus"); 
        this.subscription.unsubscribe();
    }

    refreshXInstructorStatus() {
		let item:XInstructor.XInstructorInfo;
		item=this.AppService.LastXInstructorInfo;
		console.log("refreshing XInstructorStatus"); 
     this.currentXInstructorStatus = {} as XInstructor.XInstructorStatus;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.XInstructorStatus_Service.get_XInstructorStatusByParent('00000000-0000-0000-0000-000000000000').subscribe(XInstructorStatusArray => { this.XInstructorStatusArray = XInstructorStatusArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XInstructorInfoId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.XInstructorStatus_Service.get_XInstructorStatusByParent('00000000-0000-0000-0000-000000000000').subscribe(XInstructorStatusArray => { this.XInstructorStatusArray = XInstructorStatusArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XInstructorInfoId === 'string' ) {
        this.XInstructorStatus_Service.get_XInstructorStatusByParent(item.XInstructorInfoId).subscribe(XInstructorStatusArray => { this.XInstructorStatusArray = XInstructorStatusArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXInstructorStatus();
		return this.XInstructorStatusArray ;
	   }

    onSelect(item: XInstructor.XInstructorStatus) {
        this.currentXInstructorStatus = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastXInstructorInfo.XInstructorInfoId) === 'string' ) {
        this.currentXInstructorStatus = {} as XInstructor.XInstructorStatus;
        this.currentXInstructorStatus.XInstructorInfoId = this.AppService.LastXInstructorInfo.XInstructorInfoId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XInstructor.XInstructorStatus) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXInstructorStatus = item;
    }

    onDelete(item: XInstructor.XInstructorStatus) {
        this.confirmOpened = true;
        this.currentXInstructorStatus = item;
    }

    onConfirmDeletion() {
        this.XInstructorStatus_Service.delete_XInstructorStatusById(this.currentXInstructorStatus.XInstructorStatusId).subscribe(data => {this.refreshXInstructorStatus()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XInstructor.XInstructorStatus) {
        this.valid=true; 
     if(this.currentXInstructorStatus.theStatus == undefined ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XInstructorStatus_Service.create_XInstructorStatus(item)
                        .subscribe(data =>{ this.refreshXInstructorStatus()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XInstructorStatus_Service.update_XInstructorStatus( item)
                        .subscribe(data => {this.refreshXInstructorStatus()}, error => { this.ShowError(error.message); });
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
        this.currentXInstructorStatus = {} as XInstructor.XInstructorStatus;
    }
}
 
