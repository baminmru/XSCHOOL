import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XDict} from './XDict';
@Injectable()
export class xStatus_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xStatuss
    getAll_xStatuss(): Observable<XDict.xStatus[]> {
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
			return this.http.get<XDict.xStatus[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XDict.xStatus[]>(this.serviceURL + '/xStatus/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
		
	}
 
	   //Create xStatus
    create_xStatus(xStatus: XDict.xStatus): Observable<XDict.xStatus > {
       // xStatus.xStatusId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<XDict.xStatus >(this.serviceURL + '/xStatus/', xStatus, { headers: cpHeaders })
		
    }
	
	//Fetch xStatus by id
    get_xStatusById(xStatusId: string): Observable<XDict.xStatus> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xStatus/'+ xStatusId)
        return this.http.get<XDict.xStatus>(this.serviceURL + '/xStatus/' + xStatusId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xStatus
    update_xStatus(xStatus: XDict.xStatus):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xStatus/' + xStatus.xStatusId, xStatus, { headers: cpHeaders })
    }
	
    //Delete xStatus	
    delete_xStatusById(xStatusId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xStatus/' + xStatusId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XDict.xStatus = null;
	
	public 	get Selected():XDict.xStatus{ return this.mSelecetd;}
	
	public  set Selected(_xStatus:XDict.xStatus){ this.mSelecetd=_xStatus; }
 
}
