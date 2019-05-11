import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XInstructor} from './XInstructor';
@Injectable()
export class XInstructorStatus_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all XInstructorStatuss
    getAll_XInstructorStatuss(): Observable<XInstructor.XInstructorStatus[]> {
		var qry:string;
		qry='';
		
		/*
		if(this.PageNo!=null){
			if(qry !='') qry=qry +;
			//qry='page='+this.PageNo;
			qry='_getpagesoffset=' + ((this.PageNo-1) * this.PageSize)+'&_count=' +this.PageSize;
		}
		*/
		
		let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		if(this.PageUrl!=''){
			return this.http.get<XInstructor.XInstructorStatus[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XInstructor.XInstructorStatus[]>(this.serviceURL + '/XInstructorStatus/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
		
	}
 
	   //Create XInstructorStatus
    create_XInstructorStatus(XInstructorStatus: XInstructor.XInstructorStatus): Observable<Object > {
       // XInstructorStatus.XInstructorStatusId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/XInstructorStatus/', XInstructorStatus, { headers: cpHeaders })
		
    }
	
	//Fetch XInstructorStatus by parent
    get_XInstructorStatusByParent(parentId: string): Observable<XInstructor.XInstructorStatus[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/XInstructorStatus/byparent/'+ parentId)
        return this.http.get<XInstructor.XInstructorStatus[]>(this.serviceURL + '/XInstructorStatus/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch XInstructorStatus by id
    get_XInstructorStatusById(XInstructorStatusId: string): Observable<XInstructor.XInstructorStatus> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/XInstructorStatus/'+ XInstructorStatusId)
        return this.http.get<XInstructor.XInstructorStatus>(this.serviceURL + '/XInstructorStatus/' + XInstructorStatusId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update XInstructorStatus
    update_XInstructorStatus(XInstructorStatus: XInstructor.XInstructorStatus):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/XInstructorStatus/' + XInstructorStatus.XInstructorStatusId, XInstructorStatus, { headers: cpHeaders })
    }
	
    //Delete XInstructorStatus	
    delete_XInstructorStatusById(XInstructorStatusId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/XInstructorStatus/' + XInstructorStatusId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XInstructor.XInstructorStatus = null;
	
	public 	get Selected():XInstructor.XInstructorStatus{ return this.mSelecetd;}
	
	public  set Selected(_XInstructorStatus:XInstructor.XInstructorStatus){ this.mSelecetd=_XInstructorStatus; }
 
}
