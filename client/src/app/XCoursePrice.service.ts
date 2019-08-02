import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XCourse} from './XCourse';
@Injectable()
export class XCoursePrice_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	PriceDate:string = '';
	Price:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all XCoursePrices
    getAll_XCoursePrices(): Observable<XCourse.XCoursePrice[]> {
		var qry:string;
		qry='';
		
		if(this.PriceDate!=''){
			if(qry !='') qry=qry +'&';
			qry='PriceDate='+encodeURIComponent(this.PriceDate)
		}
		if(this.Price!=''){
			if(qry !='') qry=qry +'&';
			qry='Price='+encodeURIComponent(this.Price)
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
			return this.http.get<XCourse.XCoursePrice[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XCourse.XCoursePrice[]>(this.serviceURL + '/XCoursePrice/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.PriceDate = '';
	this.Price = '';
		
	}
 
	   //Create XCoursePrice
    create_XCoursePrice(XCoursePrice: XCourse.XCoursePrice): Observable<Object > {
       // XCoursePrice.XCoursePriceId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/XCoursePrice/', XCoursePrice, { headers: cpHeaders })
		
    }
	
	//Fetch XCoursePrice by parent
    get_XCoursePriceByParent(parentId: string): Observable<XCourse.XCoursePrice[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/XCoursePrice/byparent/'+ parentId)
        return this.http.get<XCourse.XCoursePrice[]>(this.serviceURL + '/XCoursePrice/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch XCoursePrice by id
    get_XCoursePriceById(XCoursePriceId: string): Observable<XCourse.XCoursePrice> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/XCoursePrice/'+ XCoursePriceId)
        return this.http.get<XCourse.XCoursePrice>(this.serviceURL + '/XCoursePrice/' + XCoursePriceId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update XCoursePrice
    update_XCoursePrice(XCoursePrice: XCourse.XCoursePrice):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/XCoursePrice/' + XCoursePrice.XCoursePriceId, XCoursePrice, { headers: cpHeaders })
    }
	
    //Delete XCoursePrice	
    delete_XCoursePriceById(XCoursePriceId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/XCoursePrice/' + XCoursePriceId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XCourse.XCoursePrice = null;
	
	public 	get Selected():XCourse.XCoursePrice{ return this.mSelecetd;}
	
	public  set Selected(_XCoursePrice:XCourse.XCoursePrice){ this.mSelecetd=_XCoursePrice; }
 
}
