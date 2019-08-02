import { Injectable } from '@angular/core'; 
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http'; 
import { Observable,BehaviorSubject } from 'rxjs'; 
import { environment } from '../environments/environment';

import { XInstructor } from "app/XInstructor";
import { XCourse } from "app/XCourse";
import { XUser } from "app/XUser";
import { XEDUPROG } from "app/XEDUPROG";
import { XSchedule } from "app/XSchedule";
import { XDict } from "app/XDict";
import { UserProfile } from "app/UserProfile";
	
export class ComboInfo{ 
	id:string; 
	name:string; 
} 
 

 
@Injectable() 
export class AppService { 
	private serviceURL: string = environment.baseAppUrl; 
	 
	public isLoggedIn:boolean=false;
	
	private _newrole:boolean=true;
	private _role:string="";
	
	private _newuser:boolean=true;
	private _user:string="";

	private _newchecker:boolean=true;
	private _checker:string="";
	
	
	private myToken:UserProfile.TokenInfo={} as UserProfile.TokenInfo;
	private authResponce:any;
	private UserInfo: UserProfile.LoggedUserInfo;
	
	
	public GetToken():string {
		return this.myToken.access_token;
		}

	public jwtLogin(email:string,password:string, callback, errorCallback){
		let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		var li:UserProfile.LoginRequest = new UserProfile.LoginRequest();
		li.email = email;
		li.password = password; 
		//console.log("Send: "+JSON.stringify( li));
		this.http.post(this.serviceURL + '/account/login',JSON.stringify( li) , { headers: cpHeaders }).subscribe(
		    Data => {
				this.authResponce=Data;
				//console.log("RcvAuth: " + JSON.stringify(this.authResponce));
				this.myToken=this.authResponce.data;
				if(	  this.myToken != null ){
					 sessionStorage.setItem('auth_token', this.myToken.access_token);
					 //console.log("Rcv: " + JSON.stringify(this.myToken));
					 this.jwtUserInfo(callback);
					  setTimeout(this.jwtRefresh.bind(this),(this.myToken.expires_in-5) * 1000);
				}else{
					if(typeof errorCallback =='function'){
					  errorCallback(this.authResponce.description);
					}
				}
		    }, 
			error => {
				if(typeof errorCallback == 'function'){ 
					errorCallback(error.message); 
				} 
			}
		); 

    }
	
	

	
	
	public jwtLogout(){
		if(this.isLoggedIn){
			 let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
			 
			 this.http.get(this.serviceURL + '/account/logout' , { headers: cpHeaders }).subscribe(Data => {
					 this.authResponce='';
					 this.myToken=null;
					 sessionStorage.setItem('auth_token', '');
					 this.Role ='';
					 this.User ='';
					 this.isLoggedIn=false;
				 }); 
		}

    }
	

	public jwtRefresh(){
	 //console.log("jwtRefresh")
	 let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
	 // let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
	 var li:UserProfile.RefreshTokenRequest = new UserProfile.RefreshTokenRequest();
	 li.RefreshToken = this.myToken.refresh_token
	 //console.log("Send: "+JSON.stringify( li));
	
     this.http.post(this.serviceURL + '/account/refreshtoken',JSON.stringify( li) , { headers: cpHeaders }).subscribe(
		 Data => {
			 
			 this.authResponce=Data;
			 //console.log("RcvAuth: " + JSON.stringify(this.authResponce));
			 this.myToken=this.authResponce.data;
			 
			if(	  this.myToken != null ){
				sessionStorage.setItem('auth_token', this.myToken.access_token);
				//console.log("Rcv: " + JSON.stringify(this.myToken));
				//this.jwtUserInfo(function() {});
				setTimeout(this.jwtRefresh.bind(this),(this.myToken.expires_in-5) * 1000);
			}else{
				this.authResponce='';
				this.myToken=null;
				sessionStorage.setItem('auth_token', '');
				this.Role ='';
				this.User ='';
				this.isLoggedIn=false;
				console.log("Token expiered, Logoff loccally");
			}
		}
		, 
		error => {
				this.authResponce='';
				this.myToken=null;
				sessionStorage.setItem('auth_token', '');
				this.Role ='';
				this.User ='';
				this.isLoggedIn=false;
				console.log("Token refresh error, Logoff loccally");
		}
	 
	 ); 
    }
	
	
	public jwtUserInfo(callback){
	     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ this.myToken.access_token})
         this.http.post(this.serviceURL + '/account/private',"", { headers: cpHeaders }).subscribe(Data => {
			 this.UserInfo=Data as UserProfile.LoggedUserInfo;
			 //console.log("Rcv user info: " + JSON.stringify(this.UserInfo));
			 this.Role =this.UserInfo.roles;
			 this.User =this.UserInfo.id;
			 
			 this.isLoggedIn=true;
			 if(typeof callback =='function'){
				 callback();
			 }
			 
			 
			 /*
			 // add users
			 
			 {
			 let u= new NewUserInfo();
			 u.email="super@ruex.ru";
			 u.password="super_Password";
			 u.role="SUPERADMIN";
			 u.firstName="Акаунт";
			 u.lastName="Администратор";
			 u.OrganizationId ="24053220-C278-4EC2-E975-08D561A3D6EB";
		     this.jwtRegisterUser(u); 
			 }
			 {
			 let u= new NewUserInfo();
			 u.email="admin@ruex.ru";
			 u.password="admin_Password";
			 u.role="Администратор";
			 u.firstName="Системный";
			 u.lastName="Администратор";
		     */
		 
		 }); 
    }
	
	public jwtRegisterUser(u:UserProfile.NewUserInfo){
	 let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
     this.http.post(this.serviceURL + '/account/adduser',JSON.stringify(u) , { headers: cpHeaders }).subscribe(Data => {
		 //console.log("RcvAuth: " + JSON.stringify(Data));
	 }); 
    }


