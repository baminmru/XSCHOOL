using x_srv.models;
using System;
using System.Collections.Generic;
using System.Text;

namespace x_srv.Services.Users.Data
{
    public class GetUserProfileRequest
    {
        public Guid Id { get; set; }
    }
    public class GetUserProfileResponse
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public string Phone { get; set; }
        public Guid? OrganizationId { get; set; }



        public string FullName
        {
            get
            {
                return $"{FirstName} {MiddleName} {LastName}";
            }
        }
        public Guid LoginId { get; set; }


        public GetUserProfileResponse()
        {

        }

        public GetUserProfileResponse(XUserInfo user)
        {
            Id = user.XUserInfoId ;
            FirstName = user.Name;
            MiddleName = user.SurName ;
            LastName = user.Family ;
            Phone = user.Phone ;
            LoginId = new Guid(user.Login ) ;
            //OrganizationId = user.theClient ;
           
        }
    }

}
