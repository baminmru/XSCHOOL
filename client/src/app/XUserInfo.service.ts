import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XUser} from './XUser';
@Injectable()
export class XUserInfo_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	Family:string = '';
	Login:string = '';
	SurName:string = '';
	EMail:string = '';
	Phone:string = '';
	Name:string = '';
	Birthday:string = '';
	Password:string = '';
	City:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all XUserInfos
    getAll_XUserInfos(): Observable<XUser.XUserInfo[]> {
		var qry:string;
		qry='';
		
		if(this.Family!=''){
			if(qry !='') qry=qry +'&';
			qry='Family='+encodeURIComponent(this.Family)
		}
		if(this.Login!=''){
			if(qry !='') qry=qry +'&';
			qry='Login='+encodeURIComponent(this.Login)
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
		if(this.Name!=''){
			if(qry !='') qry=qry +'&';
			qry='Name='+encodeURIComponent(this.Name)
		}
		if(this.Birthday!=''){
			if(qry !='') qry=qry +'&';
			qry='Birthday='+encodeURIComponent(this.Birthday)
		}
		if(this.Password!=''){
			if(qry !='') qry=qry +'&';
			qry='Password='+encodeURIComponent(this.Password)
		}
		if(this.City!=''){
			if(qry !='') qry=qry +'&';
			qry='City='+encodeURIComponent(this.City)
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
			return this.http.get<XUser.XUserInfo[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XUser.XUserInfo[]>(this.serviceURL + '/XUserInfo/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.Family = '';
	this.Login = '';
	this.SurName = '';
	this.EMail = '';
	this.Phone = '';
	this.Name = '';
	this.Birthday = '';
	this.Password = '';
	this.City = '';
		
	}
 
	   //Create XUserInfo
    create_XUserInfo(XUserInfo: XUser.XUserInfo): Observable<Object > {
       // XUserInfo.XUserInfoId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/XUserInfo/', XUserInfo, { headers: cpHeaders })
		
    }
	
	//Fetch XUserInfo by id
    get_XUserInfoById(XUserInfoId: string): Observable<XUser.XUserInfo> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/XUserInfo/'+ XUserInfoId)
        return this.http.get<XUser.XUserInfo>(this.serviceURL + '/XUserInfo/' + XUserInfoId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update XUserInfo
    update_XUserInfo(XUserInfo: XUser.XUserInfo):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/XUserInfo/' + XUserInfo.XUserInfoId, XUserInfo, { headers: cpHeaders })
    }
	
    //Delete XUserInfo	
    delete_XUserInfoById(XUserInfoId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/XUserInfo/' + XUserInfoId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XUser.XUserInfo = null;
	
	public 	get Selected():XUser.XUserInfo{ return this.mSelecetd;}
	
	public  set Selected(_XUserInfo:XUser.XUserInfo){ this.mSelecetd=_XUserInfo; }
 
}
