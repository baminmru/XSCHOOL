import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XCourse} from './XCourse';
@Injectable()
export class xCoursePrice_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	priceDate:string = '';
	price:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xCoursePrices
    getAll_xCoursePrices(): Observable<XCourse.xCoursePrice[]> {
		var qry:string;
		qry='';
		
		if(this.priceDate!=''){
			if(qry !='') qry=qry +'&';
			qry='priceDate='+encodeURIComponent(this.priceDate)
		}
		if(this.price!=''){
			if(qry !='') qry=qry +'&';
			qry='price='+encodeURIComponent(this.price)
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
			return this.http.get<XCourse.xCoursePrice[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XCourse.xCoursePrice[]>(this.serviceURL + '/xCoursePrice/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.priceDate = '';
	this.price = '';
		
	}
 
	   //Create xCoursePrice
    create_xCoursePrice(xCoursePrice: XCourse.xCoursePrice): Observable<XCourse.xCoursePrice > {
       // xCoursePrice.xCoursePriceId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<XCourse.xCoursePrice >(this.serviceURL + '/xCoursePrice/', xCoursePrice, { headers: cpHeaders })
		
    }
	
	//Fetch xCoursePrice by parent
    get_xCoursePriceByParent(parentId: string): Observable<XCourse.xCoursePrice[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/xCoursePrice/byparent/'+ parentId)
        return this.http.get<XCourse.xCoursePrice[]>(this.serviceURL + '/xCoursePrice/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch xCoursePrice by id
    get_xCoursePriceById(xCoursePriceId: string): Observable<XCourse.xCoursePrice> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xCoursePrice/'+ xCoursePriceId)
        return this.http.get<XCourse.xCoursePrice>(this.serviceURL + '/xCoursePrice/' + xCoursePriceId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xCoursePrice
    update_xCoursePrice(xCoursePrice: XCourse.xCoursePrice):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xCoursePrice/' + xCoursePrice.xCoursePriceId, xCoursePrice, { headers: cpHeaders })
    }
	
    //Delete xCoursePrice	
    delete_xCoursePriceById(xCoursePriceId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xCoursePrice/' + xCoursePriceId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XCourse.xCoursePrice = null;
	
	public 	get Selected():XCourse.xCoursePrice{ return this.mSelecetd;}
	
	public  set Selected(_xCoursePrice:XCourse.xCoursePrice){ this.mSelecetd=_xCoursePrice; }
 
}
