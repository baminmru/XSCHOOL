import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XDict} from './XDict';
@Injectable()
export class XSubject_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all XSubjects
    getAll_XSubjects(): Observable<XDict.XSubject[]> {
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
			return this.http.get<XDict.XSubject[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XDict.XSubject[]>(this.serviceURL + '/XSubject/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
		
	}
 
	   //Create XSubject
    create_XSubject(XSubject: XDict.XSubject): Observable<Object > {
       // XSubject.XSubjectId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/XSubject/', XSubject, { headers: cpHeaders })
		
    }
	
	//Fetch XSubject by id
    get_XSubjectById(XSubjectId: string): Observable<XDict.XSubject> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/XSubject/'+ XSubjectId)
        return this.http.get<XDict.XSubject>(this.serviceURL + '/XSubject/' + XSubjectId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update XSubject
    update_XSubject(XSubject: XDict.XSubject):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/XSubject/' + XSubject.XSubjectId, XSubject, { headers: cpHeaders })
    }
	
    //Delete XSubject	
    delete_XSubjectById(XSubjectId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/XSubject/' + XSubjectId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XDict.XSubject = null;
	
	public 	get Selected():XDict.XSubject{ return this.mSelecetd;}
	
	public  set Selected(_XSubject:XDict.XSubject){ this.mSelecetd=_XSubject; }
 
}
