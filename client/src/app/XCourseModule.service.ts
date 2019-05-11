import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XCourse} from './XCourse';
@Injectable()
export class XCourseModule_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	info:string = '';
	reglament:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all XCourseModules
    getAll_XCourseModules(): Observable<XCourse.XCourseModule[]> {
		var qry:string;
		qry='';
		
		if(this.name!=''){
			if(qry !='') qry=qry +'&';
			qry='name='+encodeURIComponent(this.name)
		}
		if(this.info!=''){
			if(qry !='') qry=qry +'&';
			qry='info='+encodeURIComponent(this.info)
		}
		if(this.reglament!=''){
			if(qry !='') qry=qry +'&';
			qry='reglament='+encodeURIComponent(this.reglament)
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
			return this.http.get<XCourse.XCourseModule[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XCourse.XCourseModule[]>(this.serviceURL + '/XCourseModule/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
	this.info = '';
	this.reglament = '';
		
	}
 
	   //Create XCourseModule
    create_XCourseModule(XCourseModule: XCourse.XCourseModule): Observable<Object > {
       // XCourseModule.XCourseModuleId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/XCourseModule/', XCourseModule, { headers: cpHeaders })
		
    }
	
	//Fetch XCourseModule by parent
    get_XCourseModuleByParent(parentId: string): Observable<XCourse.XCourseModule[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/XCourseModule/byparent/'+ parentId)
        return this.http.get<XCourse.XCourseModule[]>(this.serviceURL + '/XCourseModule/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch XCourseModule by id
    get_XCourseModuleById(XCourseModuleId: string): Observable<XCourse.XCourseModule> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/XCourseModule/'+ XCourseModuleId)
        return this.http.get<XCourse.XCourseModule>(this.serviceURL + '/XCourseModule/' + XCourseModuleId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update XCourseModule
    update_XCourseModule(XCourseModule: XCourse.XCourseModule):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/XCourseModule/' + XCourseModule.XCourseModuleId, XCourseModule, { headers: cpHeaders })
    }
	
    //Delete XCourseModule	
    delete_XCourseModuleById(XCourseModuleId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/XCourseModule/' + XCourseModuleId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XCourse.XCourseModule = null;
	
	public 	get Selected():XCourse.XCourseModule{ return this.mSelecetd;}
	
	public  set Selected(_XCourseModule:XCourse.XCourseModule){ this.mSelecetd=_XCourseModule; }
 
}
