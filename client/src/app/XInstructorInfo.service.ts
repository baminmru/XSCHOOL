import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XInstructor} from './XInstructor';
@Injectable()
export class xInstructorInfo_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	family:string = '';
	name:string = '';
	middleName:string = '';
	eMail:string = '';
	phone:string = '';
	photoUrl:string = '';
	localPhone:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xInstructorInfos
    getAll_xInstructorInfos(): Observable<XInstructor.xInstructorInfo[]> {
		var qry:string;
		qry='';
		
		if(this.family!=''){
			if(qry !='') qry=qry +'&';
			qry='family='+encodeURIComponent(this.family)
		}
		if(this.name!=''){
			if(qry !='') qry=qry +'&';
			qry='name='+encodeURIComponent(this.name)
		}
		if(this.middleName!=''){
			if(qry !='') qry=qry +'&';
			qry='middleName='+encodeURIComponent(this.middleName)
		}
		if(this.eMail!=''){
			if(qry !='') qry=qry +'&';
			qry='eMail='+encodeURIComponent(this.eMail)
		}
		if(this.phone!=''){
			if(qry !='') qry=qry +'&';
			qry='phone='+encodeURIComponent(this.phone)
		}
		if(this.photoUrl!=''){
			if(qry !='') qry=qry +'&';
			qry='photoUrl='+encodeURIComponent(this.photoUrl)
		}
		if(this.localPhone!=''){
			if(qry !='') qry=qry +'&';
			qry='localPhone='+encodeURIComponent(this.localPhone)
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
			return this.http.get<XInstructor.xInstructorInfo[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XInstructor.xInstructorInfo[]>(this.serviceURL + '/xInstructorInfo/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.family = '';
	this.name = '';
	this.middleName = '';
	this.eMail = '';
	this.phone = '';
	this.photoUrl = '';
	this.localPhone = '';
		
	}
 
	   //Create xInstructorInfo
    create_xInstructorInfo(xInstructorInfo: XInstructor.xInstructorInfo): Observable<XInstructor.xInstructorInfo > {
       // xInstructorInfo.xInstructorInfoId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<XInstructor.xInstructorInfo >(this.serviceURL + '/xInstructorInfo/', xInstructorInfo, { headers: cpHeaders })
		
    }
	
	//Fetch xInstructorInfo by id
    get_xInstructorInfoById(xInstructorInfoId: string): Observable<XInstructor.xInstructorInfo> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xInstructorInfo/'+ xInstructorInfoId)
        return this.http.get<XInstructor.xInstructorInfo>(this.serviceURL + '/xInstructorInfo/' + xInstructorInfoId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xInstructorInfo
    update_xInstructorInfo(xInstructorInfo: XInstructor.xInstructorInfo):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xInstructorInfo/' + xInstructorInfo.xInstructorInfoId, xInstructorInfo, { headers: cpHeaders })
    }
	
    //Delete xInstructorInfo	
    delete_xInstructorInfoById(xInstructorInfoId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xInstructorInfo/' + xInstructorInfoId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XInstructor.xInstructorInfo = null;
	
	public 	get Selected():XInstructor.xInstructorInfo{ return this.mSelecetd;}
	
	public  set Selected(_xInstructorInfo:XInstructor.xInstructorInfo){ this.mSelecetd=_xInstructorInfo; }
 
}
