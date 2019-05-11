import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XCourse} from './XCourse';
@Injectable()
export class XChepter_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	mainText:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all XChepters
    getAll_XChepters(): Observable<XCourse.XChepter[]> {
		var qry:string;
		qry='';
		
		if(this.name!=''){
			if(qry !='') qry=qry +'&';
			qry='name='+encodeURIComponent(this.name)
		}
		if(this.mainText!=''){
			if(qry !='') qry=qry +'&';
			qry='mainText='+encodeURIComponent(this.mainText)
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
			return this.http.get<XCourse.XChepter[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XCourse.XChepter[]>(this.serviceURL + '/XChepter/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
	this.mainText = '';
		
	}
 
	   //Create XChepter
    create_XChepter(XChepter: XCourse.XChepter): Observable<Object > {
       // XChepter.XChepterId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/XChepter/', XChepter, { headers: cpHeaders })
		
    }
	
	//Fetch XChepter by parent
    get_XChepterByParent(parentId: string): Observable<XCourse.XChepter[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/XChepter/byparent/'+ parentId)
        return this.http.get<XCourse.XChepter[]>(this.serviceURL + '/XChepter/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch XChepter by id
    get_XChepterById(XChepterId: string): Observable<XCourse.XChepter> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/XChepter/'+ XChepterId)
        return this.http.get<XCourse.XChepter>(this.serviceURL + '/XChepter/' + XChepterId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update XChepter
    update_XChepter(XChepter: XCourse.XChepter):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/XChepter/' + XChepter.XChepterId, XChepter, { headers: cpHeaders })
    }
	
    //Delete XChepter	
    delete_XChepterById(XChepterId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/XChepter/' + XChepterId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XCourse.XChepter = null;
	
	public 	get Selected():XCourse.XChepter{ return this.mSelecetd;}
	
	public  set Selected(_XChepter:XCourse.XChepter){ this.mSelecetd=_XChepter; }
 
}
