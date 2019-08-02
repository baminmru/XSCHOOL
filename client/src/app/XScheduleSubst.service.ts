import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XSchedule} from './XSchedule';
@Injectable()
export class XScheduleSubst_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	FromDate:string = '';
	ToDate:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all XScheduleSubsts
    getAll_XScheduleSubsts(): Observable<XSchedule.XScheduleSubst[]> {
		var qry:string;
		qry='';
		
		if(this.FromDate!=''){
			if(qry !='') qry=qry +'&';
			qry='FromDate='+encodeURIComponent(this.FromDate)
		}
		if(this.ToDate!=''){
			if(qry !='') qry=qry +'&';
			qry='ToDate='+encodeURIComponent(this.ToDate)
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
			return this.http.get<XSchedule.XScheduleSubst[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XSchedule.XScheduleSubst[]>(this.serviceURL + '/XScheduleSubst/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.FromDate = '';
	this.ToDate = '';
		
	}
 
	   //Create XScheduleSubst
    create_XScheduleSubst(XScheduleSubst: XSchedule.XScheduleSubst): Observable<Object > {
       // XScheduleSubst.XScheduleSubstId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/XScheduleSubst/', XScheduleSubst, { headers: cpHeaders })
		
    }
	
	//Fetch XScheduleSubst by parent
    get_XScheduleSubstByParent(parentId: string): Observable<XSchedule.XScheduleSubst[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/XScheduleSubst/byparent/'+ parentId)
        return this.http.get<XSchedule.XScheduleSubst[]>(this.serviceURL + '/XScheduleSubst/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch XScheduleSubst by id
    get_XScheduleSubstById(XScheduleSubstId: string): Observable<XSchedule.XScheduleSubst> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/XScheduleSubst/'+ XScheduleSubstId)
        return this.http.get<XSchedule.XScheduleSubst>(this.serviceURL + '/XScheduleSubst/' + XScheduleSubstId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update XScheduleSubst
    update_XScheduleSubst(XScheduleSubst: XSchedule.XScheduleSubst):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/XScheduleSubst/' + XScheduleSubst.XScheduleSubstId, XScheduleSubst, { headers: cpHeaders })
    }
	
    //Delete XScheduleSubst	
    delete_XScheduleSubstById(XScheduleSubstId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/XScheduleSubst/' + XScheduleSubstId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XSchedule.XScheduleSubst = null;
	
	public 	get Selected():XSchedule.XScheduleSubst{ return this.mSelecetd;}
	
	public  set Selected(_XScheduleSubst:XSchedule.XScheduleSubst){ this.mSelecetd=_XScheduleSubst; }
 
}
