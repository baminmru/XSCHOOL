import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XDict} from './XDict';
@Injectable()
export class XLevel_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all XLevels
    getAll_XLevels(): Observable<XDict.XLevel[]> {
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
			return this.http.get<XDict.XLevel[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XDict.XLevel[]>(this.serviceURL + '/XLevel/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
		
	}
 
	   //Create XLevel
    create_XLevel(XLevel: XDict.XLevel): Observable<Object > {
       // XLevel.XLevelId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/XLevel/', XLevel, { headers: cpHeaders })
		
    }
	
	//Fetch XLevel by id
    get_XLevelById(XLevelId: string): Observable<XDict.XLevel> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/XLevel/'+ XLevelId)
        return this.http.get<XDict.XLevel>(this.serviceURL + '/XLevel/' + XLevelId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update XLevel
    update_XLevel(XLevel: XDict.XLevel):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/XLevel/' + XLevel.XLevelId, XLevel, { headers: cpHeaders })
    }
	
    //Delete XLevel	
    delete_XLevelById(XLevelId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/XLevel/' + XLevelId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XDict.XLevel = null;
	
	public 	get Selected():XDict.XLevel{ return this.mSelecetd;}
	
	public  set Selected(_XLevel:XDict.XLevel){ this.mSelecetd=_XLevel; }
 
}
