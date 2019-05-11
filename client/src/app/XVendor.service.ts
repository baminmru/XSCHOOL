import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XDict} from './XDict';
@Injectable()
export class XVendor_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all XVendors
    getAll_XVendors(): Observable<XDict.XVendor[]> {
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
			return this.http.get<XDict.XVendor[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XDict.XVendor[]>(this.serviceURL + '/XVendor/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
		
	}
 
	   //Create XVendor
    create_XVendor(XVendor: XDict.XVendor): Observable<Object > {
       // XVendor.XVendorId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/XVendor/', XVendor, { headers: cpHeaders })
		
    }
	
	//Fetch XVendor by id
    get_XVendorById(XVendorId: string): Observable<XDict.XVendor> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/XVendor/'+ XVendorId)
        return this.http.get<XDict.XVendor>(this.serviceURL + '/XVendor/' + XVendorId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update XVendor
    update_XVendor(XVendor: XDict.XVendor):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/XVendor/' + XVendor.XVendorId, XVendor, { headers: cpHeaders })
    }
	
    //Delete XVendor	
    delete_XVendorById(XVendorId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/XVendor/' + XVendorId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XDict.XVendor = null;
	
	public 	get Selected():XDict.XVendor{ return this.mSelecetd;}
	
	public  set Selected(_XVendor:XDict.XVendor){ this.mSelecetd=_XVendor; }
 
}
