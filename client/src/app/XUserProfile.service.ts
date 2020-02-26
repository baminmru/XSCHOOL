import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XUser} from './XUser';
@Injectable()
export class xUserProfile_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xUserProfiles
    getAll_xUserProfiles(): Observable<XUser.xUserProfile[]> {
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
			return this.http.get<XUser.xUserProfile[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XUser.xUserProfile[]>(this.serviceURL + '/xUserProfile/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
		
	}
 
	   //Create xUserProfile
    create_xUserProfile(xUserProfile: XUser.xUserProfile): Observable<XUser.xUserProfile > {
       // xUserProfile.xUserProfileId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<XUser.xUserProfile >(this.serviceURL + '/xUserProfile/', xUserProfile, { headers: cpHeaders })
		
    }
	
	//Fetch xUserProfile by parent
    get_xUserProfileByParent(parentId: string): Observable<XUser.xUserProfile[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/xUserProfile/byparent/'+ parentId)
        return this.http.get<XUser.xUserProfile[]>(this.serviceURL + '/xUserProfile/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch xUserProfile by id
    get_xUserProfileById(xUserProfileId: string): Observable<XUser.xUserProfile> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xUserProfile/'+ xUserProfileId)
        return this.http.get<XUser.xUserProfile>(this.serviceURL + '/xUserProfile/' + xUserProfileId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xUserProfile
    update_xUserProfile(xUserProfile: XUser.xUserProfile):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xUserProfile/' + xUserProfile.xUserProfileId, xUserProfile, { headers: cpHeaders })
    }
	
    //Delete xUserProfile	
    delete_xUserProfileById(xUserProfileId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xUserProfile/' + xUserProfileId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XUser.xUserProfile = null;
	
	public 	get Selected():XUser.xUserProfile{ return this.mSelecetd;}
	
	public  set Selected(_xUserProfile:XUser.xUserProfile){ this.mSelecetd=_xUserProfile; }
 
}
