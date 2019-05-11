import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XCourseModule_Service } from "app/XCourseModule.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XCourse } from "app/XCourse";


const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-XCourseModule',
    styleUrls: ['./XCourseModule.component.scss'],
    templateUrl: './XCourseModule.component.html',
})
export class XCourseModuleComponent implements OnInit {

    XCourseModuleArray: Array<XCourse.XCourseModule> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXCourseModule: XCourse.XCourseModule = {} as XCourse.XCourseModule;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private XCourseModule_Service: XCourseModule_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   console.log("Subscribe XCourseModule"); 
        this.subscription=this.AppService.currentXCourseDesc.subscribe(si =>{ this.refreshXCourseModule(); }, error => { this.ShowError(error.message); } );
        this.refreshXCourseModule();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
		   console.log("Unsubscribe XCourseModule"); 
        this.subscription.unsubscribe();
    }

    refreshXCourseModule() {
		let item:XCourse.XCourseDesc;
		item=this.AppService.LastXCourseDesc;
		console.log("refreshing XCourseModule"); 
     this.currentXCourseModule = {} as XCourse.XCourseModule;
     console.log("clear selection for XCourseModule on refresh");
     this.AppService.pushSelectedXCourseModule(this.currentXCourseModule);
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.XCourseModule_Service.get_XCourseModuleByParent('00000000-0000-0000-0000-000000000000').subscribe(XCourseModuleArray => { this.XCourseModuleArray = XCourseModuleArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XCourseDescId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.XCourseModule_Service.get_XCourseModuleByParent('00000000-0000-0000-0000-000000000000').subscribe(XCourseModuleArray => { this.XCourseModuleArray = XCourseModuleArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.XCourseDescId === 'string' ) {
        this.XCourseModule_Service.get_XCourseModuleByParent(item.XCourseDescId).subscribe(XCourseModuleArray => { this.XCourseModuleArray = XCourseModuleArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXCourseModule();
		return this.XCourseModuleArray ;
	   }

    onSelect(item: XCourse.XCourseModule) {
        this.currentXCourseModule = item;
        this.AppService.pushSelectedXCourseModule(item);
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.LastXCourseDesc.XCourseDescId) === 'string' ) {
        this.currentXCourseModule = {} as XCourse.XCourseModule;
        this.currentXCourseModule.XCourseDescId = this.AppService.LastXCourseDesc.XCourseDescId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XCourse.XCourseModule) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXCourseModule = item;
    }

    onDelete(item: XCourse.XCourseModule) {
        this.confirmOpened = true;
        this.currentXCourseModule = item;
    }

    onConfirmDeletion() {
        this.XCourseModule_Service.delete_XCourseModuleById(this.currentXCourseModule.XCourseModuleId).subscribe(data => {this.refreshXCourseModule()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XCourse.XCourseModule) {
        this.valid=true; 
     if(this.currentXCourseModule.info == undefined || this.currentXCourseModule.info=='') this.valid=false;
     if(this.currentXCourseModule.reglament == undefined || this.currentXCourseModule.reglament=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XCourseModule_Service.create_XCourseModule(item)
                        .subscribe(data =>{ this.refreshXCourseModule()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XCourseModule_Service.update_XCourseModule( item)
                        .subscribe(data => {this.refreshXCourseModule()}, error => { this.ShowError(error.message); });
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
        this.currentXCourseModule = {} as XCourse.XCourseModule;
        console.log("clear selection for XCourseModule");
        this.AppService.pushSelectedXCourseModule(this.currentXCourseModule);
    }
}
 
