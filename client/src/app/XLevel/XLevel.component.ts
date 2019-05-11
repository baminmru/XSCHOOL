import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XLevel_Service } from "app/XLevel.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XDict } from "app/XDict";


const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-XLevel',
    styleUrls: ['./XLevel.component.scss'],
    templateUrl: './XLevel.component.html',
})
export class XLevelComponent implements OnInit {

    XLevelArray: Array<XDict.XLevel> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXLevel: XDict.XLevel = {} as XDict.XLevel;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private XLevel_Service: XLevel_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshXLevel();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshXLevel() {
		   console.log("refreshing XLevel"); 
        this.XLevel_Service.getAll_XLevels().subscribe(XLevelArray => { this.XLevelArray = XLevelArray; }, error => { this.ShowError(error.message); })
        this.currentXLevel = {} as XDict.XLevel;
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXLevel();
		return this.XLevelArray ;
	   }

    onSelect(item: XDict.XLevel) {
        this.currentXLevel = item;
    }

    onNew() {
    this.refreshCombo(); 
        this.currentXLevel = {} as XDict.XLevel;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XDict.XLevel) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXLevel = item;
    }

    onDelete(item: XDict.XLevel) {
        this.confirmOpened = true;
        this.currentXLevel = item;
    }

    onConfirmDeletion() {
        this.XLevel_Service.delete_XLevelById(this.currentXLevel.XLevelId).subscribe(data => {this.refreshXLevel()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XDict.XLevel) {
        this.valid=true; 
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XLevel_Service.create_XLevel(item)
                        .subscribe(data =>{ this.refreshXLevel()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XLevel_Service.update_XLevel( item)
                        .subscribe(data => {this.refreshXLevel()}, error => { this.ShowError(error.message); });
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
        this.currentXLevel = {} as XDict.XLevel;
    }
}
 
