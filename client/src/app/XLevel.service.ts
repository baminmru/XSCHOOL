import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XDict} from './XDict';
@Injectable()
export class xLevel_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xLevels
    getAll_xLevels(): Observable<XDict.xLevel[]> {
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
			return this.http.get<XDict.xLevel[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XDict.xLevel[]>(this.serviceURL + '/xLevel/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
		
	}
 
	   //Create xLevel
    create_xLevel(xLevel: XDict.xLevel): Observable<XDict.xLevel > {
       // xLevel.xLevelId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<XDict.xLevel >(this.serviceURL + '/xLevel/', xLevel, { headers: cpHeaders })
		
    }
	
	//Fetch xLevel by id
    get_xLevelById(xLevelId: string): Observable<XDict.xLevel> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xLevel/'+ xLevelId)
        return this.http.get<XDict.xLevel>(this.serviceURL + '/xLevel/' + xLevelId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xLevel
    update_xLevel(xLevel: XDict.xLevel):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xLevel/' + xLevel.xLevelId, xLevel, { headers: cpHeaders })
    }
	
    //Delete xLevel	
    delete_xLevelById(xLevelId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xLevel/' + xLevelId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XDict.xLevel = null;
	
	public 	get Selected():XDict.xLevel{ return this.mSelecetd;}
	
	public  set Selected(_xLevel:XDict.xLevel){ this.mSelecetd=_xLevel; }
 
}
