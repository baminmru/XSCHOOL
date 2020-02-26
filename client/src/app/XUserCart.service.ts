import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XUser} from './XUser';
@Injectable()
export class xUserCart_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xUserCarts
    getAll_xUserCarts(): Observable<XUser.xUserCart[]> {
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
			return this.http.get<XUser.xUserCart[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XUser.xUserCart[]>(this.serviceURL + '/xUserCart/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
		
	}
 
	   //Create xUserCart
    create_xUserCart(xUserCart: XUser.xUserCart): Observable<XUser.xUserCart > {
       // xUserCart.xUserCartId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<XUser.xUserCart >(this.serviceURL + '/xUserCart/', xUserCart, { headers: cpHeaders })
		
    }
	
	//Fetch xUserCart by parent
    get_xUserCartByParent(parentId: string): Observable<XUser.xUserCart[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/xUserCart/byparent/'+ parentId)
        return this.http.get<XUser.xUserCart[]>(this.serviceURL + '/xUserCart/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch xUserCart by id
    get_xUserCartById(xUserCartId: string): Observable<XUser.xUserCart> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xUserCart/'+ xUserCartId)
        return this.http.get<XUser.xUserCart>(this.serviceURL + '/xUserCart/' + xUserCartId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xUserCart
    update_xUserCart(xUserCart: XUser.xUserCart):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xUserCart/' + xUserCart.xUserCartId, xUserCart, { headers: cpHeaders })
    }
	
    //Delete xUserCart	
    delete_xUserCartById(xUserCartId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xUserCart/' + xUserCartId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XUser.xUserCart = null;
	
	public 	get Selected():XUser.xUserCart{ return this.mSelecetd;}
	
	public  set Selected(_xUserCart:XUser.xUserCart){ this.mSelecetd=_xUserCart; }
 
}
