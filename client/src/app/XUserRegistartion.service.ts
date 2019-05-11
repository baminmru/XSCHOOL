import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XUser} from './XUser';
@Injectable()
export class XUserRegistartion_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all XUserRegistartions
    getAll_XUserRegistartions(): Observable<XUser.XUserRegistartion[]> {
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
			return this.http.get<XUser.XUserRegistartion[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XUser.XUserRegistartion[]>(this.serviceURL + '/XUserRegistartion/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
		
	}
 
	   //Create XUserRegistartion
    create_XUserRegistartion(XUserRegistartion: XUser.XUserRegistartion): Observable<Object > {
       // XUserRegistartion.XUserRegistartionId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/XUserRegistartion/', XUserRegistartion, { headers: cpHeaders })
		
    }
	
	//Fetch XUserRegistartion by parent
    get_XUserRegistartionByParent(parentId: string): Observable<XUser.XUserRegistartion[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/XUserRegistartion/byparent/'+ parentId)
        return this.http.get<XUser.XUserRegistartion[]>(this.serviceURL + '/XUserRegistartion/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch XUserRegistartion by id
    get_XUserRegistartionById(XUserRegistartionId: string): Observable<XUser.XUserRegistartion> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/XUserRegistartion/'+ XUserRegistartionId)
        return this.http.get<XUser.XUserRegistartion>(this.serviceURL + '/XUserRegistartion/' + XUserRegistartionId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update XUserRegistartion
    update_XUserRegistartion(XUserRegistartion: XUser.XUserRegistartion):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/XUserRegistartion/' + XUserRegistartion.XUserRegistartionId, XUserRegistartion, { headers: cpHeaders })
    }
	
    //Delete XUserRegistartion	
    delete_XUserRegistartionById(XUserRegistartionId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/XUserRegistartion/' + XUserRegistartionId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XUser.XUserRegistartion = null;
	
	public 	get Selected():XUser.XUserRegistartion{ return this.mSelecetd;}
	
	public  set Selected(_XUserRegistartion:XUser.XUserRegistartion){ this.mSelecetd=_XUserRegistartion; }
 
}
