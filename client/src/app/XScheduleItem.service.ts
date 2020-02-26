import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XSchedule} from './XSchedule';
@Injectable()
export class xScheduleItem_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	fromDate:string = '';
	toDate:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xScheduleItems
    getAll_xScheduleItems(): Observable<XSchedule.xScheduleItem[]> {
		var qry:string;
		qry='';
		
		if(this.fromDate!=''){
			if(qry !='') qry=qry +'&';
			qry='fromDate='+encodeURIComponent(this.fromDate)
		}
		if(this.toDate!=''){
			if(qry !='') qry=qry +'&';
			qry='toDate='+encodeURIComponent(this.toDate)
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
			return this.http.get<XSchedule.xScheduleItem[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XSchedule.xScheduleItem[]>(this.serviceURL + '/xScheduleItem/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.fromDate = '';
	this.toDate = '';
		
	}
 
	   //Create xScheduleItem
    create_xScheduleItem(xScheduleItem: XSchedule.xScheduleItem): Observable<XSchedule.xScheduleItem > {
       // xScheduleItem.xScheduleItemId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<XSchedule.xScheduleItem >(this.serviceURL + '/xScheduleItem/', xScheduleItem, { headers: cpHeaders })
		
    }
	
	//Fetch xScheduleItem by id
    get_xScheduleItemById(xScheduleItemId: string): Observable<XSchedule.xScheduleItem> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xScheduleItem/'+ xScheduleItemId)
        return this.http.get<XSchedule.xScheduleItem>(this.serviceURL + '/xScheduleItem/' + xScheduleItemId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xScheduleItem
    update_xScheduleItem(xScheduleItem: XSchedule.xScheduleItem):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xScheduleItem/' + xScheduleItem.xScheduleItemId, xScheduleItem, { headers: cpHeaders })
    }
	
    //Delete xScheduleItem	
    delete_xScheduleItemById(xScheduleItemId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xScheduleItem/' + xScheduleItemId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XSchedule.xScheduleItem = null;
	
	public 	get Selected():XSchedule.xScheduleItem{ return this.mSelecetd;}
	
	public  set Selected(_xScheduleItem:XSchedule.xScheduleItem){ this.mSelecetd=_xScheduleItem; }
 
}
