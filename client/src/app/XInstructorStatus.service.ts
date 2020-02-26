import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XInstructor} from './XInstructor';
@Injectable()
export class xInstructorStatus_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	sequence:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xInstructorStatuss
    getAll_xInstructorStatuss(): Observable<XInstructor.xInstructorStatus[]> {
		var qry:string;
		qry='';
		
		if(this.sequence!=''){
			if(qry !='') qry=qry +'&';
			qry='sequence='+encodeURIComponent(this.sequence)
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
			return this.http.get<XInstructor.xInstructorStatus[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XInstructor.xInstructorStatus[]>(this.serviceURL + '/xInstructorStatus/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.sequence = '';
		
	}
 
	   //Create xInstructorStatus
    create_xInstructorStatus(xInstructorStatus: XInstructor.xInstructorStatus): Observable<XInstructor.xInstructorStatus > {
       // xInstructorStatus.xInstructorStatusId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<XInstructor.xInstructorStatus >(this.serviceURL + '/xInstructorStatus/', xInstructorStatus, { headers: cpHeaders })
		
    }
	
	//Fetch xInstructorStatus by parent
    get_xInstructorStatusByParent(parentId: string): Observable<XInstructor.xInstructorStatus[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/xInstructorStatus/byparent/'+ parentId)
        return this.http.get<XInstructor.xInstructorStatus[]>(this.serviceURL + '/xInstructorStatus/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch xInstructorStatus by id
    get_xInstructorStatusById(xInstructorStatusId: string): Observable<XInstructor.xInstructorStatus> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xInstructorStatus/'+ xInstructorStatusId)
        return this.http.get<XInstructor.xInstructorStatus>(this.serviceURL + '/xInstructorStatus/' + xInstructorStatusId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xInstructorStatus
    update_xInstructorStatus(xInstructorStatus: XInstructor.xInstructorStatus):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xInstructorStatus/' + xInstructorStatus.xInstructorStatusId, xInstructorStatus, { headers: cpHeaders })
    }
	
    //Delete xInstructorStatus	
    delete_xInstructorStatusById(xInstructorStatusId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xInstructorStatus/' + xInstructorStatusId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XInstructor.xInstructorStatus = null;
	
	public 	get Selected():XInstructor.xInstructorStatus{ return this.mSelecetd;}
	
	public  set Selected(_xInstructorStatus:XInstructor.xInstructorStatus){ this.mSelecetd=_xInstructorStatus; }
 
}
