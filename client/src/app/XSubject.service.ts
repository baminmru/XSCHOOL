import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XDict} from './XDict';
@Injectable()
export class xSubject_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xSubjects
    getAll_xSubjects(): Observable<XDict.xSubject[]> {
		var qry:string;
		qry='';
		
		if(this.name!=''){
			if(qry !='') qry=qry +'&';
			qry='name='+encodeURIComponent(this.name)
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
			return this.http.get<XDict.xSubject[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XDict.xSubject[]>(this.serviceURL + '/xSubject/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
		
	}
 
	   //Create xSubject
    create_xSubject(xSubject: XDict.xSubject): Observable<XDict.xSubject > {
       // xSubject.xSubjectId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<XDict.xSubject >(this.serviceURL + '/xSubject/', xSubject, { headers: cpHeaders })
		
    }
	
	//Fetch xSubject by id
    get_xSubjectById(xSubjectId: string): Observable<XDict.xSubject> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xSubject/'+ xSubjectId)
        return this.http.get<XDict.xSubject>(this.serviceURL + '/xSubject/' + xSubjectId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xSubject
    update_xSubject(xSubject: XDict.xSubject):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xSubject/' + xSubject.xSubjectId, xSubject, { headers: cpHeaders })
    }
	
    //Delete xSubject	
    delete_xSubjectById(xSubjectId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xSubject/' + xSubjectId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XDict.xSubject = null;
	
	public 	get Selected():XDict.xSubject{ return this.mSelecetd;}
	
	public  set Selected(_xSubject:XDict.xSubject){ this.mSelecetd=_xSubject; }
 
}
