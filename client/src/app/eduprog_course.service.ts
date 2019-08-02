import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XEDUPROG} from './XEDUPROG';
@Injectable()
export class eduprog_course_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all eduprog_courses
    getAll_eduprog_courses(): Observable<XEDUPROG.eduprog_course[]> {
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
			return this.http.get<XEDUPROG.eduprog_course[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XEDUPROG.eduprog_course[]>(this.serviceURL + '/eduprog_course/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
		
	}
 
	   //Create eduprog_course
    create_eduprog_course(eduprog_course: XEDUPROG.eduprog_course): Observable<Object > {
       // eduprog_course.eduprog_courseId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/eduprog_course/', eduprog_course, { headers: cpHeaders })
		
    }
	
	//Fetch eduprog_course by parent
    get_eduprog_courseByParent(parentId: string): Observable<XEDUPROG.eduprog_course[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/eduprog_course/byparent/'+ parentId)
        return this.http.get<XEDUPROG.eduprog_course[]>(this.serviceURL + '/eduprog_course/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch eduprog_course by id
    get_eduprog_courseById(eduprog_courseId: string): Observable<XEDUPROG.eduprog_course> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/eduprog_course/'+ eduprog_courseId)
        return this.http.get<XEDUPROG.eduprog_course>(this.serviceURL + '/eduprog_course/' + eduprog_courseId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update eduprog_course
    update_eduprog_course(eduprog_course: XEDUPROG.eduprog_course):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/eduprog_course/' + eduprog_course.eduprog_courseId, eduprog_course, { headers: cpHeaders })
    }
	
    //Delete eduprog_course	
    delete_eduprog_courseById(eduprog_courseId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/eduprog_course/' + eduprog_courseId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XEDUPROG.eduprog_course = null;
	
	public 	get Selected():XEDUPROG.eduprog_course{ return this.mSelecetd;}
	
	public  set Selected(_eduprog_course:XEDUPROG.eduprog_course){ this.mSelecetd=_eduprog_course; }
 
}
