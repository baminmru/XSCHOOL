import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XCourse} from './XCourse';
@Injectable()
export class xChepter_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	sequence:string = '';
	name:string = '';
	mainText:string = '';
	refFile:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xChepters
    getAll_xChepters(): Observable<XCourse.xChepter[]> {
		var qry:string;
		qry='';
		
		if(this.sequence!=''){
			if(qry !='') qry=qry +'&';
			qry='sequence='+encodeURIComponent(this.sequence)
		}
		if(this.name!=''){
			if(qry !='') qry=qry +'&';
			qry='name='+encodeURIComponent(this.name)
		}
		if(this.mainText!=''){
			if(qry !='') qry=qry +'&';
			qry='mainText='+encodeURIComponent(this.mainText)
		}
		if(this.refFile!=''){
			if(qry !='') qry=qry +'&';
			qry='refFile='+encodeURIComponent(this.refFile)
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
			return this.http.get<XCourse.xChepter[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XCourse.xChepter[]>(this.serviceURL + '/xChepter/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.sequence = '';
	this.name = '';
	this.mainText = '';
	this.refFile = '';
		
	}
 
	   //Create xChepter
    create_xChepter(xChepter: XCourse.xChepter): Observable<XCourse.xChepter > {
       // xChepter.xChepterId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<XCourse.xChepter >(this.serviceURL + '/xChepter/', xChepter, { headers: cpHeaders })
		
    }
	
	//Fetch xChepter by parent
    get_xChepterByParent(parentId: string): Observable<XCourse.xChepter[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/xChepter/byparent/'+ parentId)
        return this.http.get<XCourse.xChepter[]>(this.serviceURL + '/xChepter/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch xChepter by id
    get_xChepterById(xChepterId: string): Observable<XCourse.xChepter> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xChepter/'+ xChepterId)
        return this.http.get<XCourse.xChepter>(this.serviceURL + '/xChepter/' + xChepterId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xChepter
    update_xChepter(xChepter: XCourse.xChepter):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xChepter/' + xChepter.xChepterId, xChepter, { headers: cpHeaders })
    }
	
    //Delete xChepter	
    delete_xChepterById(xChepterId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xChepter/' + xChepterId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XCourse.xChepter = null;
	
	public 	get Selected():XCourse.xChepter{ return this.mSelecetd;}
	
	public  set Selected(_xChepter:XCourse.xChepter){ this.mSelecetd=_xChepter; }
 
}
