import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XSchedule} from './XSchedule';
@Injectable()
export class xScheduleSubst_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	fromDate:string = '';
	toDate:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xScheduleSubsts
    getAll_xScheduleSubsts(): Observable<XSchedule.xScheduleSubst[]> {
		var qry:string;
		qry='';
		
		if(this.fromDate!=''){
			if(qry !='') qry=qry +'&';
			qry='fromDate='+encodeURIComponent(this.fromDate)
		}
		if(this.toDate!=''){
			if(qry !='') qry=qry +'&';
			qry='toDate='+encodeURIComponent(this.toDate)
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
			return this.http.get<XSchedule.xScheduleSubst[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XSchedule.xScheduleSubst[]>(this.serviceURL + '/xScheduleSubst/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.fromDate = '';
	this.toDate = '';
		
	}
 
	   //Create xScheduleSubst
    create_xScheduleSubst(xScheduleSubst: XSchedule.xScheduleSubst): Observable<XSchedule.xScheduleSubst > {
       // xScheduleSubst.xScheduleSubstId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<XSchedule.xScheduleSubst >(this.serviceURL + '/xScheduleSubst/', xScheduleSubst, { headers: cpHeaders })
		
    }
	
	//Fetch xScheduleSubst by parent
    get_xScheduleSubstByParent(parentId: string): Observable<XSchedule.xScheduleSubst[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/xScheduleSubst/byparent/'+ parentId)
        return this.http.get<XSchedule.xScheduleSubst[]>(this.serviceURL + '/xScheduleSubst/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch xScheduleSubst by id
    get_xScheduleSubstById(xScheduleSubstId: string): Observable<XSchedule.xScheduleSubst> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xScheduleSubst/'+ xScheduleSubstId)
        return this.http.get<XSchedule.xScheduleSubst>(this.serviceURL + '/xScheduleSubst/' + xScheduleSubstId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xScheduleSubst
    update_xScheduleSubst(xScheduleSubst: XSchedule.xScheduleSubst):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xScheduleSubst/' + xScheduleSubst.xScheduleSubstId, xScheduleSubst, { headers: cpHeaders })
    }
	
    //Delete xScheduleSubst	
    delete_xScheduleSubstById(xScheduleSubstId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xScheduleSubst/' + xScheduleSubstId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XSchedule.xScheduleSubst = null;
	
	public 	get Selected():XSchedule.xScheduleSubst{ return this.mSelecetd;}
	
	public  set Selected(_xScheduleSubst:XSchedule.xScheduleSubst){ this.mSelecetd=_xScheduleSubst; }
 
}
