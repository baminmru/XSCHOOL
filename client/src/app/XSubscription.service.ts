import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XUser} from './XUser';
@Injectable()
export class XSubscription_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	FromDate:string = '';
	ToDate:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all XSubscriptions
    getAll_XSubscriptions(): Observable<XUser.XSubscription[]> {
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
			return this.http.get<XUser.XSubscription[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XUser.XSubscription[]>(this.serviceURL + '/XSubscription/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.FromDate = '';
	this.ToDate = '';
		
	}
 
	   //Create XSubscription
    create_XSubscription(XSubscription: XUser.XSubscription): Observable<Object > {
       // XSubscription.XSubscriptionId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/XSubscription/', XSubscription, { headers: cpHeaders })
		
    }
	
	//Fetch XSubscription by parent
    get_XSubscriptionByParent(parentId: string): Observable<XUser.XSubscription[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/XSubscription/byparent/'+ parentId)
        return this.http.get<XUser.XSubscription[]>(this.serviceURL + '/XSubscription/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch XSubscription by id
    get_XSubscriptionById(XSubscriptionId: string): Observable<XUser.XSubscription> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/XSubscription/'+ XSubscriptionId)
        return this.http.get<XUser.XSubscription>(this.serviceURL + '/XSubscription/' + XSubscriptionId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update XSubscription
    update_XSubscription(XSubscription: XUser.XSubscription):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/XSubscription/' + XSubscription.XSubscriptionId, XSubscription, { headers: cpHeaders })
    }
	
    //Delete XSubscription	
    delete_XSubscriptionById(XSubscriptionId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/XSubscription/' + XSubscriptionId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XUser.XSubscription = null;
	
	public 	get Selected():XUser.XSubscription{ return this.mSelecetd;}
	
	public  set Selected(_XSubscription:XUser.XSubscription){ this.mSelecetd=_XSubscription; }
 
}
