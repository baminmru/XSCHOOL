import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XEDUPROG} from './XEDUPROG';
@Injectable()
export class xeduprog_info_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	theDescription:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xeduprog_infos
    getAll_xeduprog_infos(): Observable<XEDUPROG.xeduprog_info[]> {
		var qry:string;
		qry='';
		
		if(this.name!=''){
			if(qry !='') qry=qry +'&';
			qry='name='+encodeURIComponent(this.name)
		}
		if(this.theDescription!=''){
			if(qry !='') qry=qry +'&';
			qry='theDescription='+encodeURIComponent(this.theDescription)
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
			return this.http.get<XEDUPROG.xeduprog_info[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XEDUPROG.xeduprog_info[]>(this.serviceURL + '/xeduprog_info/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
	this.theDescription = '';
		
	}
 
	   //Create xeduprog_info
    create_xeduprog_info(xeduprog_info: XEDUPROG.xeduprog_info): Observable<Object > {
       // xeduprog_info.xeduprog_infoId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/xeduprog_info/', xeduprog_info, { headers: cpHeaders })
		
    }
	
	//Fetch xeduprog_info by id
    get_xeduprog_infoById(xeduprog_infoId: string): Observable<XEDUPROG.xeduprog_info> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xeduprog_info/'+ xeduprog_infoId)
        return this.http.get<XEDUPROG.xeduprog_info>(this.serviceURL + '/xeduprog_info/' + xeduprog_infoId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xeduprog_info
    update_xeduprog_info(xeduprog_info: XEDUPROG.xeduprog_info):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xeduprog_info/' + xeduprog_info.xeduprog_infoId, xeduprog_info, { headers: cpHeaders })
    }
	
    //Delete xeduprog_info	
    delete_xeduprog_infoById(xeduprog_infoId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xeduprog_info/' + xeduprog_infoId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XEDUPROG.xeduprog_info = null;
	
	public 	get Selected():XEDUPROG.xeduprog_info{ return this.mSelecetd;}
	
	public  set Selected(_xeduprog_info:XEDUPROG.xeduprog_info){ this.mSelecetd=_xeduprog_info; }
 
}
