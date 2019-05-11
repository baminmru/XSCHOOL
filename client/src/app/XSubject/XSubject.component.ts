import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XSubject_Service } from "app/XSubject.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XDict } from "app/XDict";


const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-XSubject',
    styleUrls: ['./XSubject.component.scss'],
    templateUrl: './XSubject.component.html',
})
export class XSubjectComponent implements OnInit {

    XSubjectArray: Array<XDict.XSubject> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXSubject: XDict.XSubject = {} as XDict.XSubject;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private XSubject_Service: XSubject_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshXSubject();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshXSubject() {
		   console.log("refreshing XSubject"); 
        this.XSubject_Service.getAll_XSubjects().subscribe(XSubjectArray => { this.XSubjectArray = XSubjectArray; }, error => { this.ShowError(error.message); })
        this.currentXSubject = {} as XDict.XSubject;
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXSubject();
		return this.XSubjectArray ;
	   }

    onSelect(item: XDict.XSubject) {
        this.currentXSubject = item;
    }

    onNew() {
    this.refreshCombo(); 
        this.currentXSubject = {} as XDict.XSubject;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XDict.XSubject) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXSubject = item;
    }

    onDelete(item: XDict.XSubject) {
        this.confirmOpened = true;
        this.currentXSubject = item;
    }

    onConfirmDeletion() {
        this.XSubject_Service.delete_XSubjectById(this.currentXSubject.XSubjectId).subscribe(data => {this.refreshXSubject()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XDict.XSubject) {
        this.valid=true; 
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XSubject_Service.create_XSubject(item)
                        .subscribe(data =>{ this.refreshXSubject()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XSubject_Service.update_XSubject( item)
                        .subscribe(data => {this.refreshXSubject()}, error => { this.ShowError(error.message); });
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
        this.currentXSubject = {} as XDict.XSubject;
    }
}
 
