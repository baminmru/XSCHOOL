import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XDict} from './XDict';
@Injectable()
export class XCert_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all XCerts
    getAll_XCerts(): Observable<XDict.XCert[]> {
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
			return this.http.get<XDict.XCert[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XDict.XCert[]>(this.serviceURL + '/XCert/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
		
	}
 
	   //Create XCert
    create_XCert(XCert: XDict.XCert): Observable<Object > {
       // XCert.XCertId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/XCert/', XCert, { headers: cpHeaders })
		
    }
	
	//Fetch XCert by id
    get_XCertById(XCertId: string): Observable<XDict.XCert> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/XCert/'+ XCertId)
        return this.http.get<XDict.XCert>(this.serviceURL + '/XCert/' + XCertId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update XCert
    update_XCert(XCert: XDict.XCert):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/XCert/' + XCert.XCertId, XCert, { headers: cpHeaders })
    }
	
    //Delete XCert	
    delete_XCertById(XCertId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/XCert/' + XCertId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XDict.XCert = null;
	
	public 	get Selected():XDict.XCert{ return this.mSelecetd;}
	
	public  set Selected(_XCert:XDict.XCert){ this.mSelecetd=_XCert; }
 
}
