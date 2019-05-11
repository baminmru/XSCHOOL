import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XDict} from './XDict';
@Injectable()
export class XSubscriptionType_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all XSubscriptionTypes
    getAll_XSubscriptionTypes(): Observable<XDict.XSubscriptionType[]> {
		var qry:string;
		qry='';
		
		if(this.name!=''){
			if(qry !='') qry=qry +'&';
			qry='name='+encodeURIComponent(this.name)
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
			return this.http.get<XDict.XSubscriptionType[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XDict.XSubscriptionType[]>(this.serviceURL + '/XSubscriptionType/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
		
	}
 
	   //Create XSubscriptionType
    create_XSubscriptionType(XSubscriptionType: XDict.XSubscriptionType): Observable<Object > {
       // XSubscriptionType.XSubscriptionTypeId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/XSubscriptionType/', XSubscriptionType, { headers: cpHeaders })
		
    }
	
	//Fetch XSubscriptionType by id
    get_XSubscriptionTypeById(XSubscriptionTypeId: string): Observable<XDict.XSubscriptionType> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/XSubscriptionType/'+ XSubscriptionTypeId)
        return this.http.get<XDict.XSubscriptionType>(this.serviceURL + '/XSubscriptionType/' + XSubscriptionTypeId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update XSubscriptionType
    update_XSubscriptionType(XSubscriptionType: XDict.XSubscriptionType):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/XSubscriptionType/' + XSubscriptionType.XSubscriptionTypeId, XSubscriptionType, { headers: cpHeaders })
    }
	
    //Delete XSubscriptionType	
    delete_XSubscriptionTypeById(XSubscriptionTypeId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/XSubscriptionType/' + XSubscriptionTypeId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XDict.XSubscriptionType = null;
	
	public 	get Selected():XDict.XSubscriptionType{ return this.mSelecetd;}
	
	public  set Selected(_XSubscriptionType:XDict.XSubscriptionType){ this.mSelecetd=_XSubscriptionType; }
 
}
