import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XDict} from './XDict';
@Injectable()
export class xSubscriptionType_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	timerange:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xSubscriptionTypes
    getAll_xSubscriptionTypes(): Observable<XDict.xSubscriptionType[]> {
		var qry:string;
		qry='';
		
		if(this.name!=''){
			if(qry !='') qry=qry +'&';
			qry='name='+encodeURIComponent(this.name)
		}
		if(this.timerange!=''){
			if(qry !='') qry=qry +'&';
			qry='timerange='+encodeURIComponent(this.timerange)
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
			return this.http.get<XDict.xSubscriptionType[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XDict.xSubscriptionType[]>(this.serviceURL + '/xSubscriptionType/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
	this.timerange = '';
		
	}
 
	   //Create xSubscriptionType
    create_xSubscriptionType(xSubscriptionType: XDict.xSubscriptionType): Observable<XDict.xSubscriptionType > {
       // xSubscriptionType.xSubscriptionTypeId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<XDict.xSubscriptionType >(this.serviceURL + '/xSubscriptionType/', xSubscriptionType, { headers: cpHeaders })
		
    }
	
	//Fetch xSubscriptionType by id
    get_xSubscriptionTypeById(xSubscriptionTypeId: string): Observable<XDict.xSubscriptionType> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xSubscriptionType/'+ xSubscriptionTypeId)
        return this.http.get<XDict.xSubscriptionType>(this.serviceURL + '/xSubscriptionType/' + xSubscriptionTypeId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xSubscriptionType
    update_xSubscriptionType(xSubscriptionType: XDict.xSubscriptionType):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xSubscriptionType/' + xSubscriptionType.xSubscriptionTypeId, xSubscriptionType, { headers: cpHeaders })
    }
	
    //Delete xSubscriptionType	
    delete_xSubscriptionTypeById(xSubscriptionTypeId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xSubscriptionType/' + xSubscriptionTypeId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XDict.xSubscriptionType = null;
	
	public 	get Selected():XDict.xSubscriptionType{ return this.mSelecetd;}
	
	public  set Selected(_xSubscriptionType:XDict.xSubscriptionType){ this.mSelecetd=_xSubscriptionType; }
 
}
