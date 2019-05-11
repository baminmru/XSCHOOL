import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XInstructor} from './XInstructor';
@Injectable()
export class XInstructorInfo_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	Family:string = '';
	Name:string = '';
	SurName:string = '';
	EMail:string = '';
	Phone:string = '';
	LocalPhone:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all XInstructorInfos
    getAll_XInstructorInfos(): Observable<XInstructor.XInstructorInfo[]> {
		var qry:string;
		qry='';
		
		if(this.Family!=''){
			if(qry !='') qry=qry +'&';
			qry='Family='+encodeURIComponent(this.Family)
		}
		if(this.Name!=''){
			if(qry !='') qry=qry +'&';
			qry='Name='+encodeURIComponent(this.Name)
		}
		if(this.SurName!=''){
			if(qry !='') qry=qry +'&';
			qry='SurName='+encodeURIComponent(this.SurName)
		}
		if(this.EMail!=''){
			if(qry !='') qry=qry +'&';
			qry='EMail='+encodeURIComponent(this.EMail)
		}
		if(this.Phone!=''){
			if(qry !='') qry=qry +'&';
			qry='Phone='+encodeURIComponent(this.Phone)
		}
		if(this.LocalPhone!=''){
			if(qry !='') qry=qry +'&';
			qry='LocalPhone='+encodeURIComponent(this.LocalPhone)
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
			return this.http.get<XInstructor.XInstructorInfo[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XInstructor.XInstructorInfo[]>(this.serviceURL + '/XInstructorInfo/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.Family = '';
	this.Name = '';
	this.SurName = '';
	this.EMail = '';
	this.Phone = '';
	this.LocalPhone = '';
		
	}
 
	   //Create XInstructorInfo
    create_XInstructorInfo(XInstructorInfo: XInstructor.XInstructorInfo): Observable<Object > {
       // XInstructorInfo.XInstructorInfoId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/XInstructorInfo/', XInstructorInfo, { headers: cpHeaders })
		
    }
	
	//Fetch XInstructorInfo by id
    get_XInstructorInfoById(XInstructorInfoId: string): Observable<XInstructor.XInstructorInfo> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/XInstructorInfo/'+ XInstructorInfoId)
        return this.http.get<XInstructor.XInstructorInfo>(this.serviceURL + '/XInstructorInfo/' + XInstructorInfoId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update XInstructorInfo
    update_XInstructorInfo(XInstructorInfo: XInstructor.XInstructorInfo):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/XInstructorInfo/' + XInstructorInfo.XInstructorInfoId, XInstructorInfo, { headers: cpHeaders })
    }
	
    //Delete XInstructorInfo	
    delete_XInstructorInfoById(XInstructorInfoId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/XInstructorInfo/' + XInstructorInfoId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XInstructor.XInstructorInfo = null;
	
	public 	get Selected():XInstructor.XInstructorInfo{ return this.mSelecetd;}
	
	public  set Selected(_XInstructorInfo:XInstructor.XInstructorInfo){ this.mSelecetd=_XInstructorInfo; }
 
}
