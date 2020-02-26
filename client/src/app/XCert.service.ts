import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XDict} from './XDict';
@Injectable()
export class xCert_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xCerts
    getAll_xCerts(): Observable<XDict.xCert[]> {
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
			return this.http.get<XDict.xCert[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XDict.xCert[]>(this.serviceURL + '/xCert/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
		
	}
 
	   //Create xCert
    create_xCert(xCert: XDict.xCert): Observable<XDict.xCert > {
       // xCert.xCertId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<XDict.xCert >(this.serviceURL + '/xCert/', xCert, { headers: cpHeaders })
		
    }
	
	//Fetch xCert by id
    get_xCertById(xCertId: string): Observable<XDict.xCert> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xCert/'+ xCertId)
        return this.http.get<XDict.xCert>(this.serviceURL + '/xCert/' + xCertId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xCert
    update_xCert(xCert: XDict.xCert):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xCert/' + xCert.xCertId, xCert, { headers: cpHeaders })
    }
	
    //Delete xCert	
    delete_xCertById(xCertId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xCert/' + xCertId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XDict.xCert = null;
	
	public 	get Selected():XDict.xCert{ return this.mSelecetd;}
	
	public  set Selected(_xCert:XDict.xCert){ this.mSelecetd=_xCert; }
 
}
