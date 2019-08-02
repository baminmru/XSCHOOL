import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { XCert_Service } from "app/XCert.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XDict } from "app/XDict";


const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-XCert',
    styleUrls: ['./XCert.component.scss'],
    templateUrl: './XCert.component.html',
})
export class XCertComponent implements OnInit {

    XCertArray: Array<XDict.XCert> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentXCert: XDict.XCert = {} as XDict.XCert;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private XCert_Service: XCert_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshXCert();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshXCert() {
		   console.log("refreshing XCert"); 
        this.XCert_Service.getAll_XCerts().subscribe(XCertArray => { this.XCertArray = XCertArray; }, error => { this.ShowError(error.message); })
        this.currentXCert = {} as XDict.XCert;
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshXCert();
		return this.XCertArray ;
	   }

    onSelect(item: XDict.XCert) {
        this.currentXCert = item;
    }

    onNew() {
    this.refreshCombo(); 
        this.currentXCert = {} as XDict.XCert;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XDict.XCert) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentXCert = item;
    }

    onDelete(item: XDict.XCert) {
        this.confirmOpened = true;
        this.currentXCert = item;
    }

    onConfirmDeletion() {
        this.XCert_Service.delete_XCertById(this.currentXCert.XCertId).subscribe(data => {this.refreshXCert()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XDict.XCert) {
        this.valid=true; 
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.XCert_Service.create_XCert(item)
                        .subscribe(data =>{ this.refreshXCert()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.XCert_Service.update_XCert( item)
                        .subscribe(data => {this.refreshXCert()}, error => { this.ShowError(error.message); });
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
        this.currentXCert = {} as XDict.XCert;
    }
}
 
