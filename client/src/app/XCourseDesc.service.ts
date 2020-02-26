import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XCourse} from './XCourse';
@Injectable()
export class xCourseDesc_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	courseCode:string = '';
	name:string = '';
	imageUrl:string = '';
	courseDescription:string = '';
	studentGuide:string = '';
	labGuide:string = '';
	price:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xCourseDescs
    getAll_xCourseDescs(): Observable<XCourse.xCourseDesc[]> {
		var qry:string;
		qry='';
		
		if(this.courseCode!=''){
			if(qry !='') qry=qry +'&';
			qry='courseCode='+encodeURIComponent(this.courseCode)
		}
		if(this.name!=''){
			if(qry !='') qry=qry +'&';
			qry='name='+encodeURIComponent(this.name)
		}
		if(this.imageUrl!=''){
			if(qry !='') qry=qry +'&';
			qry='imageUrl='+encodeURIComponent(this.imageUrl)
		}
		if(this.courseDescription!=''){
			if(qry !='') qry=qry +'&';
			qry='courseDescription='+encodeURIComponent(this.courseDescription)
		}
		if(this.studentGuide!=''){
			if(qry !='') qry=qry +'&';
			qry='studentGuide='+encodeURIComponent(this.studentGuide)
		}
		if(this.labGuide!=''){
			if(qry !='') qry=qry +'&';
			qry='labGuide='+encodeURIComponent(this.labGuide)
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
			return this.http.get<XCourse.xCourseDesc[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XCourse.xCourseDesc[]>(this.serviceURL + '/xCourseDesc/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.courseCode = '';
	this.name = '';
	this.imageUrl = '';
	this.courseDescription = '';
	this.studentGuide = '';
	this.labGuide = '';
	this.price = '';
		
	}
 
	   //Create xCourseDesc
    create_xCourseDesc(xCourseDesc: XCourse.xCourseDesc): Observable<XCourse.xCourseDesc > {
       // xCourseDesc.xCourseDescId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<XCourse.xCourseDesc >(this.serviceURL + '/xCourseDesc/', xCourseDesc, { headers: cpHeaders })
		
    }
	
	//Fetch xCourseDesc by id
    get_xCourseDescById(xCourseDescId: string): Observable<XCourse.xCourseDesc> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xCourseDesc/'+ xCourseDescId)
        return this.http.get<XCourse.xCourseDesc>(this.serviceURL + '/xCourseDesc/' + xCourseDescId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xCourseDesc
    update_xCourseDesc(xCourseDesc: XCourse.xCourseDesc):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xCourseDesc/' + xCourseDesc.xCourseDescId, xCourseDesc, { headers: cpHeaders })
    }
	
    //Delete xCourseDesc	
    delete_xCourseDescById(xCourseDescId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xCourseDesc/' + xCourseDescId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XCourse.xCourseDesc = null;
	
	public 	get Selected():XCourse.xCourseDesc{ return this.mSelecetd;}
	
	public  set Selected(_xCourseDesc:XCourse.xCourseDesc){ this.mSelecetd=_xCourseDesc; }
 
}
