import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XUser} from './XUser';
@Injectable()
export class xSubscription_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	fromDate:string = '';
	toDate:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xSubscriptions
    getAll_xSubscriptions(): Observable<XUser.xSubscription[]> {
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
			return this.http.get<XUser.xSubscription[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XUser.xSubscription[]>(this.serviceURL + '/xSubscription/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.fromDate = '';
	this.toDate = '';
		
	}
 
	   //Create xSubscription
    create_xSubscription(xSubscription: XUser.xSubscription): Observable<XUser.xSubscription > {
       // xSubscription.xSubscriptionId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<XUser.xSubscription >(this.serviceURL + '/xSubscription/', xSubscription, { headers: cpHeaders })
		
    }
	
	//Fetch xSubscription by parent
    get_xSubscriptionByParent(parentId: string): Observable<XUser.xSubscription[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/xSubscription/byparent/'+ parentId)
        return this.http.get<XUser.xSubscription[]>(this.serviceURL + '/xSubscription/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch xSubscription by id
    get_xSubscriptionById(xSubscriptionId: string): Observable<XUser.xSubscription> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xSubscription/'+ xSubscriptionId)
        return this.http.get<XUser.xSubscription>(this.serviceURL + '/xSubscription/' + xSubscriptionId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xSubscription
    update_xSubscription(xSubscription: XUser.xSubscription):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xSubscription/' + xSubscription.xSubscriptionId, xSubscription, { headers: cpHeaders })
    }
	
    //Delete xSubscription	
    delete_xSubscriptionById(xSubscriptionId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xSubscription/' + xSubscriptionId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XUser.xSubscription = null;
	
	public 	get Selected():XUser.xSubscription{ return this.mSelecetd;}
	
	public  set Selected(_xSubscription:XUser.xSubscription){ this.mSelecetd=_xSubscription; }
 
}
