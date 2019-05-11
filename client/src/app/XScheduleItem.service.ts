import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XSchedule} from './XSchedule';
@Injectable()
export class XScheduleItem_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	FromDate:string = '';
	ToDate:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all XScheduleItems
    getAll_XScheduleItems(): Observable<XSchedule.XScheduleItem[]> {
		var qry:string;
		qry='';
		
		if(this.FromDate!=''){
			if(qry !='') qry=qry +'&';
			qry='FromDate='+encodeURIComponent(this.FromDate)
		}
		if(this.ToDate!=''){
			if(qry !='') qry=qry +'&';
			qry='ToDate='+encodeURIComponent(this.ToDate)
		}
		/*
		if(this.PageNo!=null){
			if(qry !='') qry=qry +;
			//qry='page='+this.PageNo;
			qry='_getpagesoffset=' + ((this.PageNo-1) * this.PageSize)+'&_count=' +this.PageSize;
		}
		*/
		
		let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		if(this.PageUrl!=''){
			return this.http.get<XSchedule.XScheduleItem[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XSchedule.XScheduleItem[]>(this.serviceURL + '/XScheduleItem/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.FromDate = '';
	this.ToDate = '';
		
	}
 
	   //Create XScheduleItem
    create_XScheduleItem(XScheduleItem: XSchedule.XScheduleItem): Observable<Object > {
       // XScheduleItem.XScheduleItemId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/XScheduleItem/', XScheduleItem, { headers: cpHeaders })
		
    }
	
	//Fetch XScheduleItem by id
    get_XScheduleItemById(XScheduleItemId: string): Observable<XSchedule.XScheduleItem> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/XScheduleItem/'+ XScheduleItemId)
        return this.http.get<XSchedule.XScheduleItem>(this.serviceURL + '/XScheduleItem/' + XScheduleItemId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update XScheduleItem
    update_XScheduleItem(XScheduleItem: XSchedule.XScheduleItem):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/XScheduleItem/' + XScheduleItem.XScheduleItemId, XScheduleItem, { headers: cpHeaders })
    }
	
    //Delete XScheduleItem	
    delete_XScheduleItemById(XScheduleItemId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/XScheduleItem/' + XScheduleItemId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XSchedule.XScheduleItem = null;
	
	public 	get Selected():XSchedule.XScheduleItem{ return this.mSelecetd;}
	
	public  set Selected(_XScheduleItem:XSchedule.XScheduleItem){ this.mSelecetd=_XScheduleItem; }
 
}
