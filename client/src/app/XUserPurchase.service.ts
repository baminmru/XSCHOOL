import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XUser} from './XUser';
@Injectable()
export class XUserPurchase_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all XUserPurchases
    getAll_XUserPurchases(): Observable<XUser.XUserPurchase[]> {
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
			return this.http.get<XUser.XUserPurchase[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XUser.XUserPurchase[]>(this.serviceURL + '/XUserPurchase/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
		
	}
 
	   //Create XUserPurchase
    create_XUserPurchase(XUserPurchase: XUser.XUserPurchase): Observable<Object > {
       // XUserPurchase.XUserPurchaseId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/XUserPurchase/', XUserPurchase, { headers: cpHeaders })
		
    }
	
	//Fetch XUserPurchase by parent
    get_XUserPurchaseByParent(parentId: string): Observable<XUser.XUserPurchase[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/XUserPurchase/byparent/'+ parentId)
        return this.http.get<XUser.XUserPurchase[]>(this.serviceURL + '/XUserPurchase/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch XUserPurchase by id
    get_XUserPurchaseById(XUserPurchaseId: string): Observable<XUser.XUserPurchase> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/XUserPurchase/'+ XUserPurchaseId)
        return this.http.get<XUser.XUserPurchase>(this.serviceURL + '/XUserPurchase/' + XUserPurchaseId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update XUserPurchase
    update_XUserPurchase(XUserPurchase: XUser.XUserPurchase):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/XUserPurchase/' + XUserPurchase.XUserPurchaseId, XUserPurchase, { headers: cpHeaders })
    }
	
    //Delete XUserPurchase	
    delete_XUserPurchaseById(XUserPurchaseId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/XUserPurchase/' + XUserPurchaseId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XUser.XUserPurchase = null;
	
	public 	get Selected():XUser.XUserPurchase{ return this.mSelecetd;}
	
	public  set Selected(_XUserPurchase:XUser.XUserPurchase){ this.mSelecetd=_XUserPurchase; }
 
}
