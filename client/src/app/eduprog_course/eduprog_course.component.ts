import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { eduprog_course_Service } from "app/eduprog_course.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XEDUPROG } from "app/XEDUPROG";


const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-eduprog_course',
    styleUrls: ['./eduprog_course.component.scss'],
    templateUrl: './eduprog_course.component.html',
})
export class eduprog_courseComponent implements OnInit {

    eduprog_courseArray: Array<XEDUPROG.eduprog_course> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currenteduprog_course: XEDUPROG.eduprog_course = {} as XEDUPROG.eduprog_course;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private eduprog_course_Service: eduprog_course_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   console.log("Subscribe eduprog_course"); 
        this.subscription=this.AppService.currentxeduprog_info.subscribe(si =>{ this.refresheduprog_course(); }, error => { this.ShowError(error.message); } );
        this.refresheduprog_course();
    }
    refreshCombo() {
     this.AppService.refreshComboXCourseDesc();
    }
    ngOnDestroy() {
		   console.log("Unsubscribe eduprog_course"); 
        this.subscription.unsubscribe();
    }

    refresheduprog_course() {
		let item:XEDUPROG.xeduprog_info;
		item=this.AppService.Lastxeduprog_info;
		console.log("refreshing eduprog_course"); 
     this.currenteduprog_course = {} as XEDUPROG.eduprog_course;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.eduprog_course_Service.get_eduprog_courseByParent('00000000-0000-0000-0000-000000000000').subscribe(eduprog_courseArray => { this.eduprog_courseArray = eduprog_courseArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xeduprog_infoId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.eduprog_course_Service.get_eduprog_courseByParent('00000000-0000-0000-0000-000000000000').subscribe(eduprog_courseArray => { this.eduprog_courseArray = eduprog_courseArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.xeduprog_infoId === 'string' ) {
        this.eduprog_course_Service.get_eduprog_courseByParent(item.xeduprog_infoId).subscribe(eduprog_courseArray => { this.eduprog_courseArray = eduprog_courseArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refresheduprog_course();
		return this.eduprog_courseArray ;
	   }

    onSelect(item: XEDUPROG.eduprog_course) {
        this.currenteduprog_course = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.Lastxeduprog_info.xeduprog_infoId) === 'string' ) {
        this.currenteduprog_course = {} as XEDUPROG.eduprog_course;
        this.currenteduprog_course.xeduprog_infoId = this.AppService.Lastxeduprog_info.xeduprog_infoId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: XEDUPROG.eduprog_course) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currenteduprog_course = item;
    }

    onDelete(item: XEDUPROG.eduprog_course) {
        this.confirmOpened = true;
        this.currenteduprog_course = item;
    }

    onConfirmDeletion() {
        this.eduprog_course_Service.delete_eduprog_courseById(this.currenteduprog_course.eduprog_courseId).subscribe(data => {this.refresheduprog_course()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XEDUPROG.eduprog_course) {
        this.valid=true; 
     if(this.currenteduprog_course.Course == undefined ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.eduprog_course_Service.create_eduprog_course(item)
                        .subscribe(data =>{ this.refresheduprog_course()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.eduprog_course_Service.update_eduprog_course( item)
                        .subscribe(data => {this.refresheduprog_course()}, error => { this.ShowError(error.message); });
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
        this.currenteduprog_course = {} as XEDUPROG.eduprog_course;
    }
}
 
