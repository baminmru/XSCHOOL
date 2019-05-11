import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XDict} from './XDict';
@Injectable()
export class XStatus_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all XStatuss
    getAll_XStatuss(): Observable<XDict.XStatus[]> {
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
			return this.http.get<XDict.XStatus[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XDict.XStatus[]>(this.serviceURL + '/XStatus/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
		
	}
 
	   //Create XStatus
    create_XStatus(XStatus: XDict.XStatus): Observable<Object > {
       // XStatus.XStatusId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/XStatus/', XStatus, { headers: cpHeaders })
		
    }
	
	//Fetch XStatus by id
    get_XStatusById(XStatusId: string): Observable<XDict.XStatus> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/XStatus/'+ XStatusId)
        return this.http.get<XDict.XStatus>(this.serviceURL + '/XStatus/' + XStatusId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update XStatus
    update_XStatus(XStatus: XDict.XStatus):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/XStatus/' + XStatus.XStatusId, XStatus, { headers: cpHeaders })
    }
	
    //Delete XStatus	
    delete_XStatusById(XStatusId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/XStatus/' + XStatusId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XDict.XStatus = null;
	
	public 	get Selected():XDict.XStatus{ return this.mSelecetd;}
	
	public  set Selected(_XStatus:XDict.XStatus){ this.mSelecetd=_XStatus; }
 
}
