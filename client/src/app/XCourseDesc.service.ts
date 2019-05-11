import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XCourse} from './XCourse';
@Injectable()
export class XCourseDesc_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	CourseDescription:string = '';
	StudentGuide:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all XCourseDescs
    getAll_XCourseDescs(): Observable<XCourse.XCourseDesc[]> {
		var qry:string;
		qry='';
		
		if(this.name!=''){
			if(qry !='') qry=qry +'&';
			qry='name='+encodeURIComponent(this.name)
		}
		if(this.CourseDescription!=''){
			if(qry !='') qry=qry +'&';
			qry='CourseDescription='+encodeURIComponent(this.CourseDescription)
		}
		if(this.StudentGuide!=''){
			if(qry !='') qry=qry +'&';
			qry='StudentGuide='+encodeURIComponent(this.StudentGuide)
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
			return this.http.get<XCourse.XCourseDesc[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XCourse.XCourseDesc[]>(this.serviceURL + '/XCourseDesc/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
	this.CourseDescription = '';
	this.StudentGuide = '';
		
	}
 
	   //Create XCourseDesc
    create_XCourseDesc(XCourseDesc: XCourse.XCourseDesc): Observable<Object > {
       // XCourseDesc.XCourseDescId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/XCourseDesc/', XCourseDesc, { headers: cpHeaders })
		
    }
	
	//Fetch XCourseDesc by id
    get_XCourseDescById(XCourseDescId: string): Observable<XCourse.XCourseDesc> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/XCourseDesc/'+ XCourseDescId)
        return this.http.get<XCourse.XCourseDesc>(this.serviceURL + '/XCourseDesc/' + XCourseDescId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update XCourseDesc
    update_XCourseDesc(XCourseDesc: XCourse.XCourseDesc):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/XCourseDesc/' + XCourseDesc.XCourseDescId, XCourseDesc, { headers: cpHeaders })
    }
	
    //Delete XCourseDesc	
    delete_XCourseDescById(XCourseDescId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/XCourseDesc/' + XCourseDescId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XCourse.XCourseDesc = null;
	
	public 	get Selected():XCourse.XCourseDesc{ return this.mSelecetd;}
	
	public  set Selected(_XCourseDesc:XCourse.XCourseDesc){ this.mSelecetd=_XCourseDesc; }
 
}