public SelectedRole = new BehaviorSubject<string>(""); 
	
	
	public get Role()
    {
        return this._role;
    }
    public set Role(value)
    {
		this._newrole=true;
        this._role = value;
		console.log("AppService: role set to " + this._role);
		this.SelectedRole.next(this._role); 
    }
	
	public currentRole = this.SelectedRole.asObservable(); 
	
	
	
	public get User()
    {
        return this._user;
    }
    public set User(value)
    {
		this._newuser=true;
        this._user = value;
		//console.log("AppService: user set to " + this._user);
		
    }
	
	
	
	 constructor(private http:HttpClient) {  
		//this.RefreshCombo(); 
	} 

		// support for Selected XInstructor.XInstructorInfo; 
	public LastXInstructorInfo:XInstructor.XInstructorInfo = {} as XInstructor.XInstructorInfo; 
	public SelectedXInstructorInfo = new BehaviorSubject<XInstructor.XInstructorInfo>({} as XInstructor.XInstructorInfo); 
	public pushSelectedXInstructorInfo(item:XInstructor.XInstructorInfo){ 
		console.log("change Selected XInstructorInfo"); 
		this.LastXInstructorInfo=item; 
		this.SelectedXInstructorInfo.next(item); 
		 
	} 
	public currentXInstructorInfo = this.SelectedXInstructorInfo.asObservable(); 

	// support for Selected XInstructor.XInstructorStatus; 
	public LastXInstructorStatus:XInstructor.XInstructorStatus = {} as XInstructor.XInstructorStatus; 
	public SelectedXInstructorStatus = new BehaviorSubject<XInstructor.XInstructorStatus>({} as XInstructor.XInstructorStatus); 
	public pushSelectedXInstructorStatus(item:XInstructor.XInstructorStatus){ 
		console.log("change Selected XInstructorStatus"); 
		this.LastXInstructorStatus=item; 
		this.SelectedXInstructorStatus.next(item); 
		 
	} 
	public currentXInstructorStatus = this.SelectedXInstructorStatus.asObservable(); 


	// support for Selected XCourse.XCourseDesc; 
	public LastXCourseDesc:XCourse.XCourseDesc = {} as XCourse.XCourseDesc; 
	public SelectedXCourseDesc = new BehaviorSubject<XCourse.XCourseDesc>({} as XCourse.XCourseDesc); 
	public pushSelectedXCourseDesc(item:XCourse.XCourseDesc){ 
		console.log("change Selected XCourseDesc"); 
		this.LastXCourseDesc=item; 
		this.SelectedXCourseDesc.next(item); 
		 
	} 
	public currentXCourseDesc = this.SelectedXCourseDesc.asObservable(); 

	// support for Selected XCourse.XCourseModule; 
	public LastXCourseModule:XCourse.XCourseModule = {} as XCourse.XCourseModule; 
	public SelectedXCourseModule = new BehaviorSubject<XCourse.XCourseModule>({} as XCourse.XCourseModule); 
	public pushSelectedXCourseModule(item:XCourse.XCourseModule){ 
		console.log("change Selected XCourseModule"); 
		this.LastXCourseModule=item; 
		this.SelectedXCourseModule.next(item); 
		 
	} 
	public currentXCourseModule = this.SelectedXCourseModule.asObservable(); 

	// support for Selected XCourse.XChepter; 
	public LastXChepter:XCourse.XChepter = {} as XCourse.XChepter; 
	public SelectedXChepter = new BehaviorSubject<XCourse.XChepter>({} as XCourse.XChepter); 
	public pushSelectedXChepter(item:XCourse.XChepter){ 
		console.log("change Selected XChepter"); 
		this.LastXChepter=item; 
		this.SelectedXChepter.next(item); 
		 
	} 
	public currentXChepter = this.SelectedXChepter.asObservable(); 

	// support for Selected XCourse.XCoursePrice; 
	public LastXCoursePrice:XCourse.XCoursePrice = {} as XCourse.XCoursePrice; 
	public SelectedXCoursePrice = new BehaviorSubject<XCourse.XCoursePrice>({} as XCourse.XCoursePrice); 
	public pushSelectedXCoursePrice(item:XCourse.XCoursePrice){ 
		console.log("change Selected XCoursePrice"); 
		this.LastXCoursePrice=item; 
		this.SelectedXCoursePrice.next(item); 

	} 
	public currentXCoursePrice = this.SelectedXCoursePrice.asObservable(); 
		 

	// support for Selected XUser.XUserInfo; 
	public LastXUserInfo:XUser.XUserInfo = {} as XUser.XUserInfo; 
	public SelectedXUserInfo = new BehaviorSubject<XUser.XUserInfo>({} as XUser.XUserInfo); 
	public pushSelectedXUserInfo(item:XUser.XUserInfo){ 
		console.log("change Selected XUserInfo"); 
		this.LastXUserInfo=item; 
		this.SelectedXUserInfo.next(item); 
		 
	} 
	public currentXUserInfo = this.SelectedXUserInfo.asObservable(); 

	// support for Selected XUser.XSubscription; 
	public LastXSubscription:XUser.XSubscription = {} as XUser.XSubscription; 
	public SelectedXSubscription = new BehaviorSubject<XUser.XSubscription>({} as XUser.XSubscription); 
	public pushSelectedXSubscription(item:XUser.XSubscription){ 
		console.log("change Selected XSubscription"); 
		this.LastXSubscription=item; 
		this.SelectedXSubscription.next(item); 
		 
	} 
	public currentXSubscription = this.SelectedXSubscription.asObservable(); 

	// support for Selected XUser.XUserPurchase; 
	public LastXUserPurchase:XUser.XUserPurchase = {} as XUser.XUserPurchase; 
	public SelectedXUserPurchase = new BehaviorSubject<XUser.XUserPurchase>({} as XUser.XUserPurchase); 
	public pushSelectedXUserPurchase(item:XUser.XUserPurchase){ 
		console.log("change Selected XUserPurchase"); 
		this.LastXUserPurchase=item; 
		this.SelectedXUserPurchase.next(item); 
		 
	} 
	public currentXUserPurchase = this.SelectedXUserPurchase.asObservable(); 

	// support for Selected XUser.XUserProfile; 
	public LastXUserProfile:XUser.XUserProfile = {} as XUser.XUserProfile; 
	public SelectedXUserProfile = new BehaviorSubject<XUser.XUserProfile>({} as XUser.XUserProfile); 
	public pushSelectedXUserProfile(item:XUser.XUserProfile){ 
		console.log("change Selected XUserProfile"); 
		this.LastXUserProfile=item; 
		this.SelectedXUserProfile.next(item); 
		 
	} 
	public currentXUserProfile = this.SelectedXUserProfile.asObservable(); 

	// support for Selected XUser.XUserRegistartion; 
	public LastXUserRegistartion:XUser.XUserRegistartion = {} as XUser.XUserRegistartion; 
	public SelectedXUserRegistartion = new BehaviorSubject<XUser.XUserRegistartion>({} as XUser.XUserRegistartion); 
	public pushSelectedXUserRegistartion(item:XUser.XUserRegistartion){ 
		console.log("change Selected XUserRegistartion"); 
		this.LastXUserRegistartion=item; 
		this.SelectedXUserRegistartion.next(item); 
		 
	} 
	public currentXUserRegistartion = this.SelectedXUserRegistartion.asObservable(); 

	// support for Selected XUser.XUserCart; 
	public LastXUserCart:XUser.XUserCart = {} as XUser.XUserCart; 
	public SelectedXUserCart = new BehaviorSubject<XUser.XUserCart>({} as XUser.XUserCart); 
	public pushSelectedXUserCart(item:XUser.XUserCart){ 
		console.log("change Selected XUserCart"); 
		this.LastXUserCart=item; 
		this.SelectedXUserCart.next(item); 
		 
	} 
	public currentXUserCart = this.SelectedXUserCart.asObservable(); 


	// support for Selected XEDUPROG.xeduprog_info; 
	public Lastxeduprog_info:XEDUPROG.xeduprog_info = {} as XEDUPROG.xeduprog_info; 
	public Selectedxeduprog_info = new BehaviorSubject<XEDUPROG.xeduprog_info>({} as XEDUPROG.xeduprog_info); 
	public pushSelectedxeduprog_info(item:XEDUPROG.xeduprog_info){ 
		console.log("change Selected xeduprog_info"); 
		this.Lastxeduprog_info=item; 
		this.Selectedxeduprog_info.next(item); 
		 
	} 
	public currentxeduprog_info = this.Selectedxeduprog_info.asObservable(); 

	// support for Selected XEDUPROG.eduprog_course; 
	public Lasteduprog_course:XEDUPROG.eduprog_course = {} as XEDUPROG.eduprog_course; 
	public Selectededuprog_course = new BehaviorSubject<XEDUPROG.eduprog_course>({} as XEDUPROG.eduprog_course); 
	public pushSelectededuprog_course(item:XEDUPROG.eduprog_course){ 
		console.log("change Selected eduprog_course"); 
		this.Lasteduprog_course=item; 
		this.Selectededuprog_course.next(item); 
		 
	} 
	public currenteduprog_course = this.Selectededuprog_course.asObservable(); 


	// support for Selected XSchedule.XScheduleItem; 
	public LastXScheduleItem:XSchedule.XScheduleItem = {} as XSchedule.XScheduleItem; 
	public SelectedXScheduleItem = new BehaviorSubject<XSchedule.XScheduleItem>({} as XSchedule.XScheduleItem); 
	public pushSelectedXScheduleItem(item:XSchedule.XScheduleItem){ 
		console.log("change Selected XScheduleItem"); 
		this.LastXScheduleItem=item; 
		this.SelectedXScheduleItem.next(item); 
		 
	} 
	public currentXScheduleItem = this.SelectedXScheduleItem.asObservable(); 

	// support for Selected XSchedule.XScheduleSubst; 
	public LastXScheduleSubst:XSchedule.XScheduleSubst = {} as XSchedule.XScheduleSubst; 
	public SelectedXScheduleSubst = new BehaviorSubject<XSchedule.XScheduleSubst>({} as XSchedule.XScheduleSubst); 
	public pushSelectedXScheduleSubst(item:XSchedule.XScheduleSubst){ 
		console.log("change Selected XScheduleSubst"); 
		this.LastXScheduleSubst=item; 
		this.SelectedXScheduleSubst.next(item); 
		 
	} 
	public currentXScheduleSubst = this.SelectedXScheduleSubst.asObservable(); 


	// support for Selected XDict.XLevel; 
	public LastXLevel:XDict.XLevel = {} as XDict.XLevel; 
	public SelectedXLevel = new BehaviorSubject<XDict.XLevel>({} as XDict.XLevel); 
	public pushSelectedXLevel(item:XDict.XLevel){ 
		console.log("change Selected XLevel"); 
		this.LastXLevel=item; 
		this.SelectedXLevel.next(item); 
		 
	} 
	public currentXLevel = this.SelectedXLevel.asObservable(); 

	// support for Selected XDict.XSubject; 
	public LastXSubject:XDict.XSubject = {} as XDict.XSubject; 
	public SelectedXSubject = new BehaviorSubject<XDict.XSubject>({} as XDict.XSubject); 
	public pushSelectedXSubject(item:XDict.XSubject){ 
		console.log("change Selected XSubject"); 
		this.LastXSubject=item; 
		this.SelectedXSubject.next(item); 
		 
	} 
	public currentXSubject = this.SelectedXSubject.asObservable(); 

	// support for Selected XDict.XVendor; 
	public LastXVendor:XDict.XVendor = {} as XDict.XVendor; 
	public SelectedXVendor = new BehaviorSubject<XDict.XVendor>({} as XDict.XVendor); 
	public pushSelectedXVendor(item:XDict.XVendor){ 
		console.log("change Selected XVendor"); 
		this.LastXVendor=item; 
		this.SelectedXVendor.next(item); 
		 
	} 
	public currentXVendor = this.SelectedXVendor.asObservable(); 

	// support for Selected XDict.XStatus; 
	public LastXStatus:XDict.XStatus = {} as XDict.XStatus; 
	public SelectedXStatus = new BehaviorSubject<XDict.XStatus>({} as XDict.XStatus); 
	public pushSelectedXStatus(item:XDict.XStatus){ 
		console.log("change Selected XStatus"); 
		this.LastXStatus=item; 
		this.SelectedXStatus.next(item); 
		 
	} 
	public currentXStatus = this.SelectedXStatus.asObservable(); 

	// support for Selected XDict.XSubscriptionType; 
	public LastXSubscriptionType:XDict.XSubscriptionType = {} as XDict.XSubscriptionType; 
	public SelectedXSubscriptionType = new BehaviorSubject<XDict.XSubscriptionType>({} as XDict.XSubscriptionType); 
	public pushSelectedXSubscriptionType(item:XDict.XSubscriptionType){ 
		console.log("change Selected XSubscriptionType"); 
		this.LastXSubscriptionType=item; 
		this.SelectedXSubscriptionType.next(item); 
		 
	} 
	public currentXSubscriptionType = this.SelectedXSubscriptionType.asObservable(); 

	// support for Selected XDict.XCert; 
	public LastXCert:XDict.XCert = {} as XDict.XCert; 
	public SelectedXCert = new BehaviorSubject<XDict.XCert>({} as XDict.XCert); 
	public pushSelectedXCert(item:XDict.XCert){ 
		console.log("change Selected XCert"); 
		this.LastXCert=item; 
		this.SelectedXCert.next(item); 
		 
	} 
	public currentXCert = this.SelectedXCert.asObservable(); 

 
	public ComboXInstructorInfo:Array<ComboInfo> = []; 
	public getXInstructorInfo(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/XInstructorInfo/Combo', { headers: cpHeaders }); 
 }
	public refreshComboXInstructorInfo() { 
	this.getXInstructorInfo().subscribe(Data => {this.ComboXInstructorInfo=Data;});
 }
	public ComboXInstructorStatus:Array<ComboInfo> = []; 
	public getXInstructorStatus(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/XInstructorStatus/Combo', { headers: cpHeaders }); 
 }
	public refreshComboXInstructorStatus() { 
	this.getXInstructorStatus().subscribe(Data => {this.ComboXInstructorStatus=Data;});
 }

	public ComboXCourseDesc:Array<ComboInfo> = []; 
	public getXCourseDesc(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/XCourseDesc/Combo', { headers: cpHeaders }); 
 }
	public refreshComboXCourseDesc() { 
	this.getXCourseDesc().subscribe(Data => {this.ComboXCourseDesc=Data;});
 }
	public ComboXCourseModule:Array<ComboInfo> = []; 
	public getXCourseModule(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/XCourseModule/Combo', { headers: cpHeaders }); 
 }
	public refreshComboXCourseModule() { 
	this.getXCourseModule().subscribe(Data => {this.ComboXCourseModule=Data;});
 }
	public ComboXChepter:Array<ComboInfo> = []; 
	public getXChepter(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/XChepter/Combo', { headers: cpHeaders }); 
 }
	public refreshComboXChepter() { 
	this.getXChepter().subscribe(Data => {this.ComboXChepter=Data;});
 }
	public ComboXCoursePrice:Array<ComboInfo> = []; 
	public getXCoursePrice(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/XCoursePrice/Combo', { headers: cpHeaders }); 
 }
	public refreshComboXCoursePrice() { 
	this.getXCoursePrice().subscribe(Data => {this.ComboXCoursePrice=Data;});
 }

	public ComboXUserInfo:Array<ComboInfo> = []; 
	public getXUserInfo(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/XUserInfo/Combo', { headers: cpHeaders }); 
 }
	public refreshComboXUserInfo() { 
	this.getXUserInfo().subscribe(Data => {this.ComboXUserInfo=Data;});
 }
	public ComboXSubscription:Array<ComboInfo> = []; 
	public getXSubscription(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/XSubscription/Combo', { headers: cpHeaders }); 
 }
	public refreshComboXSubscription() { 
	this.getXSubscription().subscribe(Data => {this.ComboXSubscription=Data;});
 }
	public ComboXUserPurchase:Array<ComboInfo> = []; 
	public getXUserPurchase(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/XUserPurchase/Combo', { headers: cpHeaders }); 
 }
	public refreshComboXUserPurchase() { 
	this.getXUserPurchase().subscribe(Data => {this.ComboXUserPurchase=Data;});
 }
	public ComboXUserProfile:Array<ComboInfo> = []; 
	public getXUserProfile(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/XUserProfile/Combo', { headers: cpHeaders }); 
 }
	public refreshComboXUserProfile() { 
	this.getXUserProfile().subscribe(Data => {this.ComboXUserProfile=Data;});
 }
	public ComboXUserRegistartion:Array<ComboInfo> = []; 
	public getXUserRegistartion(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/XUserRegistartion/Combo', { headers: cpHeaders }); 
 }
	public refreshComboXUserRegistartion() { 
	this.getXUserRegistartion().subscribe(Data => {this.ComboXUserRegistartion=Data;});
 }
	public ComboXUserCart:Array<ComboInfo> = []; 
	public getXUserCart(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/XUserCart/Combo', { headers: cpHeaders }); 
 }
	public refreshComboXUserCart() { 
	this.getXUserCart().subscribe(Data => {this.ComboXUserCart=Data;});
 }

	public Comboxeduprog_info:Array<ComboInfo> = []; 
	public getxeduprog_info(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/xeduprog_info/Combo', { headers: cpHeaders }); 
 }
	public refreshComboxeduprog_info() { 
	this.getxeduprog_info().subscribe(Data => {this.Comboxeduprog_info=Data;});
 }
	public Comboeduprog_course:Array<ComboInfo> = []; 
	public geteduprog_course(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/eduprog_course/Combo', { headers: cpHeaders }); 
 }
	public refreshComboeduprog_course() { 
	this.geteduprog_course().subscribe(Data => {this.Comboeduprog_course=Data;});
 }

	public ComboXScheduleItem:Array<ComboInfo> = []; 
	public getXScheduleItem(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/XScheduleItem/Combo', { headers: cpHeaders }); 
 }
	public refreshComboXScheduleItem() { 
	this.getXScheduleItem().subscribe(Data => {this.ComboXScheduleItem=Data;});
 }
	public ComboXScheduleSubst:Array<ComboInfo> = []; 
	public getXScheduleSubst(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/XScheduleSubst/Combo', { headers: cpHeaders }); 
 }
	public refreshComboXScheduleSubst() { 
	this.getXScheduleSubst().subscribe(Data => {this.ComboXScheduleSubst=Data;});
 }

	public ComboXLevel:Array<ComboInfo> = []; 
	public getXLevel(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/XLevel/Combo', { headers: cpHeaders }); 
 }
	public refreshComboXLevel() { 
	this.getXLevel().subscribe(Data => {this.ComboXLevel=Data;});
 }
	public ComboXSubject:Array<ComboInfo> = []; 
	public getXSubject(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/XSubject/Combo', { headers: cpHeaders }); 
 }
	public refreshComboXSubject() { 
	this.getXSubject().subscribe(Data => {this.ComboXSubject=Data;});
 }
	public ComboXVendor:Array<ComboInfo> = []; 
	public getXVendor(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/XVendor/Combo', { headers: cpHeaders }); 
 }
	public refreshComboXVendor() { 
	this.getXVendor().subscribe(Data => {this.ComboXVendor=Data;});
 }
	public ComboXStatus:Array<ComboInfo> = []; 
	public getXStatus(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/XStatus/Combo', { headers: cpHeaders }); 
 }
	public refreshComboXStatus() { 
	this.getXStatus().subscribe(Data => {this.ComboXStatus=Data;});
 }
	public ComboXSubscriptionType:Array<ComboInfo> = []; 
	public getXSubscriptionType(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/XSubscriptionType/Combo', { headers: cpHeaders }); 
 }
	public refreshComboXSubscriptionType() { 
	this.getXSubscriptionType().subscribe(Data => {this.ComboXSubscriptionType=Data;});
 }
	public ComboXCert:Array<ComboInfo> = []; 
	public getXCert(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/XCert/Combo', { headers: cpHeaders }); 
 }
	public refreshComboXCert() { 
	this.getXCert().subscribe(Data => {this.ComboXCert=Data;});
 }

 
