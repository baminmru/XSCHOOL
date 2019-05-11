import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XCourseDesc_Service } from "app/XCourseDesc.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XCourse } from "app/XCourse";


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
     this.AppService.refreshComboXLevel();
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
     if(this.currentXCourseDesc.theLevel == undefined ) this.valid=false;
     if(this.currentXCourseDesc.theVendor == undefined ) this.valid=false;
     if(this.currentXCourseDesc.StudentGuide == undefined || this.currentXCourseDesc.StudentGuide=='') this.valid=false;
     if(this.currentXCourseDesc.IsActive == undefined ) this.valid=false;
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

    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentXCourseDesc = {} as XCourse.XCourseDesc;
        console.log("clear selection for XCourseDesc");
        this.AppService.pushSelectedXCourseDesc(this.currentXCourseDesc);
    }
}
 
