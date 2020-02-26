import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XUser} from './XUser';
@Injectable()
export class xUserInfo_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	family:string = '';
	name:string = '';
	middleName:string = '';
	login:string = '';
	password:string = '';
	photoUrl:string = '';
	eMail:string = '';
	phone:string = '';
	birthday:string = '';
	country:string = '';
	city:string = '';
	nativeLanguage:string = '';
	learningYears:string = '';
	learningGoal:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xUserInfos
    getAll_xUserInfos(): Observable<XUser.xUserInfo[]> {
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
		if(this.login!=''){
			if(qry !='') qry=qry +'&';
			qry='login='+encodeURIComponent(this.login)
		}
		if(this.password!=''){
			if(qry !='') qry=qry +'&';
			qry='password='+encodeURIComponent(this.password)
		}
		if(this.photoUrl!=''){
			if(qry !='') qry=qry +'&';
			qry='photoUrl='+encodeURIComponent(this.photoUrl)
		}
		if(this.eMail!=''){
			if(qry !='') qry=qry +'&';
			qry='eMail='+encodeURIComponent(this.eMail)
		}
		if(this.phone!=''){
			if(qry !='') qry=qry +'&';
			qry='phone='+encodeURIComponent(this.phone)
		}
		if(this.birthday!=''){
			if(qry !='') qry=qry +'&';
			qry='birthday='+encodeURIComponent(this.birthday)
		}
		if(this.country!=''){
			if(qry !='') qry=qry +'&';
			qry='country='+encodeURIComponent(this.country)
		}
		if(this.city!=''){
			if(qry !='') qry=qry +'&';
			qry='city='+encodeURIComponent(this.city)
		}
		if(this.nativeLanguage!=''){
			if(qry !='') qry=qry +'&';
			qry='nativeLanguage='+encodeURIComponent(this.nativeLanguage)
		}
		if(this.learningYears!=''){
			if(qry !='') qry=qry +'&';
			qry='learningYears='+encodeURIComponent(this.learningYears)
		}
		if(this.learningGoal!=''){
			if(qry !='') qry=qry +'&';
			qry='learningGoal='+encodeURIComponent(this.learningGoal)
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
			return this.http.get<XUser.xUserInfo[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XUser.xUserInfo[]>(this.serviceURL + '/xUserInfo/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.family = '';
	this.name = '';
	this.middleName = '';
	this.login = '';
	this.password = '';
	this.photoUrl = '';
	this.eMail = '';
	this.phone = '';
	this.birthday = '';
	this.country = '';
	this.city = '';
	this.nativeLanguage = '';
	this.learningYears = '';
	this.learningGoal = '';
		
	}
 
	   //Create xUserInfo
    create_xUserInfo(xUserInfo: XUser.xUserInfo): Observable<XUser.xUserInfo > {
       // xUserInfo.xUserInfoId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<XUser.xUserInfo >(this.serviceURL + '/xUserInfo/', xUserInfo, { headers: cpHeaders })
		
    }
	
	//Fetch xUserInfo by id
    get_xUserInfoById(xUserInfoId: string): Observable<XUser.xUserInfo> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xUserInfo/'+ xUserInfoId)
        return this.http.get<XUser.xUserInfo>(this.serviceURL + '/xUserInfo/' + xUserInfoId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xUserInfo
    update_xUserInfo(xUserInfo: XUser.xUserInfo):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xUserInfo/' + xUserInfo.xUserInfoId, xUserInfo, { headers: cpHeaders })
    }
	
    //Delete xUserInfo	
    delete_xUserInfoById(xUserInfoId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xUserInfo/' + xUserInfoId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XUser.xUserInfo = null;
	
	public 	get Selected():XUser.xUserInfo{ return this.mSelecetd;}
	
	public  set Selected(_xUserInfo:XUser.xUserInfo){ this.mSelecetd=_xUserInfo; }
 
}
