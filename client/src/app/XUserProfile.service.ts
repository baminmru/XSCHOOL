import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XUser} from './XUser';
@Injectable()
export class XUserProfile_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all XUserProfiles
    getAll_XUserProfiles(): Observable<XUser.XUserProfile[]> {
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
			return this.http.get<XUser.XUserProfile[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XUser.XUserProfile[]>(this.serviceURL + '/XUserProfile/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
		
	}
 
	   //Create XUserProfile
    create_XUserProfile(XUserProfile: XUser.XUserProfile): Observable<Object > {
       // XUserProfile.XUserProfileId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/XUserProfile/', XUserProfile, { headers: cpHeaders })
		
    }
	
	//Fetch XUserProfile by parent
    get_XUserProfileByParent(parentId: string): Observable<XUser.XUserProfile[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/XUserProfile/byparent/'+ parentId)
        return this.http.get<XUser.XUserProfile[]>(this.serviceURL + '/XUserProfile/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch XUserProfile by id
    get_XUserProfileById(XUserProfileId: string): Observable<XUser.XUserProfile> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/XUserProfile/'+ XUserProfileId)
        return this.http.get<XUser.XUserProfile>(this.serviceURL + '/XUserProfile/' + XUserProfileId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update XUserProfile
    update_XUserProfile(XUserProfile: XUser.XUserProfile):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/XUserProfile/' + XUserProfile.XUserProfileId, XUserProfile, { headers: cpHeaders })
    }
	
    //Delete XUserProfile	
    delete_XUserProfileById(XUserProfileId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/XUserProfile/' + XUserProfileId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XUser.XUserProfile = null;
	
	public 	get Selected():XUser.XUserProfile{ return this.mSelecetd;}
	
	public  set Selected(_XUserProfile:XUser.XUserProfile){ this.mSelecetd=_XUserProfile; }
 
}
