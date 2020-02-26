import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xLevel_Service } from "app/XLevel.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XDict } from "app/XDict";
import * as XLSX from 'xlsx';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-xLevel',
    styleUrls: ['./XLevel.component.scss'],
    templateUrl: './XLevel.component.html',
})
export class xLevelComponent implements OnInit {

    xLevelArray: Array<XDict.xLevel> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxLevel: XDict.xLevel = {} as XDict.xLevel;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private xLevel_Service: xLevel_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshxLevel();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshxLevel() {
		   console.log("refreshing xLevel"); 
        this.xLevel_Service.getAll_xLevels().subscribe(xLevelArray => { this.xLevelArray = xLevelArray; }, error => { this.ShowError(error.message); })
        this.currentxLevel = {} as XDict.xLevel;
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxLevel();
		return this.xLevelArray ;
	   }

    onSelect(item: XDict.xLevel) {
        this.currentxLevel = item;
    }

    onNew() {
    this.refreshCombo(); 
        this.currentxLevel = {} as XDict.xLevel;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XDict.xLevel) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentxLevel = item;
    }

    onDelete(item: XDict.xLevel) {
        this.confirmOpened = true;
        this.currentxLevel = item;
    }

    onConfirmDeletion() {
        this.xLevel_Service.delete_xLevelById(this.currentxLevel.xLevelId).subscribe(data => {this.refreshxLevel()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XDict.xLevel) {
        this.valid=true; 
     if(this.currentxLevel.name == undefined || this.currentxLevel.name=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xLevel_Service.create_xLevel(item)
                        .subscribe(data =>{ this.refreshxLevel()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xLevel_Service.update_xLevel( item)
                        .subscribe(data => {this.refreshxLevel()}, error => { this.ShowError(error.message); });
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
            aoa[0][0]='Название';
/* fill data to array */
        for(var i = 0; i < this.xLevelArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xLevelArray[i].name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'xLevel');
        

        wb.Props = {
            Title: "Справочник::Уровень сложности",
            Subject: "Справочник::Уровень сложности",
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
		XLSX.writeFile(wb, 'xLevel.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxLevel = {} as XDict.xLevel;
    }
}
 
