import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XUser} from './XUser';
@Injectable()
export class xUserRegistartion_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xUserRegistartions
    getAll_xUserRegistartions(): Observable<XUser.xUserRegistartion[]> {
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
			return this.http.get<XUser.xUserRegistartion[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XUser.xUserRegistartion[]>(this.serviceURL + '/xUserRegistartion/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
		
	}
 
	   //Create xUserRegistartion
    create_xUserRegistartion(xUserRegistartion: XUser.xUserRegistartion): Observable<XUser.xUserRegistartion > {
       // xUserRegistartion.xUserRegistartionId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<XUser.xUserRegistartion >(this.serviceURL + '/xUserRegistartion/', xUserRegistartion, { headers: cpHeaders })
		
    }
	
	//Fetch xUserRegistartion by parent
    get_xUserRegistartionByParent(parentId: string): Observable<XUser.xUserRegistartion[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/xUserRegistartion/byparent/'+ parentId)
        return this.http.get<XUser.xUserRegistartion[]>(this.serviceURL + '/xUserRegistartion/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch xUserRegistartion by id
    get_xUserRegistartionById(xUserRegistartionId: string): Observable<XUser.xUserRegistartion> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xUserRegistartion/'+ xUserRegistartionId)
        return this.http.get<XUser.xUserRegistartion>(this.serviceURL + '/xUserRegistartion/' + xUserRegistartionId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xUserRegistartion
    update_xUserRegistartion(xUserRegistartion: XUser.xUserRegistartion):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xUserRegistartion/' + xUserRegistartion.xUserRegistartionId, xUserRegistartion, { headers: cpHeaders })
    }
	
    //Delete xUserRegistartion	
    delete_xUserRegistartionById(xUserRegistartionId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xUserRegistartion/' + xUserRegistartionId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XUser.xUserRegistartion = null;
	
	public 	get Selected():XUser.xUserRegistartion{ return this.mSelecetd;}
	
	public  set Selected(_xUserRegistartion:XUser.xUserRegistartion){ this.mSelecetd=_xUserRegistartion; }
 
}