public RefreshCombo(){
	this.getXInstructorInfo().subscribe(data => {this.ComboXInstructorInfo=data;}); 
	this.getXInstructorStatus().subscribe(data => {this.ComboXInstructorStatus=data;}); 

	this.getXCourseDesc().subscribe(data => {this.ComboXCourseDesc=data;}); 
	this.getXCourseModule().subscribe(data => {this.ComboXCourseModule=data;}); 
	this.getXChepter().subscribe(data => {this.ComboXChepter=data;}); 
	this.getXCoursePrice().subscribe(data => {this.ComboXCoursePrice=data;}); 

	this.getXUserInfo().subscribe(data => {this.ComboXUserInfo=data;}); 
	this.getXSubscription().subscribe(data => {this.ComboXSubscription=data;}); 
	this.getXUserPurchase().subscribe(data => {this.ComboXUserPurchase=data;}); 
	this.getXUserProfile().subscribe(data => {this.ComboXUserProfile=data;}); 
	this.getXUserRegistartion().subscribe(data => {this.ComboXUserRegistartion=data;}); 
	this.getXUserCart().subscribe(data => {this.ComboXUserCart=data;}); 

	this.getxeduprog_info().subscribe(data => {this.Comboxeduprog_info=data;}); 
	this.geteduprog_course().subscribe(data => {this.Comboeduprog_course=data;}); 

	this.getXScheduleItem().subscribe(data => {this.ComboXScheduleItem=data;}); 
	this.getXScheduleSubst().subscribe(data => {this.ComboXScheduleSubst=data;}); 

	this.getXLevel().subscribe(data => {this.ComboXLevel=data;}); 
	this.getXSubject().subscribe(data => {this.ComboXSubject=data;}); 
	this.getXVendor().subscribe(data => {this.ComboXVendor=data;}); 
	this.getXStatus().subscribe(data => {this.ComboXStatus=data;}); 
	this.getXSubscriptionType().subscribe(data => {this.ComboXSubscriptionType=data;}); 
	this.getXCert().subscribe(data => {this.ComboXCert=data;}); 

}
 
 // enum support

	/* StructType - Тип раздела */ 
	public enumStructTypeCombo(){
		return this.enumStructType;
	}
	enumStructType:Array<ComboInfo> =[

	 {id:'0',name:'Строка атрибутов'}
	, {id:'1',name:'Коллекция'}
	, {id:'2',name:'Дерево'}	];

	/* WFFuncParam - Вариант расшифровки параметра функции */ 
	public enumWFFuncParamCombo(){
		return this.enumWFFuncParam;
	}
	enumWFFuncParam:Array<ComboInfo> =[

	 {id:'8',name:'Роль'}
	, {id:'2',name:'Выражение'}
	, {id:'5',name:'Документ'}
	, {id:'7',name:'Поле'}
	, {id:'9',name:'Тип документа'}
	, {id:'0',name:'Значение'}
	, {id:'6',name:'Раздел'}
	, {id:'4',name:'Документ процесса'}
	, {id:'3',name:'Папка'}
	, {id:'1',name:'Значение из параметра'}	];

	/* ReportType - Вариант отчета */ 
	public enumReportTypeCombo(){
		return this.enumReportType;
	}
	enumReportType:Array<ComboInfo> =[

	 {id:'4',name:'Экспорт по Excel шаблону'}
	, {id:'0',name:'Таблица'}
	, {id:'3',name:'Экспорт по WORD шаблону'}
	, {id:'1',name:'Двумерная матрица'}
	, {id:'2',name:'Только расчет'}	];

	/* Education - Образование */ 
	public enumEducationCombo(){
		return this.enumEducation;
	}
	enumEducation:Array<ComboInfo> =[

	 {id:'-1',name:'Не важно'}
	, {id:'1',name:'Среднее'}
	, {id:'4',name:'Высшее'}
	, {id:'3',name:'Неполное высшее'}
	, {id:'0',name:'Неполное среднее'}
	, {id:'5',name:'Несколько высших'}
	, {id:'2',name:'Среднее специальное'}	];

	/* TypeStyle - Вариант трактовки типа поля */ 
	public enumTypeStyleCombo(){
		return this.enumTypeStyle;
	}
	enumTypeStyle:Array<ComboInfo> =[

	 {id:'4',name:'Ссылка'}
	, {id:'1',name:'Выражение'}
	, {id:'5',name:'Элемент оформления'}
	, {id:'3',name:'Интервал'}
	, {id:'2',name:'Перечисление'}
	, {id:'0',name:'Скалярный тип'}	];

	/* ReplicationType - Вариант репликации докуента */ 
	public enumReplicationTypeCombo(){
		return this.enumReplicationType;
	}
	enumReplicationType:Array<ComboInfo> =[

	 {id:'1',name:'Построчно'}
	, {id:'0',name:'Весь документ'}
	, {id:'2',name:'Локальный'}	];

	/* NumerationRule - Правило нумерации */ 
	public enumNumerationRuleCombo(){
		return this.enumNumerationRule;
	}
	enumNumerationRule:Array<ComboInfo> =[

	 {id:'2',name:'По кварталу'}
	, {id:'3',name:'По месяцу'}
	, {id:'0',name:'Единая зона'}
	, {id:'4',name:'По дню'}
	, {id:'1',name:'По году'}
	, {id:'10',name:'Произвольные зоны'}	];

	/* WFProcessState - Состояния процесса */ 
	public enumWFProcessStateCombo(){
		return this.enumWFProcessState;
	}
	enumWFProcessState:Array<ComboInfo> =[

	 {id:'3',name:'Pause'}
	, {id:'2',name:'Active'}
	, {id:'4',name:'Done'}
	, {id:'1',name:'Prepare'}
	, {id:'0',name:'Initial'}
	, {id:'5',name:'Processed'}	];

	/* MenuActionType - Вариант действия при выборе пункта меню */ 
	public enumMenuActionTypeCombo(){
		return this.enumMenuActionType;
	}
	enumMenuActionType:Array<ComboInfo> =[

	 {id:'4',name:'Запустить АРМ'}
	, {id:'2',name:'Выполнить метод'}
	, {id:'5',name:'Открыть отчет'}
	, {id:'0',name:'Ничего не делать'}
	, {id:'1',name:'Открыть документ'}
	, {id:'3',name:'Открыть журнал'}	];

	/* WFShortcutType - Варианты ярлыков, которые может размещать процесс */ 
	public enumWFShortcutTypeCombo(){
		return this.enumWFShortcutType;
	}
	enumWFShortcutType:Array<ComboInfo> =[

	 {id:'0',name:'Document'}
	, {id:'2',name:'Process'}
	, {id:'1',name:'Function'}	];

	/* VHAlignment - Выравнивание */ 
	public enumVHAlignmentCombo(){
		return this.enumVHAlignment;
	}
	enumVHAlignment:Array<ComboInfo> =[

	 {id:'6',name:'Right Top'}
	, {id:'7',name:'Right Center'}
	, {id:'8',name:'Right Bottom'}
	, {id:'3',name:'Center Top'}
	, {id:'0',name:'Left Top'}
	, {id:'4',name:'Center Center'}
	, {id:'1',name:'Left Center'}
	, {id:'5',name:'Center Bottom'}
	, {id:'2',name:'Left Bottom'}	];

	/* CurrencyType - Валюта платежа */ 
	public enumCurrencyTypeCombo(){
		return this.enumCurrencyType;
	}
	enumCurrencyType:Array<ComboInfo> =[

	 {id:'2',name:'Евро'}
	, {id:'0',name:'Рубль'}
	, {id:'1',name:'Доллар'}	];

	/* InfoStoreType - Тип каталога */ 
	public enumInfoStoreTypeCombo(){
		return this.enumInfoStoreType;
	}
	enumInfoStoreType:Array<ComboInfo> =[

	 {id:'2',name:'Групповой'}
	, {id:'0',name:' Общий'}
	, {id:'1',name:'Персональный'}	];

	/* DevelopmentBase - Платформа разработки */ 
	public enumDevelopmentBaseCombo(){
		return this.enumDevelopmentBase;
	}
	enumDevelopmentBase:Array<ComboInfo> =[

	 {id:'3',name:'OTHER'}
	, {id:'1',name:'DOTNET'}
	, {id:'2',name:'JAVA'}
	, {id:'0',name:'VB6'}	];

	/* Quarter - Квартал */ 
	public enumQuarterCombo(){
		return this.enumQuarter;
	}
	enumQuarter:Array<ComboInfo> =[

	 {id:'1',name:'I'}
	, {id:'4',name:'IV'}
	, {id:'0',name:'?'}
	, {id:'2',name:'II'}
	, {id:'3',name:'III'}	];

	/* Months - Месяцы */ 
	public enumMonthsCombo(){
		return this.enumMonths;
	}
	enumMonths:Array<ComboInfo> =[

	 {id:'5',name:'Май'}
	, {id:'9',name:'Сентябрь'}
	, {id:'6',name:'Июнь'}
	, {id:'12',name:'Декабрь'}
	, {id:'1',name:'Январь'}
	, {id:'8',name:'Август'}
	, {id:'2',name:'Февраль'}
	, {id:'4',name:'Апрель'}
	, {id:'7',name:'Июль'}
	, {id:'10',name:'Октябрь'}
	, {id:'3',name:'Март'}
	, {id:'11',name:'Ноябрь'}	];

	/* ColumnSortType - Вариант сортиовки данных колонки */ 
	public enumColumnSortTypeCombo(){
		return this.enumColumnSortType;
	}
	enumColumnSortType:Array<ComboInfo> =[

	 {id:'0',name:'As String'}
	, {id:'1',name:'As Numeric'}
	, {id:'2',name:'As Date'}	];

	/* Boolean - Да / Нет */ 
	public enumBooleanCombo(){
		return this.enumBoolean;
	}
	enumBoolean:Array<ComboInfo> =[

	 {id:'-1',name:'Да'}
	, {id:'0',name:'Нет'}	];

	/* JournalLinkType - Для связи журналов друг с другом */ 
	public enumJournalLinkTypeCombo(){
		return this.enumJournalLinkType;
	}
	enumJournalLinkType:Array<ComboInfo> =[

	 {id:'0',name:'Нет'}
	, {id:'4',name:'Связка ParentStructRowID  (в передлах объекта)'}
	, {id:'3',name:'Связка InstanceID (в передлах объекта)'}
	, {id:'1',name:'Ссылка на объект'}
	, {id:'2',name:'Ссылка на строку'}	];

	/* TargetType - Вариант уровня приложения, куда может генерироваться код */ 
	public enumTargetTypeCombo(){
		return this.enumTargetType;
	}
	enumTargetType:Array<ComboInfo> =[

	 {id:'0',name:'СУБД'}
	, {id:'3',name:'Документация'}
	, {id:'1',name:'МОДЕЛЬ'}
	, {id:'2',name:'Приложение'}
	, {id:'4',name:'АРМ'}	];

	/* ParityType - Четность */ 
	public enumParityTypeCombo(){
		return this.enumParityType;
	}
	enumParityType:Array<ComboInfo> =[

	 {id:'4',name:'Space'}
	, {id:'3',name:'Mark'}
	, {id:'2',name:'Odd'}
	, {id:'0',name:'None'}
	, {id:'1',name:'Even'}	];

	/* MesureFormat - Формат индикатора */ 
	public enumMesureFormatCombo(){
		return this.enumMesureFormat;
	}
	enumMesureFormat:Array<ComboInfo> =[

	 {id:'0',name:'Число'}
	, {id:'1',name:'Дата'}
	, {id:'4',name:'Объект'}
	, {id:'2',name:'Справочник'}
	, {id:'5',name:'Текст'}	];

	/* ExportType - Тип экспорта */ 
	public enumExportTypeCombo(){
		return this.enumExportType;
	}
	enumExportType:Array<ComboInfo> =[

	 {id:'3',name:'Сайт и МБ'}
	, {id:'1',name:'Сайт'}
	, {id:'0',name:'Нет'}	];

	/* WFStepClass - Тип шага процесса */ 
	public enumWFStepClassCombo(){
		return this.enumWFStepClass;
	}
	enumWFStepClass:Array<ComboInfo> =[

	 {id:'3',name:'PeriodicFunction'}
	, {id:'0',name:'SimpleFunction'}
	, {id:'2',name:'StopFunction'}
	, {id:'1',name:'StartFunction'}	];

	/* DayInWeek - День недели */ 
	public enumDayInWeekCombo(){
		return this.enumDayInWeek;
	}
	enumDayInWeek:Array<ComboInfo> =[

	 {id:'4',name:'Четверг'}
	, {id:'6',name:'Суббота'}
	, {id:'1',name:'Понедельник'}
	, {id:'7',name:'Воскресенье'}
	, {id:'2',name:'Вторник'}
	, {id:'5',name:'Пятница'}
	, {id:'3',name:'Среда'}	];

	/* GeneratorStyle - GeneratorStyle */ 
	public enumGeneratorStyleCombo(){
		return this.enumGeneratorStyle;
	}
	enumGeneratorStyle:Array<ComboInfo> =[

	 {id:'0',name:'Один тип'}
	, {id:'1',name:'Все типы сразу'}	];

	/* PlatType - Тип плательщика */ 
	public enumPlatTypeCombo(){
		return this.enumPlatType;
	}
	enumPlatType:Array<ComboInfo> =[

	 {id:'1',name:'Получатель'}
	, {id:'0',name:'Отправитель'}
	, {id:'2',name:'Другой'}	];

	/* msgState - Состояние заявки */ 
	public enummsgStateCombo(){
		return this.enummsgState;
	}
	enummsgState:Array<ComboInfo> =[

	 {id:'1',name:'Сообщено абоненту'}
	, {id:'3',name:'Промежуточный ответ'}
	, {id:'0',name:'Состояние заявки'}
	, {id:'2',name:'Абонент не ответил'}	];

	/* OnJournalRowClick - действие при открытии строки журнала */ 
	public enumOnJournalRowClickCombo(){
		return this.enumOnJournalRowClick;
	}
	enumOnJournalRowClick:Array<ComboInfo> =[

	 {id:'2',name:'Открыть документ'}
	, {id:'0',name:'Ничего не делать'}
	, {id:'1',name:'Открыть строку'}	];

	/* PartType - PartType */ 
	public enumPartTypeCombo(){
		return this.enumPartType;
	}
	enumPartType:Array<ComboInfo> =[

	 {id:'1',name:'Коллекция'}
	, {id:'2',name:'Дерево'}
	, {id:'0',name:'Строка'}
	, {id:'4',name:'Расширение с данными'}
	, {id:'3',name:'Расширение'}	];

	/* ReferenceType - ReferenceType */ 
	public enumReferenceTypeCombo(){
		return this.enumReferenceType;
	}
	enumReferenceType:Array<ComboInfo> =[

	 {id:'3',name:'На источник данных'}
	, {id:'0',name:'Скалярное поле ( не ссылка)'}
	, {id:'2',name:'На строку раздела'}
	, {id:'1',name:'На объект '}	];

	/* stateNomen -  */ 
	public enumstateNomenCombo(){
		return this.enumstateNomen;
	}
	enumstateNomen:Array<ComboInfo> =[

	 {id:'4',name:'Доставлено'}
	, {id:'2',name:'Принято'}
	, {id:'3',name:'В процессе'}
	, {id:'6',name:'Переадресация'}
	, {id:'0',name:'Оформляется'}
	, {id:'5',name:'Возврат'}	];

	/* ConditionType - Варианты условий */ 
	public enumConditionTypeCombo(){
		return this.enumConditionType;
	}
	enumConditionType:Array<ComboInfo> =[

	 {id:'6',name:'<'}
	, {id:'4',name:'>='}
	, {id:'7',name:'<='}
	, {id:'0',name:'none'}
	, {id:'1',name:'='}
	, {id:'8',name:'like'}
	, {id:'3',name:'>'}
	, {id:'2',name:'<>'}	];

	/* FolderType - Тип папки */ 
	public enumFolderTypeCombo(){
		return this.enumFolderType;
	}
	enumFolderType:Array<ComboInfo> =[

	 {id:'3',name:'Удаленные'}
	, {id:'1',name:'Входящие'}
	, {id:'9',name:'Отложенные'}
	, {id:'4',name:'Журнал'}
	, {id:'2',name:'Исходящие'}
	, {id:'7',name:'Черновики'}
	, {id:'6',name:'Отправленные'}
	, {id:'8',name:'В работе'}
	, {id:'5',name:'Календарь'}
	, {id:'10',name:'Завершенные'}
	, {id:'0',name:'cls__'}	];

	/* msgResult - Результат */ 
	public enummsgResultCombo(){
		return this.enummsgResult;
	}
	enummsgResult:Array<ComboInfo> =[

	 {id:'2',name:'Выполнено'}
	, {id:'1',name:'В работе'}
	, {id:'0',name:'Результат'}	];

	/* PartAddBehaivor - Поведение при добавлении строки раздела */ 
	public enumPartAddBehaivorCombo(){
		return this.enumPartAddBehaivor;
	}
	enumPartAddBehaivor:Array<ComboInfo> =[

	 {id:'0',name:'AddForm'}
	, {id:'2',name:'RunAction'}
	, {id:'1',name:'RefreshOnly'}	];

	/* ExtentionType - Тип расширения */ 
	public enumExtentionTypeCombo(){
		return this.enumExtentionType;
	}
	enumExtentionType:Array<ComboInfo> =[

	 {id:'6',name:'VerifyRowExt'}
	, {id:'7',name:'CodeGenerator'}
	, {id:'5',name:'DefaultExt'}
	, {id:'0',name:'StatusExt'}
	, {id:'4',name:'JrnlRunExt'}
	, {id:'2',name:'CustomExt'}
	, {id:'8',name:'ARMGenerator'}
	, {id:'1',name:'OnFormExt'}
	, {id:'3',name:'JrnlAddExt'}	];

	/* Sex - Мужской / Женский */ 
	public enumSexCombo(){
		return this.enumSex;
	}
	enumSex:Array<ComboInfo> =[

	 {id:'0',name:'Не существенно'}
	, {id:'2',name:'Мужской'}
	, {id:'1',name:'Женский'}	];

	/* YesNo - Да / Нет (0 или 1) */ 
	public enumYesNoCombo(){
		return this.enumYesNo;
	}
	enumYesNo:Array<ComboInfo> =[

	 {id:'1',name:'Да'}
	, {id:'0',name:'Нет'}	];

	/* AggregationType - Вариант агрегации по полю */ 
	public enumAggregationTypeCombo(){
		return this.enumAggregationType;
	}
	enumAggregationType:Array<ComboInfo> =[

	 {id:'3',name:'SUM'}
	, {id:'1',name:'AVG'}
	, {id:'6',name:'CUSTOM'}
	, {id:'0',name:'none'}
	, {id:'2',name:'COUNT'}
	, {id:'5',name:'MAX'}
	, {id:'4',name:'MIN'}	];

	/* WFFuncState - Состояние функции в бизнес процессе */ 
	public enumWFFuncStateCombo(){
		return this.enumWFFuncState;
	}
	enumWFFuncState:Array<ComboInfo> =[

	 {id:'8',name:'Processed'}
	, {id:'3',name:'InWork'}
	, {id:'4',name:'Pause'}
	, {id:'6',name:'InControl'}
	, {id:'2',name:'Active'}
	, {id:'5',name:'Ready'}
	, {id:'7',name:'Done'}
	, {id:'1',name:'Prepare'}
	, {id:'0',name:'Initial'}	];

	/* Employment - Занятость */ 
	public enumEmploymentCombo(){
		return this.enumEmployment;
	}
	enumEmployment:Array<ComboInfo> =[

	 {id:'1',name:'Частичная'}
	, {id:'-1',name:'Не важно'}
	, {id:'0',name:'Полная'}	];

	/* TriState - Да / Нет / Не определено */ 
	public enumTriStateCombo(){
		return this.enumTriState;
	}
	enumTriState:Array<ComboInfo> =[

	 {id:'-1',name:'Не существенно'}
	, {id:'1',name:'Да'}
	, {id:'0',name:'Нет'}	];
 
}
