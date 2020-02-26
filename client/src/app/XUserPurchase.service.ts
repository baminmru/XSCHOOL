import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XUser} from './XUser';
@Injectable()
export class xUserPurchase_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xUserPurchases
    getAll_xUserPurchases(): Observable<XUser.xUserPurchase[]> {
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
			return this.http.get<XUser.xUserPurchase[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XUser.xUserPurchase[]>(this.serviceURL + '/xUserPurchase/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
		
	}
 
	   //Create xUserPurchase
    create_xUserPurchase(xUserPurchase: XUser.xUserPurchase): Observable<XUser.xUserPurchase > {
       // xUserPurchase.xUserPurchaseId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<XUser.xUserPurchase >(this.serviceURL + '/xUserPurchase/', xUserPurchase, { headers: cpHeaders })
		
    }
	
	//Fetch xUserPurchase by parent
    get_xUserPurchaseByParent(parentId: string): Observable<XUser.xUserPurchase[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/xUserPurchase/byparent/'+ parentId)
        return this.http.get<XUser.xUserPurchase[]>(this.serviceURL + '/xUserPurchase/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch xUserPurchase by id
    get_xUserPurchaseById(xUserPurchaseId: string): Observable<XUser.xUserPurchase> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xUserPurchase/'+ xUserPurchaseId)
        return this.http.get<XUser.xUserPurchase>(this.serviceURL + '/xUserPurchase/' + xUserPurchaseId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xUserPurchase
    update_xUserPurchase(xUserPurchase: XUser.xUserPurchase):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xUserPurchase/' + xUserPurchase.xUserPurchaseId, xUserPurchase, { headers: cpHeaders })
    }
	
    //Delete xUserPurchase	
    delete_xUserPurchaseById(xUserPurchaseId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xUserPurchase/' + xUserPurchaseId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XUser.xUserPurchase = null;
	
	public 	get Selected():XUser.xUserPurchase{ return this.mSelecetd;}
	
	public  set Selected(_xUserPurchase:XUser.xUserPurchase){ this.mSelecetd=_xUserPurchase; }
 
}
