import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XCourse} from './XCourse';
@Injectable()
export class xCourseModule_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	moduleNo:string = '';
	name:string = '';
	info:string = '';
	reglament:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xCourseModules
    getAll_xCourseModules(): Observable<XCourse.xCourseModule[]> {
		var qry:string;
		qry='';
		
		if(this.moduleNo!=''){
			if(qry !='') qry=qry +'&';
			qry='moduleNo='+encodeURIComponent(this.moduleNo)
		}
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
			return this.http.get<XCourse.xCourseModule[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XCourse.xCourseModule[]>(this.serviceURL + '/xCourseModule/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.moduleNo = '';
	this.name = '';
	this.info = '';
	this.reglament = '';
		
	}
 
	   //Create xCourseModule
    create_xCourseModule(xCourseModule: XCourse.xCourseModule): Observable<XCourse.xCourseModule > {
       // xCourseModule.xCourseModuleId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<XCourse.xCourseModule >(this.serviceURL + '/xCourseModule/', xCourseModule, { headers: cpHeaders })
		
    }
	
	//Fetch xCourseModule by parent
    get_xCourseModuleByParent(parentId: string): Observable<XCourse.xCourseModule[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/xCourseModule/byparent/'+ parentId)
        return this.http.get<XCourse.xCourseModule[]>(this.serviceURL + '/xCourseModule/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch xCourseModule by id
    get_xCourseModuleById(xCourseModuleId: string): Observable<XCourse.xCourseModule> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xCourseModule/'+ xCourseModuleId)
        return this.http.get<XCourse.xCourseModule>(this.serviceURL + '/xCourseModule/' + xCourseModuleId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xCourseModule
    update_xCourseModule(xCourseModule: XCourse.xCourseModule):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xCourseModule/' + xCourseModule.xCourseModuleId, xCourseModule, { headers: cpHeaders })
    }
	
    //Delete xCourseModule	
    delete_xCourseModuleById(xCourseModuleId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xCourseModule/' + xCourseModuleId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XCourse.xCourseModule = null;
	
	public 	get Selected():XCourse.xCourseModule{ return this.mSelecetd;}
	
	public  set Selected(_xCourseModule:XCourse.xCourseModule){ this.mSelecetd=_xCourseModule; }
 
}
