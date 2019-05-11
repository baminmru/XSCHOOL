


	 delete from XInstructorStatus where XInstructorInfoId not in ( select XInstructorInfoId from XInstructorInfo) 
	 go 
	 ALTER TABLE XInstructorStatus 
                                ADD CONSTRAINT FK_XInstructorStatus_Parent
                                FOREIGN KEY (XInstructorInfoId)
                                REFERENCES XInstructorInfo (XInstructorInfoId)
                                ON DELETE CASCADE 
	 go 


	 delete from XCourseModule where XCourseDescId not in ( select XCourseDescId from XCourseDesc) 
	 go 
	 ALTER TABLE XCourseModule 
                                ADD CONSTRAINT FK_XCourseModule_Parent
                                FOREIGN KEY (XCourseDescId)
                                REFERENCES XCourseDesc (XCourseDescId)
                                ON DELETE CASCADE 
	 go 

	 delete from XChepter where XCourseModuleId not in ( select XCourseModuleId from XCourseModule) 
	 go 
	 ALTER TABLE XChepter 
                ADD CONSTRAINT FK_XChepter_Parent
                FOREIGN KEY (XCourseModuleId)
                REFERENCES XCourseModule (XCourseModuleId)
                ON DELETE CASCADE 
	 go 


	 delete from XSubscription where XUserInfoId not in ( select XUserInfoId from XUserInfo) 
	 go 
	 ALTER TABLE XSubscription 
                                ADD CONSTRAINT FK_XSubscription_Parent
                                FOREIGN KEY (XUserInfoId)
                                REFERENCES XUserInfo (XUserInfoId)
                                ON DELETE CASCADE 
	 go 

	 delete from XUserPurchase where XUserInfoId not in ( select XUserInfoId from XUserInfo) 
	 go 
	 ALTER TABLE XUserPurchase 
                                ADD CONSTRAINT FK_XUserPurchase_Parent
                                FOREIGN KEY (XUserInfoId)
                                REFERENCES XUserInfo (XUserInfoId)
                                ON DELETE CASCADE 
	 go 

	 delete from XUserProfile where XUserInfoId not in ( select XUserInfoId from XUserInfo) 
	 go 
	 ALTER TABLE XUserProfile 
                                ADD CONSTRAINT FK_XUserProfile_Parent
                                FOREIGN KEY (XUserInfoId)
                                REFERENCES XUserInfo (XUserInfoId)
                                ON DELETE CASCADE 
	 go 

	 delete from XUserRegistartion where XUserInfoId not in ( select XUserInfoId from XUserInfo) 
	 go 
	 ALTER TABLE XUserRegistartion 
                                ADD CONSTRAINT FK_XUserRegistartion_Parent
                                FOREIGN KEY (XUserInfoId)
                                REFERENCES XUserInfo (XUserInfoId)
                                ON DELETE CASCADE 
	 go 

	 delete from XUserCart where XUserInfoId not in ( select XUserInfoId from XUserInfo) 
	 go 
	 ALTER TABLE XUserCart 
                                ADD CONSTRAINT FK_XUserCart_Parent
                                FOREIGN KEY (XUserInfoId)
                                REFERENCES XUserInfo (XUserInfoId)
                                ON DELETE CASCADE 
	 go 





