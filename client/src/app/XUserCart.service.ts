import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XUser} from './XUser';
@Injectable()
export class XUserCart_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	FromDate:string = '';
	ToDate:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all XUserCarts
    getAll_XUserCarts(): Observable<XUser.XUserCart[]> {
		var qry:string;
		qry='';
		
		if(this.FromDate!=''){
			if(qry !='') qry=qry +'&';
			qry='FromDate='+encodeURIComponent(this.FromDate)
		}
		if(this.ToDate!=''){
			if(qry !='') qry=qry +'&';
			qry='ToDate='+encodeURIComponent(this.ToDate)
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
			return this.http.get<XUser.XUserCart[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XUser.XUserCart[]>(this.serviceURL + '/XUserCart/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.FromDate = '';
	this.ToDate = '';
		
	}
 
	   //Create XUserCart
    create_XUserCart(XUserCart: XUser.XUserCart): Observable<Object > {
       // XUserCart.XUserCartId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/XUserCart/', XUserCart, { headers: cpHeaders })
		
    }
	
	//Fetch XUserCart by parent
    get_XUserCartByParent(parentId: string): Observable<XUser.XUserCart[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/XUserCart/byparent/'+ parentId)
        return this.http.get<XUser.XUserCart[]>(this.serviceURL + '/XUserCart/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch XUserCart by id
    get_XUserCartById(XUserCartId: string): Observable<XUser.XUserCart> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/XUserCart/'+ XUserCartId)
        return this.http.get<XUser.XUserCart>(this.serviceURL + '/XUserCart/' + XUserCartId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update XUserCart
    update_XUserCart(XUserCart: XUser.XUserCart):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/XUserCart/' + XUserCart.XUserCartId, XUserCart, { headers: cpHeaders })
    }
	
    //Delete XUserCart	
    delete_XUserCartById(XUserCartId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/XUserCart/' + XUserCartId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XUser.XUserCart = null;
	
	public 	get Selected():XUser.XUserCart{ return this.mSelecetd;}
	
	public  set Selected(_XUserCart:XUser.XUserCart){ this.mSelecetd=_XUserCart; }
 
}
